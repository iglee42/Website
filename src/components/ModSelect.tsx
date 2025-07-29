import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { FaChevronDown, FaQuestion } from "react-icons/fa";
import { Mod } from "../types/mod";

type Props = {};

export type ModSelectHandle = {
  getSelectedMod: () => Mod | null;
};

export const ModSelect = forwardRef<ModSelectHandle, Props>((_, ref) => {
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMod, setSelectedMod] = useState<Mod | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getSelectedMod: () => selectedMod,
  }));

  useEffect(() => {
    async function fetchMods() {
      const response = await fetch("https://api.iglee.fr/mods");
      if (response.ok) {
        const data = await response.json();
        setMods(data);
      }
      setLoading(false);
    }
    fetchMods();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSelect = (mod: Mod) => {
    setSelectedMod(mod);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-1/2 flex flex-col items-center">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((o) => !o)}
        className="form-select bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 w-full flex justify-between items-center cursor-pointer text-black dark:text-white"
        id="mod-sel"
      >
        <div className="flex items-center">
          {selectedMod ? (
            <>
              <img
                src={selectedMod.logoUrl}
                alt={selectedMod.name}
                className="h-6 w-6 mr-2 object-contain"
              />
              {selectedMod.name}
            </>
          ) : (
            <>
              <FaQuestion className="h-6 w-6 mr-2" />
              Choose A Mod
            </>
          )}
        </div>
        <FaChevronDown className="h-5 w-5 ml-2" />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-labelledby="mod-sel"
          tabIndex={-1}
          className="absolute mt-2 bg-white dark:bg-gray-900 shadow-lg rounded-md w-full z-10 max-h-60 overflow-auto"
        >
          {mods.map((mod) => (
            <li
              key={mod.id}
              role="option"
              aria-selected={selectedMod?.id === mod.id}
              tabIndex={0}
              className={`flex items-center p-2 cursor-pointer
                hover:bg-gray-200 dark:hover:bg-blue-700
                ${
                  selectedMod?.id === mod.id
                    ? "bg-blue-600 text-white"
                    : "text-black dark:text-white"
                }
              `}
              onClick={() => handleSelect(mod)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(mod);
                }
              }}
            >
              <img
                src={mod.logoUrl}
                alt={mod.name}
                className="h-6 w-6 mr-2 object-contain"
              />
              {mod.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
