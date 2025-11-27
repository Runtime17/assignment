import { useEffect, useRef } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema } from '../prosemirror/schema';
import { createPlugins } from '../prosemirror/plugins';
import 'prosemirror-view/style/prosemirror.css';

interface EditorProps {
  onEditorReady: (view: EditorView) => void;
  isDisabled: boolean;
  editorState?: EditorState;
}

export function Editor({ onEditorReady, isDisabled, editorState }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Create initial editor state
    const state = editorState || EditorState.create({
      schema,
      plugins: createPlugins(),
    });

    // Create editor view
    const view = new EditorView(editorRef.current, {
      state,
      editable: () => !isDisabled,
    });

    viewRef.current = view;
    onEditorReady(view);

    // Cleanup
    return () => {
      view.destroy();
    };
  }, []);

  // Update editable state when isDisabled changes
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.setProps({
        editable: () => !isDisabled,
      });
    }
  }, [isDisabled]);

  return (
    <div className="editor-wrapper">
      <div
        ref={editorRef}
        className={`editor-content ${isDisabled ? 'disabled' : ''}`}
      />
    </div>
  );
}
