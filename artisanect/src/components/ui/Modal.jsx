import React, { useEffect, useRef } from "react";

/**
 * Modal
 * An accessible, responsive dialog overlay. Closes when the overlay is
 * clicked, when the Escape key is pressed, or when the close button is
 * clicked. Locks background scroll while open and traps initial focus
 * on the dialog for screen reader and keyboard users.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is currently visible.
 * @param {() => void} props.onClose - Called when the modal should close.
 * @param {string} [props.title] - Title displayed in the modal header.
 * @param {React.ReactNode} props.children - Modal body content.
 * @returns {JSX.Element|null}
 */
function Modal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-ink-light rounded-xl shadow-2xl p-6 sm:p-7 max-h-[85vh] overflow-y-auto focus:outline-none transition-colors duration-300"
      >
        <div className="flex items-center justify-between mb-4 gap-4">
          {title && (
            <h2 id="modal-title" className="font-display font-semibold text-lg text-ink dark:text-paper">
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="ml-auto w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-ink/60 dark:text-paper/60 hover:bg-ink/10 dark:hover:bg-paper/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="text-sm text-ink/75 dark:text-paper/75 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
