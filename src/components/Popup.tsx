import { ReactNode, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { getUpperName } from "../Utils";

interface Props {
  onClose: () => void;
  children: ReactNode;
  title: string;
}

export function Popup({ onClose, children, title }: Props) {
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
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 w-[40rem] max-w-full">
          {/* Header */}
          <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 px-5 py-3 rounded-t-xl border-b border-gray-200 dark:border-zinc-700 text-center text-lg font-semibold">
            {getUpperName(title, " ")}
          </div>
          <div className="p-5 space-y-6 text-zinc-900 dark:text-zinc-100 text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
