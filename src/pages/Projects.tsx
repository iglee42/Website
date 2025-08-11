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
    fetch(`${process.env.REACT_APP_API_URL}/mods?featured=true`)
      .then(res => {
        if (!res.ok) throw new Error("Fetch error");
        return res.json();
      })
      .then((data: Mod[]) => {
        setMods(data.sort((a, b) => b.downloads - a.downloads));
      })
      .catch(() => setMods([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-600 dark:text-gray-400">
        <span className="animate-pulse">Loading mods…</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Our Projects
      </h1>

      {currentMod && <DownloadPopup mod={currentMod} onClose={() => setCurrent(null)} />}

      <div className="flex flex-wrap justify-center gap-12">
        {mods.map((mod) => (
          <div
            key={mod.id}
            className="
              basis-[10%] max-w-[350px]
              sm:basis-1/2 sm:max-w-none
              md:basis-1/3
              lg:basis-1/4
              xl:basis-1/5
            "
          >
            <ModInfo mod={mod} onClick={() => setCurrent(mod)} />
          </div>
        ))}
      </div>
    </div>
  );
};