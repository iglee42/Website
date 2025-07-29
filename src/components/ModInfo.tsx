import { useState } from "react";
import { Consumer } from "../types/consumer";
import { Mod } from "../types/mod";
import { formatDownloads } from "../Utils";

interface Props {
  mod: Mod;
  onClick: Consumer<Mod>;
}

export const ModInfo = (props: Props) => {
  const { mod, onClick } = props;
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md w-56 flex flex-col items-center p-5 transition duration-300 m-6
        ${hover ? "shadow-xl scale-105" : ""}
        ${mod.disabled ? "opacity-50 grayscale pointer-events-none" : "opacity-100"}
      `}
      title={mod.disabled ? "Mod désactivé" : ""}
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
      <div className="flex gap-4">
        <button
          className="bg-green-600 text-white dark:text-black px-5 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick(mod);
          }}
          disabled={mod.disabled}
        >
          Download
        </button>
        {mod.wiki ? (
          <a
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-5 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
            href={mod.wiki}
            target="_blank"
            rel="noopener noreferrer"
          >
            Wiki
          </a>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
