import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Item } from "../../types/item";
import { Popup } from "../Popup";
import { Mod } from "../../types/mod";
import Toggle from "react-toggle";
import 'react-toggle/style.css'
import { showError, showInfo } from "../../Utils";
import { useUser } from "../../UserProvider";

interface Props {
  onClose: () => void;
  mod: Mod | undefined;
}

export function ModEditPopup({ onClose, mod }: Props) {
  const [name, setName] = useState(mod ? mod.name : "");
  const [logoUrl, setLogoUrl] = useState(mod ? mod.logoUrl : "");
  const [curseforgeId, setCurseId] = useState(mod ? mod.curseforgeId : "");
  const [mrId, setMRId] = useState(mod ? mod.modrinthId : "");
  const [disabled, setDisabled] = useState(mod ? mod.disabled : false);
  const [featured, setFeatured] = useState(mod ? mod.featured : false);
  const [wiki, setWiki] = useState(mod ? mod.wiki : "");

  const sendModUpdate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!name) {
      showError("Name is required");
      return;
    }
    if (!logoUrl) {
      showError("Logo is required");
      return;
    }
    const res = await fetch(process.env.REACT_APP_API_URL + "/mod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      },
      body: JSON.stringify({
        id: mod ? mod.id : null,
        name,
        logoUrl,
        curseforgeId: curseforgeId ? curseforgeId : -1,
        modrinthId: mrId,
        disabled,
        featured,
        wiki
      })
    })
    if (res.ok) {
      onClose();
      showInfo("Mod created/updated successfully");
      setTimeout(()=> window.location.reload(), 1000);
    } else {
      showError("Failed to create/update mod");
    }
  }

  const deleteMod = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!mod) return;
    const res = await fetch(process.env.REACT_APP_API_URL + "/mod", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      },
      body: JSON.stringify({
        id: mod.id
      })
    })
    if (res.ok) {
      onClose();
      showInfo("Mod deleted successfully");
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showError("Failed to delete mod");
    }
  }
  return (
    <Popup onClose={onClose} title={mod ? "Edit " + mod.name : "Create A Mod"}>
      <div>
        <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
          <span className="text-lg mr-2 w-28">Title:</span>
          <input
            required={true}
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
            className=" mt-0 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none"
            placeholder="Set the mod name"
          />
        </div>

        <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
          <span className="text-lg mr-2 w-28 ">Logo URL:</span>
          <input
            required={true}
            defaultValue={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className=" mt-0 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none"
            placeholder="Set the mod logo"
          />
        </div>

        <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
          <span className="text-sm mr-2 w-28 ">Curseforge ID:</span>
          <input
            defaultValue={curseforgeId}
            onChange={(e) => setCurseId(e.target.value)}
            className=" mt-0 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none"
            placeholder="Set the Curseforge ID"
          />
        </div>
        <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
          <span className="text-sm mr-2 w-28 ">Modrinth ID:</span>
          <input
            defaultValue={mrId}
            onChange={(e) => setMRId(e.target.value)}
            className=" mt-0 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none"
            placeholder="Set the Modrinth ID"
          />
        </div>
        <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
          <span className="text-lg mr-2 w-28 ">Disabled:</span>
          <div className="w-full">
          <Toggle
            defaultChecked={disabled}
            onChange={(e) => setDisabled(e.target.checked)}
              className=" mt-0 px-3 py-2 border border-gray-300 dark:border-zinc-700  bg-red-500 resize-none"
            placeholder="Set the disabled state"
            />
          </div>
        </div>
        <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
          <span className="text-lg mr-2 w-28 ">Featured:</span>
          <div className="w-full">
          <Toggle
            defaultChecked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
              className=" mt-0 px-3 py-2 border border-gray-300 dark:border-zinc-700  bg-red-500 resize-none"
            placeholder="Set the featured state"
            />
          </div>
        </div>
        <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
          <span className="text-lg mr-2 w-28 ">Wiki URL:</span>
          <input
            defaultValue={wiki}
            onChange={(e) => setWiki(e.target.value)}
            className=" mt-0 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none"
            placeholder="Set the Wiki URL"
          />
        </div>
        <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
          <button
            onClick={(e)=> sendModUpdate(e)}
            className=" mt-0 px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700  bg-green-600 hover:bg-green-700 resize-none"
          >Save</button>
          {mod && (
            <button
              onClick={(e) => deleteMod(e)}
              className=" mt-0 ml-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700  bg-red-600 hover:bg-red-700 resize-none"
            >Delete</button>)}
        </div>
      </div>

    </Popup>
  );
}
