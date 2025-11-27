import { useState, useEffect } from 'react';
import { EditorView } from 'prosemirror-view';
import { useMachine } from '@xstate/react';
import { Editor } from './components/Editor';
import { EditorToolbar } from './components/EditorToolbar';
import { PreviewPanel } from './components/PreviewPanel';
import { ContinueButton } from './components/ContinueButton';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { editorMachine } from './machines/editorMachine';
import { getEditorText, insertTextAtEnd } from './prosemirror/schema';
import './App.css';

type Theme = 'light' | 'dark';

function App() {
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [state, send] = useMachine(editorMachine);
  const [theme, setTheme] = useState<Theme>('light');

  const { context } = state;
  const isGenerating = state.matches('generating');
  const isPreviewing = state.matches('previewing');
  const isInserting = state.matches('inserting');
  const isError = state.matches('error');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Handle editor initialization
  const handleEditorReady = (view: EditorView) => {
    setEditorView(view);
  };

  // Handle Continue Writing button click
  const handleContinueWriting = () => {
    if (!editorView) return;

    const content = getEditorText(editorView.state);

    if (!content || content.trim().length === 0) {
      alert('Please write some text first before continuing.');
      return;
    }

    send({ type: 'CONTINUE_WRITING', editorContent: content });
  };

  // Handle accepting AI-generated text
  const handleAccept = () => {
    if (!editorView || !context.generatedText) return;

    // Insert the generated text at the end of the document
    const tr = insertTextAtEnd(editorView.state, context.generatedText);
    editorView.dispatch(tr);

    send({ type: 'ACCEPT_PREVIEW' });
  };

  // Handle rejecting AI-generated text
  const handleReject = () => {
    send({ type: 'REJECT_PREVIEW' });
  };

  // Handle error reset
  const handleErrorReset = () => {
    send({ type: 'RESET' });
  };

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (isError) {
      const timeout = setTimeout(() => {
        handleErrorReset();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isError, send]);

  return (
    <div className="app">
      <header className="app-header">
        <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
        <h1>AI-Assisted Editor</h1>
        <p className="subtitle">
          Write your text and let AI continue the story
        </p>
      </header>

      <main className="app-main">
        <div className="editor-container">
          {/* <EditorToolbar
            editorView={editorView}
            isDisabled={isGenerating || isInserting}
          /> */}

          <Editor
            onEditorReady={handleEditorReady}
            isDisabled={isGenerating || isInserting}
          />

          <div className="editor-actions">
            <ContinueButton
              onClick={handleContinueWriting}
              isLoading={isGenerating}
              isDisabled={!editorView || isPreviewing || isInserting}
            />
          </div>

          {isError && context.error && (
            <div className="error-banner">
              <span className="error-icon">⚠</span>
              <span className="error-message">{context.error}</span>
              <button
                className="error-close"
                onClick={handleErrorReset}
                type="button"
                aria-label="Close error"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <PreviewPanel
          text={context.generatedText}
          onAccept={handleAccept}
          onReject={handleReject}
          isVisible={isPreviewing}
        />
      </main>

      <footer className="app-footer">
        <p>
          Powered by <strong>ProseMirror</strong> • <strong>XState</strong> • <strong>Hugging Face</strong>
        </p>
      </footer>
    </div>
  );
}

export default App;
