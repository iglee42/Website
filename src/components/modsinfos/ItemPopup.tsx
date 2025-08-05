import { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { Item } from "../../types/item";

interface Props {
  onClose: () => void;
  item: Item;
}

export function ItemPopup({ onClose, item }: Props) {
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
    return () => document.removeEventListener("keydown", handleKeyDown);
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
          aria-label="Fermer la fenêtre modale"
        >
          <FaTimes />
        </button>
        <h2 id="popup-title" className="sr-only">Item details</h2>

        {/* Affichez ici les infos de votre item */}
        <div>
          <h3 className="text-lg font-bold mb-2">{item.id}</h3>
          <p>ID : {item.id}</p>
          {/* Ajoutez d'autres détails selon votre modèle */}
        </div>
      </div>
    </div>
  );
}
