import { useEffect, useState, forwardRef, FormEvent } from "react";
import { FaChevronDown, FaQuestion } from "react-icons/fa";
import { Mod } from "../types/mod";
import { getMinecraftVersion, Version } from "../types/version";

type Props = {
  mod: Mod;
  onChange?: (option: Version | null) => void;
};

export const VersionSelect = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    async function fetchVersions() {
      setLoading(true);
      try {
        const versions = await getMinecraftVersion(props.mod, "both");
        setVersions(versions);
      } catch (error) {
        console.error("Erreur lors du chargement des versions :", error);
        setVersions([]);
      }
      setLoading(false);
    }
    fetchVersions();
  }, [props.mod]);

  const handleSelect = (version: Version) => {
    setSelectedVersion(version);
    setShowOptions(false);
    props.onChange?.(version);
  };

  const toggleOptions = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowOptions((prev) => !prev);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (versions.length === 0) {
    return <div>No versions available</div>;
  }

  return (
    <div className="relative flex items-center flex-col" ref={ref}>
      <button
        type="button"
        className="form-select bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 w-full flex justify-between items-center"
        aria-label="Select a version"
        aria-haspopup="listbox"
        aria-expanded={showOptions}
        onClick={toggleOptions}
      >
        <div className="flex items-center">
          {selectedVersion ? (
            <span>{selectedVersion}</span>
          ) : (
            <div className="flex items-center">
              <FaQuestion className="h-6 w-6 mr-2" size="2xs" />
              Version
            </div>
          )}
        </div>
        <FaChevronDown className="h-5 w-5 ml-2" />
      </button>

      {showOptions && (
        <div
          className="absolute mt-2 bg-white dark:bg-black shadow-lg rounded-md w-full z-10 top-full max-h-64 overflow-auto"
          role="listbox"
        >
          {versions.map((version) => (
            <div
              key={version}
              className={`flex w-full items-center p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                selectedVersion === version ? "bg-gray-300 dark:bg-gray-700" : ""
              }`}
              role="option"
              aria-selected={selectedVersion === version}
              onClick={() => handleSelect(version)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(version);
                }
              }}
            >
              {version}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
