/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { formatDownloads, getFiles } from "../Utils";
import { Popup } from "./Popup";
import { Mod } from "../types/mod";
import { Version } from "../types/version";
import { VersionSelect } from "./VersionSelect";
import { ModLoader } from "../types/modloader";
import { ModLoaderSelect } from "./ModLoaderSelect";
import { FaDownload } from "react-icons/fa";
import { Files } from "../types/files";
import { CurseSVG, ModrinthSVG } from "./SVG";

interface Props {
  mod: Mod;
  onClose: () => void;
}

export function DownloadPopup({ mod, onClose }: Props) {
  const [version, setVersionInternal] = useState<Version | null>(null);
  const [modLoader, setModLoaderInternal] = useState<ModLoader | null>(null);
  const [response, setResponse] = useState<Files | null>(null);

  useEffect(() => update(null, null), []);

  function update(version: string | null, modLoader: string | null) {
    async function tick() {
      const data: Files | null = await getFiles(mod, version, modLoader);
      setResponse(data);

      const curseBtn = document.getElementById("curseBtn");
      const modrinthBtn = document.getElementById("modrinthBtn");
      const dlBtn = document.getElementById("dlBtn");

      if (data?.curseforge && curseBtn) {
        curseBtn.setAttribute("href", `curseforge://install?addonId=${data.curseforge.modId}&fileId=${data.curseforge.id}&source=cf_website`);
        curseBtn.classList.remove("pointer-events-none");
      } else {
        curseBtn?.classList.add("pointer-events-none");
      }

      if (data?.modrinth && modrinthBtn) {
        modrinthBtn.setAttribute("href", `modrinth://mod/${data.modrinth.project_id}`);
        modrinthBtn.classList.remove("pointer-events-none");
      } else {
        modrinthBtn?.classList.add("pointer-events-none");
      }

      if (data?.jar && dlBtn) {
        dlBtn.setAttribute("href", data.jar);
        dlBtn.classList.remove("pointer-events-none", "bg-gray-400");
      } else {
        dlBtn?.classList.add("pointer-events-none", "bg-gray-400");
      }
    }
    tick();
  }

  function setVersion(version: Version | null) {
    setVersionInternal(version);
    update(version, modLoader);
  }

  function setModLoader(modLoader: ModLoader | null) {
    setModLoaderInternal(modLoader);
    update(version, modLoader);
  }

  return (
    <Popup onClose={onClose} title={`Download ${mod.name}`}>
          <div className="flex items-center space-x-4">
            <span className="font-medium w-32">Version:</span>
            <VersionSelect mod={mod} onChange={setVersion} />
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-medium w-32">Mod Loader:</span>
            <ModLoaderSelect mod={mod} onChange={setModLoader} />
          </div>

          {response && (
            <div className="space-y-4">
              {response.curseforge && (
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CurseSVG className="mr-2" fill="f16436" />
                    <h3 className="font-semibold">CurseForge</h3>
                  </div>
                  <div className="text-sm">{response.curseforge.fileName}</div>
                  <div className="text-xs text-gray-500">Downloads: {formatDownloads(response.curseforge.downloadCount)}</div>
                </div>
              )}

              {response.modrinth && (
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <ModrinthSVG className="rounded-full size-6 mr-2" fill="1bd96a" />
                    <h3 className="font-semibold">Modrinth</h3>
                  </div>
                  <div className="text-sm">{response.modrinth.files[0]?.filename}</div>
                  <div className="text-xs text-gray-500">Downloads: {formatDownloads(response.modrinth.downloads)}</div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-between gap-3 pt-4">
            <a
              id="dlBtn"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              href=""
            >
              <FaDownload className="size-5" /> Download .jar
            </a>
            <a
              id="curseBtn"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-[#f16436] hover:bg-[#dd5228] transition"
              href=""
            >
              <CurseSVG className="size-5" fill="ffffff" /> CurseForge
            </a>
            <a
              id="modrinthBtn"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-[#1bd96a] hover:bg-[#19c05f] transition"
              href=""
            >
              <ModrinthSVG className="size-5" fill="ffffff" /> Modrinth
            </a>
          </div>
    </Popup>
  );
}
