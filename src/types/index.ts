import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export interface EditorContext {
  editorContent: string;
  generatedText: string;
  error: string | null;
  isLoading: boolean;
}

export interface EditorEvents {
  type: 'CONTINUE_WRITING' | 'GENERATION_COMPLETE' | 'GENERATION_ERROR' | 'ACCEPT_PREVIEW' | 'REJECT_PREVIEW' | 'RESET';
  data?: {
    text?: string;
    error?: string;
  };
}

export interface EditorComponentProps {
  editorState: EditorState;
  editorView: EditorView | null;
  onEditorReady: (view: EditorView) => void;
  isDisabled: boolean;
}

export interface ToolbarProps {
  editorView: EditorView | null;
  isDisabled: boolean;
}

export interface PreviewPanelProps {
  text: string;
  onAccept: () => void;
  onReject: () => void;
  isVisible: boolean;
}

export interface ContinueButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export interface AIServiceOptions {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}

export interface AIServiceResponse {
  text: string;
  error?: string;
}
