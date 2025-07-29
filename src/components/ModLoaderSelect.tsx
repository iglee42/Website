import { useEffect, useState, forwardRef, useRef, useCallback } from "react";
import { FaChevronDown, FaQuestion } from "react-icons/fa";
import { Mod } from "../types/mod";
import { getModLoader, ModLoader } from "../types/modloader";
import { getUpperName } from "../Utils";

type Props = {
  mod: Mod;
  onChange?: (option: ModLoader | null) => void;
};

export const ModLoaderSelect = forwardRef<HTMLDivElement, Props>(({ mod, onChange }, ref) => {
  const [versions, setVersions] = useState<ModLoader[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<ModLoader | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    async function fetchVersions() {
      const versions = await getModLoader(mod, "both");
      setVersions(versions);
      setLoading(false);
    }
    fetchVersions();
  }, [mod]);

  const handleSelect = useCallback(
    (version: ModLoader) => {
      setSelectedVersion(version);
      setIsOpen(false);
      onChange?.(version);
    },
    [onChange]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  const imgs: Record<ModLoader, string> = {
    forge: "https://docs.minecraftforge.net/en/1.21.x/images/favicon.ico",
    neoforge: "https://neoforged.net/img/authors/neoforged.png",
    quilt: "https://quiltmc.org/assets/favicon.png",
    cauldron: "https://avatars.githubusercontent.com/u/6732956?s=200&v=4",
    fabric: "https://fabricmc.net/favicon.ico",
    liteloader: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/6/6c/LiteLoader_Logo.png",
  };

  return (
    <div
      ref={(node) => {
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className="relative flex flex-col w-full max-w-xs"
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="form-select bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 w-full flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        id="mod-sel"
      >
        <div className="flex items-center">
          {selectedVersion ? (
            <>
              <img
                src={imgs[selectedVersion]}
                alt={selectedVersion}
                className="w-8 h-8 mr-2 object-contain"
              />
              {getUpperName(selectedVersion, " ")}
            </>
          ) : (
            <>
              <FaQuestion className="h-6 w-6 mr-2" />
              Mod Loader
            </>
          )}
        </div>
        <FaChevronDown className="h-5 w-5 ml-2" />
      </button>

      {isOpen && (
        <ul
          tabIndex={-1}
          role="listbox"
          aria-labelledby="mod-sel"
          className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-900 shadow-lg rounded-md max-h-60 overflow-auto"
        >
          {versions.map((version) => (
            <li
              key={version}
              role="option"
              aria-selected={selectedVersion === version}
              className={`flex items-center p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                selectedVersion === version ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handleSelect(version)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(version);
                }
              }}
              tabIndex={0}
            >
              <img
                src={imgs[version]}
                alt={version}
                className="w-8 h-8 mr-2 object-contain"
              />
              {getUpperName(version, " ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
