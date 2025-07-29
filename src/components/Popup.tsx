import { MouseEventHandler, ReactNode, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";

interface Props {
  onClose: () => void;
  children: ReactNode;
}

export function Popup({ onClose, children }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div
        ref={modalRef}
        className="relative bg-white dark:bg-black rounded-xl shadow-xl p-4 inline-block max-w-full max-h-[90vh] overflow-auto"
        tabIndex={-1}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-gray-100 dark:bg-gray-900 rounded hover:bg-gray-200"
          aria-label="Close modal"
        >
          <FaTimes />
        </button>
        <div id="popup-title" className="sr-only">
          Modal
        </div>
        {children}
      </div>
    </div>
  );
}
