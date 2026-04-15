import { useState } from "react";
import { Consumer } from "../types/consumer";
import { Mod } from "../types/mod";
import { formatDownloads } from "../Utils";
import { FaBook, FaCode, FaDownload } from "react-icons/fa";

interface Props {
  mod: Mod;
  onClick: Consumer<Mod>;
  downloadOnly: boolean;
}

export const ModInfo = (props: Props) => {
  const { mod, onClick, downloadOnly } = props;
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md w-56 flex flex-col items-center p-5 transition duration-300 m-6
        ${hover ? "shadow-xl scale-105" : ""}
        ${mod.disabled ? "opacity-50 grayscale pointer-events-none" : "opacity-100"}
      `}
      title={mod.disabled ? "Mod disabled" : ""}
    >
      <img
        src={mod.logoUrl}
        alt={mod.name}
        className="w-24 h-24 object-contain mb-3 pixelated-image"
      />
      <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg text-center mb-1 truncate w-full">
        {mod.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        Downloads: {formatDownloads(mod.downloads)}
      </p>
      <div className="flex flex-row justify-center flex-wrap gap-y-4">
        <button
          className="flex items-center gap-1 bg-green-600 text-white dark:text-black px-5 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick(mod);
          }}
          disabled={mod.disabled}
        >
          <FaDownload/>
          Download
        </button>
        {mod.wiki && !downloadOnly ? (
          <a
            className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-5 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
            href={mod.wiki}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaBook/>
            Wiki
          </a>
        ) : (
          <div />
        )}

        {mod.source_link && !downloadOnly ? (
          <a
            className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-5 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
            href={mod.source_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaCode/>
            Source
          </a>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
