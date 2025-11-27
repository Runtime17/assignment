# AI-Assisted Editor

A modern, feature-rich text editor with AI-powered text continuation capabilities, built with React, TypeScript, ProseMirror, and XState.

## Features

- **Rich Text Editing**: Full-featured WYSIWYG editor with formatting support
  - Bold, Italic, Code styling
  - Headings (H1, H2, H3)
  - Bullet and numbered lists
  - Paragraph formatting

- **AI Text Continuation**: Intelligent text generation powered by Hugging Face
  - Click "Continue Writing" to generate contextual text
  - Preview generated content before insertion
  - Accept or reject AI suggestions
  - Multiple model fallback for reliability

- **State Management**: Robust state handling with XState
  - Clear state transitions (idle → generating → previewing → inserting)
  - Error handling with user-friendly messages
  - Loading states for better UX

- **Undo/Redo**: Full history support for all editor operations
  - Keyboard shortcuts (Ctrl+Z / Ctrl+Y)
  - Works seamlessly with AI-generated content

## Architecture

### Tech Stack

- **React 18**: Modern UI library with hooks
- **TypeScript**: Type-safe development
- **ProseMirror**: Powerful rich text editing framework
- **XState**: State machine for predictable state management
- **Hugging Face Inference API**: Free AI text generation
- **Vite**: Fast development and optimized builds

### Project Structure

```
src/
├── components/
│   ├── Editor.tsx              # ProseMirror editor integration
│   ├── EditorToolbar.tsx       # Formatting controls
│   ├── ContinueButton.tsx      # AI generation trigger
│   └── PreviewPanel.tsx        # AI text preview UI
├── machines/
│   └── editorMachine.ts        # XState state machine
├── prosemirror/
│   ├── schema.ts               # Document schema definition
│   ├── plugins.ts              # Editor plugins (history, keymap)
│   └── commands.ts             # Formatting commands
├── services/
│   └── aiService.ts            # Hugging Face API integration
├── types/
│   └── index.ts                # TypeScript type definitions
├── App.tsx                     # Main application component
└── main.tsx                    # Application entry point
```

### XState Machine Design

The editor uses a finite state machine with the following states:

```
idle → generating → previewing → inserting → idle
  ↓                     ↓
  └──────── error ──────┘
```

**States:**
- `idle`: Ready for user input, Continue Writing button enabled
- `generating`: AI is generating text, loading spinner shown
- `previewing`: AI text displayed in preview panel with Accept/Reject options
- `inserting`: Brief transition state while inserting accepted text
- `error`: Error occurred, error banner displayed with retry option

**Context:**
- `editorContent`: Current text in editor
- `generatedText`: AI-generated text for preview
- `error`: Error message if any
- `isLoading`: Loading state flag

### ProseMirror Integration

**Schema:**
- Based on `prosemirror-schema-basic` with list support
- Supports: paragraph, heading (1-3), bold, italic, code, lists

**Plugins:**
- `history`: Provides undo/redo functionality
- `keymap`: Standard keyboard shortcuts
- Custom plugin integration with React state

**Key Helper Functions:**
- `getEditorText()`: Extract plain text from document
- `insertTextAtEnd()`: Append AI-generated text

### AI Service

**Model Fallback Chain:**
1. Mistral-7B-Instruct (primary)
2. Llama-2-7b-chat (fallback)
3. GPT-2 (last resort)

**Error Handling:**
- Network errors
- Rate limiting
- API authentication
- Timeout handling

**Configuration:**
- Temperature: 0.7 (creative but coherent)
- Max tokens: 150-200
- Top-p: 0.9 (nucleus sampling)

## Getting Started

### Prerequisites

- Node.js 20.14+ (recommended: 22.12+)
- npm 10+

### Installation

1. Clone the repository:
```bash
cd assignment
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure Hugging Face API key:
```bash
cp .env.example .env
# Edit .env and add your API key
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Usage Guide

### Basic Editing

1. **Type text** in the editor area
2. **Format text** using the toolbar:
   - **B**: Bold (or Ctrl+B)
   - **I**: Italic (or Ctrl+I)
   - **</>**: Inline code
   - **H1, H2, H3**: Headings
   - **P**: Paragraph
   - **• List**: Bullet list
   - **1. List**: Numbered list

3. **Undo/Redo**: Ctrl+Z / Ctrl+Y

### AI Text Continuation

1. **Write some text** in the editor (at least a few words)
2. **Click "Continue Writing"** button
3. **Wait** for AI generation (loading spinner shows progress)
4. **Review** the generated text in the preview panel
5. **Accept** to insert the text into your document, or **Reject** to dismiss

### Error Handling

If an error occurs:
- An error banner appears with a user-friendly message
- The banner auto-dismisses after 5 seconds
- Or click the ✕ button to dismiss manually
- Click "Continue Writing" again to retry

## Technical Implementation Details

### Meeting Requirements

#### Functional Requirements ✓

1. **UI with text editor and button**:
   - ProseMirror-based rich text editor
   - Prominent "Continue Writing" button with loading states

2. **User can type text**:
   - Full keyboard and mouse input support
   - Rich text formatting capabilities

3. **AI continues writing**:
   - Hugging Face Inference API integration
   - Context-aware text generation
   - Preview-first approach for user control

#### Technical Requirements ✓

1. **TypeScript**:
   - Strict mode enabled
   - Comprehensive type definitions in `src/types/`
   - No `any` types used

2. **React**:
   - Functional components with hooks
   - Proper state management
   - Optimized re-renders

3. **XState**:
   - Complete state machine in `src/machines/editorMachine.ts`
   - All state transitions managed by machine
   - Context and events properly typed

4. **ProseMirror**:
   - Full editor implementation in `src/prosemirror/`
   - Schema, plugins, and commands
   - Rich text features with undo/redo

### Key Design Decisions

**Preview-First Insertion**
- Gives users control over AI content
- Prevents unwanted text pollution
- Better UX than instant insertion

**State Machine Architecture**
- Explicit state transitions prevent bugs
- Easy to reason about application flow
- Handles async operations cleanly

**Multiple Model Fallback**
- Ensures reliability
- Graceful degradation
- Better user experience

**Free Tier AI**
- No API key required for testing
- Zero-cost deployment
- Production-ready with optional API key

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance Considerations

- Lazy loading for AI models
- Optimized re-renders with React hooks
- Efficient ProseMirror document updates
- CSS animations for smooth transitions

## Future Enhancements

Potential improvements:
- Streaming text generation for real-time display
- Multiple AI model selection
- Custom prompts and temperature control
- Export to Markdown/HTML
- Collaborative editing
- Save/load documents
- Dark mode
- Mobile optimization

## Troubleshooting

**Issue**: AI generation fails with rate limit error
**Solution**: Wait a moment and try again, or add a Hugging Face API key to `.env`

**Issue**: Editor not responding
**Solution**: Check browser console for errors, refresh the page

**Issue**: Formatting buttons not working
**Solution**: Ensure text is selected or cursor is in the right position

## License

MIT

## Acknowledgments

- [ProseMirror](https://prosemirror.net/) - Powerful editor framework
- [XState](https://xstate.js.org/) - State management library
- [Hugging Face](https://huggingface.co/) - AI model hosting
- [Vite](https://vitejs.dev/) - Build tool

## Demo Video

Watch the demo:  
[Demo video](https://drive.google.com/drive/folders/1BuMZ9Q3G6XX18crXQROXIjVrio5V5i2v?usp=sharing)

---

**Built with ❤️ for the AI Editor Assignment**
