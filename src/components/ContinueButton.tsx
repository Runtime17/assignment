import type { ContinueButtonProps } from '../types';

export function ContinueButton({
  onClick,
  isLoading,
  isDisabled,
}: ContinueButtonProps) {
  return (
    <button
      className={`continue-btn ${isLoading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      type="button"
    >
      {isLoading ? (
        <>
          <span className="spinner" />
          Generating...
        </>
      ) : (
        'Continue Writing'
      )}
    </button>
  );
}
