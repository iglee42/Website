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
            className={`relative bg-white dark:bg-black border rounded-lg shadow-md w-56 flex flex-col items-center p-4 transition duration-200 m-8 ${hover ? "shadow-xl scale-105" : ""} ${mod.disabled ? "opacity-50 grayscale" : "opacity-100"}`}
            title={mod.disabled ? "Mod désactivé" : ""}
        >
            <img
                src={mod.logoUrl}
                alt={mod.name}
                className="w-24 h-24 object-contain mb-3 pixelated-image"
            />
            <h3 className="text-black dark:text-white font-semibold text-lg text-center mb-1 truncate w-full">
                {mod.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                Downloads: {formatDownloads(mod.downloads)}
            </p>
            <div>
            <button
                className="bg-green-500 text-white dark:text-black px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); 
                    onClick(mod)
                }}
            >Download</button>
            {mod.wiki ? <a
                className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white ml-4 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                href={mod.wiki}
                >Wiki</a>
                : <div></div>}
            </div>
        </div>
    );
};
