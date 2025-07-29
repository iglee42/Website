import { FC, useState } from "react";
import { getUpperName } from "../Utils";
import { Popup } from "./Popup";

type ModFilterPopupProps = {
  mods: string[];
  onSelect: (mods: string[]) => void;
  onClose: () => void;
  alreadySelected?: string[];
};

export const ModFilterPopup: FC<ModFilterPopupProps> = ({
  mods,
  onSelect,
  onClose,
  alreadySelected,
}) => {
  const [selectedMods, setSelectedMods] = useState<string[]>(
    alreadySelected ? alreadySelected : []
  );

  const toggleModSelection = (mod: string) => {
    setSelectedMods((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const applySelection = () => {
    onSelect(selectedMods);
    onClose();
  };

  return (
    <Popup onClose={onClose}>
      <div className="flex flex-col p-4 min-w-[280px] max-w-full">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Mods
        </h3>
        <div className="flex flex-col space-y-2 max-h-64 overflow-auto pr-1">
          {mods.map((mod) => (
            <button
              key={mod}
              onClick={() => toggleModSelection(mod)}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 
                ${
                  selectedMods.includes(mod)
                    ? "bg-indigo-500 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
            >
              {getUpperName(mod, "_")}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={applySelection}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </Popup>
  );
};
