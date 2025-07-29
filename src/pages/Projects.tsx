import { useEffect, useState } from "react";
import { showInfo } from "../Utils";
import { Mod } from "../types/mod";
import { ModInfo } from "../components/ModInfo";
import { DownloadPopup } from "../components/DownloadPopup";

export const Projects = () => {
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMod, setCurrent] = useState<Mod | null>(null);

  useEffect(() => {
    showInfo("Loading mods...");
    fetch("https://api.iglee.fr/mods")
      .then(res => {
        if (!res.ok) throw new Error("Fetch error");
        return res.json();
      })
      .then(data => {
        setMods(data);
      })
      .catch(() => {
        setMods([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-600 dark:text-gray-400">
        <span className="animate-pulse">Loading mods...</span>
      </div>
    );
  }

  const sorted = mods
    .filter(m => m.curseforgeId > 0 || m.modrinthId.length > 0)
    .map(m => ({ ...m }))
    .sort((a, b) => b.downloads - a.downloads);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Our Projects
      </h1>

      {currentMod && (
        <DownloadPopup mod={currentMod} onClose={() => setCurrent(null)} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sorted.map(mod => (
          <ModInfo key={mod.id} mod={mod} onClick={() => setCurrent(mod)} />
        ))}
      </div>
    </div>
  );
};
