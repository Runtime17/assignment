import type { PreviewPanelProps } from '../types';

export function PreviewPanel({
  text,
  onAccept,
  onReject,
  isVisible,
}: PreviewPanelProps) {
  if (!isVisible) return null;

  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
  const charCount = text.length;

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <h3>AI Generated Content</h3>
        <div className="preview-stats">
          {wordCount} words • {charCount} characters
        </div>
      </div>

      <div className="preview-content">
        <p>{text}</p>
      </div>

      <div className="preview-actions">
        <button
          className="btn btn-accept"
          onClick={onAccept}
          type="button"
        >
          ✓ Accept
        </button>
        <button
          className="btn btn-reject"
          onClick={onReject}
          type="button"
        >
          ✕ Reject
        </button>
      </div>
    </div>
  );
}
