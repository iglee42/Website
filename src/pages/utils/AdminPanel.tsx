import { ReactHTMLElement, useEffect, useRef, useState } from "react";
import { formatDownloads, getUserAvatarUrl, getUserById, getUserPermission, showInfo } from "../../Utils";
import { Mod } from "../../types/mod";
import { FaEdit, FaSave } from "react-icons/fa";
import { DiscordUser } from "../../types/discordUser";
import { ModEditPopup } from "../../components/adminpanel/EditModPopup";

export const AdminPanel = () => {
  const [mods, setMods] = useState<Mod[]>([]);
  const [users, setUsers] = useState<DiscordUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingMod, setIsEditingMod] = useState(false)
  const [editedMod, setEditedMod] = useState<Mod>()

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/mods")
      .then(res => {
        if (!res.ok) throw new Error("Fetch error");
        return res.json();
      })
      .then(data => {
        setMods(data);
      })
      .catch(() => {
        setMods([]);
      });
  }, []);
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/users/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Fetch error");
        return res.json();
      })
      .then(async data => {
        const users = await Promise.all(
          data.map(async (id: any) => {
            const user = await getUserById(id.user);
            const permissionRes = await getUserPermission(id.user);
            const permission = permissionRes.permission;
            return { ...user, permission };
          })
        );
        console.log(users);
        setUsers(users);
      })
      .catch(() => {
        setUsers([]);
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

  console.log(users)


  return (
    <div className="w-full max-w-full px-4 py-10">
      {
        isEditingMod && (
          <ModEditPopup onClose={() => { setEditedMod(undefined); setIsEditingMod(false) }} mod={editedMod} />
        )
      }
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Admin Panel
      </h1>

      <div className="grid grid-cols-3 gap-6 text-gray-900 dark:text-white border border-gray-800 dark:border-gray-200 rounded-lg">
        <div className="flex flex-col col-span-2 m-4 mb-0 justify-items-start items-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-center mb-4 mt-4 text-gray-800 dark:text-white">
            Mods
          </h2>
          <div className="flex mb-6 flex-row justify-self-start w-full ml-4">
            <span className="w-8 text-lg text-gray-800 dark:text-white">Id</span>
            <h3 className="w-64 text-lg text-gray-800 dark:text-white">
              Name
            </h3>
            <span className="w-24 text-lg text-gray-800 dark:text-white">Downloads</span>
            <span className="w-24 text-lg text-gray-800 dark:text-white">Curseforge</span>
            <span className="w-24 text-lg text-gray-800 dark:text-white">Modrinth</span>
            <span className="w-24 text-lg text-gray-800 dark:text-white">Disabled</span>
            <span className="w-24 text-lg text-gray-800 dark:text-white">Featured</span>
            <span className="w-44 text-lg text-gray-800 dark:text-white">Wiki</span>
            <div className="w-12 text-lg text-gray-800 dark:text-white ml-4"></div>
          </div>
          {
            mods.map(mod =>
              <div className="flex mb-6 flex-row justify-self-start w-full ml-4">
                <span className="w-8 text-lg text-gray-800 dark:text-white">{mod.id}</span>
                <h3 className="w-64 text-lg text-gray-800 dark:text-white">
                  <img src={mod.logoUrl} alt={mod.name} className="inline-block w-10 h-10 mr-2 rounded" />
                  {mod.name}
                </h3>
                <span className="w-24 text-lg text-gray-800 dark:text-white">{mod.downloads === 0 ? "-" : formatDownloads(mod.downloads)}</span>
                <span className="w-24 text-lg text-gray-800 dark:text-white">{mod.curseforgeId === -1 ? "-" : mod.curseforgeId}</span>
                <span className="w-24 text-lg text-gray-800 dark:text-white">{mod.modrinthId === "" ? "-" : mod.modrinthId}</span>
                <span className="w-24 text-lg text-gray-800 dark:text-white">{mod.disabled ? "True" : "False"}</span>
                <span className="w-24 text-lg text-gray-800 dark:text-white">{mod.featured ? "True" : "False"}</span>
                <span className="w-44 text-lg text-gray-800 dark:text-white truncate">{mod.wiki === "" ? "-" : mod.wiki}</span>
                <div className="w-12 text-lg text-gray-800 dark:text-white ml-4">
                  <button className="text-whitepx-5 py-2 rounded-md" onClick={() => { setIsEditingMod(true); setEditedMod(mod) }}><FaEdit></FaEdit></button>
                </div>
              </div>
            )
          }
          <div className="flex mb-6 flex-row justify-self-center justify-center min-w-full ml-4">
            <button className="bg-green-600 text-whitepx-5 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors min-w-64" onClick={()=>setIsEditingMod(true)}>Add Mod</button>
          </div>
        </div>
        <div className="flex flex-col m-4 col-span-1 mb-0 justify-items-start items-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-center mb-4 mt-4 text-gray-800 dark:text-white">
            Users
          </h2>
          <div className="flex mb-6 flex-row justify-self-start w-full ml-4">
            <h3 className="w-64 text-lg text-gray-800 dark:text-white">
              User
            </h3>
            <span className="w-16 text-lg text-gray-800 dark:text-white">Permission</span>
            <div className="w-12 text-lg text-gray-800 dark:text-white ml-4"></div>
          </div>
          {
            users.map(user =>
              <div className="flex mb-6 flex-row justify-self-start w-full ml-4">
                <h3 className="w-64 text-lg text-gray-800 dark:text-white">
                  <img src={getUserAvatarUrl(user)} alt={user.username} className="inline-block w-10 h-10 mr-2 rounded" />
                  {user.username}
                </h3>
                <input type="number" id={"perm-"+user.id} className="no-spinner w-12 text-lg text-gray-800 dark:text-white bg-transparent " min="0" max="3" defaultValue={user.permission}></input>
                <div className="w-16 text-lg text-gray-800 dark:text-white ml-4  hover:text-green-500 hover:dark:text-green-500 transition-colors duration-500">
                  <button className="text-whitepx-5 py-2 rounded-md" onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const permInput = document.getElementById("perm-"+user.id) as HTMLInputElement;
                    const newPerm = parseInt(permInput.value);
                    if (isNaN(newPerm) || newPerm < 0 || newPerm > 3) {
                      showInfo("Invalid permission value. Must be between 0 and 3.");
                      return;
                    }
                    fetch(process.env.REACT_APP_API_URL + "/users/permission", {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                      },
                      body: JSON.stringify({ userId: user.id, permission: newPerm })
                    })
                      .then(res => {
                        if (!res.ok) throw new Error("Failed to update permission");
                        showInfo("Permission updated successfully.");
                        user.permission = newPerm;
                        setUsers([...users]);
                      })
                      .catch(err => {
                        console.error(err);
                        showInfo("Failed to update permission.");
                      });
                  }}><FaSave></FaSave></button>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>

  );
};
