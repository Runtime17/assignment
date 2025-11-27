import { createMachine, assign, fromPromise } from 'xstate';
import { generateText } from '../services/aiService';
import type { EditorContext } from '../types';

export const editorMachine = createMachine({
  id: 'editor',
  initial: 'idle',
  types: {} as {
    context: EditorContext;
    events:
      | { type: 'CONTINUE_WRITING'; editorContent: string }
      | { type: 'GENERATION_COMPLETE'; text: string }
      | { type: 'GENERATION_ERROR'; error: string }
      | { type: 'ACCEPT_PREVIEW' }
      | { type: 'REJECT_PREVIEW' }
      | { type: 'RESET' };
  },
  context: {
    editorContent: '',
    generatedText: '',
    error: null,
    isLoading: false,
  },
  states: {
    idle: {
      on: {
        CONTINUE_WRITING: {
          target: 'generating',
          actions: assign({
            editorContent: ({ event }) => event.editorContent,
            error: null,
            isLoading: true,
          }),
        },
      },
    },
    generating: {
      invoke: {
        src: 'generateTextService',
        input: ({ context }) => ({ prompt: context.editorContent }),
        onDone: {
          target: 'previewing',
          actions: assign({
            generatedText: ({ event }) => event.output.text,
            isLoading: false,
          }),
        },
        onError: {
          target: 'error',
          actions: assign({
            error: ({ event }) => {
              const errorMessage = event.error instanceof Error
                ? event.error.message
                : 'An unknown error occurred';
              return errorMessage;
            },
            isLoading: false,
          }),
        },
      },
    },
    previewing: {
      on: {
        ACCEPT_PREVIEW: {
          target: 'inserting',
        },
        REJECT_PREVIEW: {
          target: 'idle',
          actions: assign({
            generatedText: '',
          }),
        },
      },
    },
    inserting: {
      entry: assign({
        generatedText: '',
      }),
      after: {
        100: 'idle', // Brief delay to allow UI update, then return to idle
      },
    },
    error: {
      on: {
        RESET: {
          target: 'idle',
          actions: assign({
            error: null,
            generatedText: '',
            isLoading: false,
          }),
        },
        CONTINUE_WRITING: {
          target: 'generating',
          actions: assign({
            editorContent: ({ event }) => event.editorContent,
            error: null,
            isLoading: true,
          }),
        },
      },
    },
  },
}).provide({
  actors: {
    generateTextService: fromPromise(async ({ input }: { input: { prompt: string } }) => {
      const result = await generateText(input.prompt);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    }),
  },
});
