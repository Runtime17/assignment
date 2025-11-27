import { EditorView } from 'prosemirror-view';
import { useState, useEffect } from 'react';
import {
  toggleBold,
  toggleItalic,
  toggleCode,
  setHeading,
  setParagraph,
  toggleBulletList,
  toggleOrderedList,
  isMarkActive,
} from '../prosemirror/commands';
import { schema } from '../prosemirror/schema';

interface EditorToolbarProps {
  editorView: EditorView | null;
  isDisabled: boolean;
}

export function EditorToolbar({ editorView, isDisabled }: EditorToolbarProps) {
  const [activeMarks, setActiveMarks] = useState({
    bold: false,
    italic: false,
    code: false,
  });

  // Update active marks when selection changes
  useEffect(() => {
    if (!editorView) return;

    const updateActiveMarks = () => {
      setActiveMarks({
        bold: isMarkActive(editorView, schema.marks.strong),
        italic: isMarkActive(editorView, schema.marks.em),
        code: isMarkActive(editorView, schema.marks.code),
      });
    };

    // Update on initial mount
    updateActiveMarks();

    // We'll use a simple interval to check for changes
    // In production, you might want to use ProseMirror's plugin system
    const interval = setInterval(updateActiveMarks, 100);

    return () => clearInterval(interval);
  }, [editorView]);

  const handleButtonClick = (command: (view: EditorView) => boolean) => {
    if (editorView && !isDisabled) {
      command(editorView);
      editorView.focus();
    }
  };

  return (
    <div className="editor-toolbar">
      <button
        className={`toolbar-btn ${activeMarks.bold ? 'active' : ''}`}
        onClick={() => handleButtonClick(toggleBold)}
        disabled={isDisabled || !editorView}
        title="Bold (Ctrl+B)"
        type="button"
      >
        <strong>B</strong>
      </button>

      <button
        className={`toolbar-btn ${activeMarks.italic ? 'active' : ''}`}
        onClick={() => handleButtonClick(toggleItalic)}
        disabled={isDisabled || !editorView}
        title="Italic (Ctrl+I)"
        type="button"
      >
        <em>I</em>
      </button>

      <button
        className={`toolbar-btn ${activeMarks.code ? 'active' : ''}`}
        onClick={() => handleButtonClick(toggleCode)}
        disabled={isDisabled || !editorView}
        title="Code"
        type="button"
      >
        <code>{'</>'}</code>
      </button>

      <div className="toolbar-separator" />

      <button
        className="toolbar-btn"
        onClick={() => handleButtonClick((view) => setHeading(view, 1))}
        disabled={isDisabled || !editorView}
        title="Heading 1"
        type="button"
      >
        H1
      </button>

      <button
        className="toolbar-btn"
        onClick={() => handleButtonClick((view) => setHeading(view, 2))}
        disabled={isDisabled || !editorView}
        title="Heading 2"
        type="button"
      >
        H2
      </button>

      <button
        className="toolbar-btn"
        onClick={() => handleButtonClick((view) => setHeading(view, 3))}
        disabled={isDisabled || !editorView}
        title="Heading 3"
        type="button"
      >
        H3
      </button>

      <button
        className="toolbar-btn"
        onClick={() => handleButtonClick(setParagraph)}
        disabled={isDisabled || !editorView}
        title="Paragraph"
        type="button"
      >
        P
      </button>

      <div className="toolbar-separator" />

      <button
        className="toolbar-btn"
        onClick={() => handleButtonClick(toggleBulletList)}
        disabled={isDisabled || !editorView}
        title="Bullet List"
        type="button"
      >
        • List
      </button>

      <button
        className="toolbar-btn"
        onClick={() => handleButtonClick(toggleOrderedList)}
        disabled={isDisabled || !editorView}
        title="Ordered List"
        type="button"
      >
        1. List
      </button>
    </div>
  );
}
