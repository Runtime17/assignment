import { HfInference } from '@huggingface/inference';
import type { AIServiceResponse, AIServiceOptions } from '../types';

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

// We stick to the Instruct models as they are the most reliably hosted
const MODELS = [
  'openai/gpt-oss-20b',
  'moonshotai/Kimi-K2-Instruct-0905',
  'Qwen/Qwen3-32B',
];

export async function generateText(
  prompt: string,
  options: AIServiceOptions = {}
): Promise<AIServiceResponse> {
  const {
    maxTokens = 5000, // Keep this low for autocomplete
    temperature = 0.5,
    topP = 0.9,
  } = options;

  if (!prompt || prompt.trim().length === 0) {
    return { text: '', error: 'Please provide some text before continuing.' };
  }

  // Combine instructions + prompt into a single 'user' message
  // This bypasses the "System role not supported" error on many free providers
  const finalPrompt = `Instructions: You are a code completion engine. Continue the text naturally. Do not repeat the input. Output only the continuation and avoid mentioning lanugauges, just continue with the code\n\nText to complete:\n${prompt}`;

  for (const model of MODELS) {
    try {
      console.log(`Attempting to generate with model: ${model}`);

      const result = await hf.chatCompletion({
        model,
        messages: [
          // FIX: Only use 'user' role. We merged the system prompt above.
          { role: "user", content: finalPrompt }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
        top_p: topP,
      });

      const generatedText = result.choices[0].message.content?.trim();

      if (!generatedText) {
        console.warn(`Model ${model} returned empty text, trying next model...`);
        continue;
      }

      console.log(`Successfully generated text with model: ${model}`);
      return {
        text: generatedText,
      };

    } catch (error) {
      console.error(`Error with model ${model}:`, error);

      if (model === MODELS[MODELS.length - 1]) {
        return {
          text: '',
          error: getErrorMessage(error),
        };
      }
      console.log(`Trying next model in fallback chain...`);
    }
  }

  return {
    text: '',
    error: 'All models failed to generate text. Please try again later.',
  };
}

// ... existing helper functions (getErrorMessage, testConnection) ...
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    // 400 errors often manifest as "providerapierror" or generic "bad request"
    if (message.includes('400') || message.includes('bad request')) {
      return 'The AI provider rejected the request format. Please try again later.';
    }
    if (message.includes('rate limit')) return 'Rate limit exceeded. Please wait a moment and try again.';
    if (message.includes('network') || message.includes('fetch')) return 'Network error. Please check your connection and try again.';
    return `Error: ${error.message}`;
  }
  return 'An unexpected error occurred. Please try again.';
}
export async function testConnection(): Promise<boolean> {
  try {
    const result = await generateText('Hello, this is a test.', { maxTokens: 10 });
    return !result.error;
  } catch {
    return false;
  }
}