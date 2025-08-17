import { useEffect, useState } from "react";
import { formatDownloads, getUserAvatarUrl, getUserById, getUserPermission, showInfo } from "../../Utils";
import { Mod } from "../../types/mod";
import { FaEdit, FaSave } from "react-icons/fa";
import { DiscordUser } from "../../types/discordUser";
import { ModEditPopup } from "../../components/adminpanel/EditModPopup";
import { PreviewImgPopup } from "../../components/adminpanel/PreviewImgPopup";
import { Consumer } from "../../types/consumer";
import { CreateImgPopup } from "../../components/adminpanel/CreateImgPopup";

export const AdminPanel = () => {
  const [mods, setMods] = useState<Mod[]>([]);
  const [users, setUsers] = useState<DiscordUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingMod, setIsEditingMod] = useState(false)
  const [editedMod, setEditedMod] = useState<Mod>()
  const [shownImg, setShownImg] = useState<string>('')
  const [images, setImages] = useState<String[]>([])
  const [folders, setFolders] = useState<Set<string>>(new Set<string>())
  const [isCreatingImage, setCreatingImage] = useState(false)

  

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
        setUsers(users);
      })
      .catch(() => {
        setUsers([]);
      });
    
  }, []);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/images", {
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
        setImages(data.files);
        const folders = new Set<string>();
        folders.add("")

        for (const path of data.files) {
          const parts = path.split("/");
          if (parts.length > 1) {
            folders.add(parts[0]);
          }
        }

        setFolders(folders);
        console.log(folders)
      })
      .catch(() => {
        setImages([]);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);



  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-600 dark:text-gray-400">
        <span className="animate-pulse">Loading infos...</span>
      </div>
    );
  }

  function buildTree(paths: String[]) {
    const root: TreeNodeType = {};
    for (const path of paths) {
      const parts = path.split("/");
      let current = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part] = null; // fichier
        } else {
          current[part] = current[part] || {}; // dossier
          current = current[part] as TreeNodeType ;
        }
      }
    }
    return root;
  }

  const tree = buildTree(images)



  return (
    <div className="w-full max-w-full px-4 py-10">
      {
        isEditingMod && (
          <ModEditPopup onClose={() => { setEditedMod(undefined); setIsEditingMod(false) }} mod={editedMod} />
        )
      }
      {
        shownImg && (
          <PreviewImgPopup onClose={() => { setShownImg('') }} img={shownImg} folders={folders} />
        )
      }
      {
        isCreatingImage && (
          <CreateImgPopup onClose={() => { setCreatingImage(false) }} folders={folders} />
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
        <div className="flex flex-col m-4 col-span-1 mb-2 justify-items-start items-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-center mb-4 mt-4 text-gray-800 dark:text-white">
            Images
          </h2>
          <div className="w-full pb-2 overflow-auto">
            <Tree tree={tree} onOpen={img=>setShownImg(img)} />
          </div>
          <div className="flex mb-6 flex-row justify-self-center justify-center min-w-full ml-4">
            <button className="bg-green-600 text-whitepx-5 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors min-w-64" onClick={() => setCreatingImage(true)}>Add Image</button>
          </div>
        </div>
      </div>
      
    </div>

  );
};
interface TreeNodeType {
  [key: string]: TreeNodeType | null;
}

interface TreeProps {
  tree: TreeNodeType;
  onOpen: Consumer<string>
}

const Tree: React.FC<TreeProps> = ({ tree, onOpen }) => {
  return (
    <div className="font-mono text-gray-800 dark:text-gray-200">
      {Object.entries(tree).map(([name, node], index, arr) => (
        <TreeNode
          key={name}
          name={name}
          node={node}
          isLast={index === arr.length - 1}
          onOpen={onOpen}
          parent=''
        />
      ))}
    </div>
  );
};

interface TreeNodeProps {
  name: string;
  node: TreeNodeType | null;
  isLast?: boolean;
  onOpen: Consumer<string>
  parent: string
}

const TreeNode: React.FC<TreeNodeProps> = ({ name, node, isLast = false , onOpen, parent}) => {
  const [open, setOpen] = useState(false);
  const isFolder = node !== null && Object.keys(node).length > 0;
  const children = isFolder ? Object.entries(node!) : [];

  return (
    <div className="relative pl-6 ml-2">
      {!isLast && (
        <span className="absolute left-0 top-0 h-full border-l border-gray-400 dark:border-gray-600"></span>
      )}
      {isLast && (
        <span className="absolute left-0 top-0 h-1/2 border-l border-gray-400 dark:border-gray-600"></span>
      )}
      <span className="absolute left-0 top-3 w-4 border-t border-gray-400 dark:border-gray-600"></span>
      <div
        className={`flex items-center cursor-pointer select-none ${isFolder ? "" : ""
          }`}
        onClick={() => {
          if (isFolder) setOpen(!open)
          else onOpen((parent ? parent + "/" : "") + name)
        }}
      >
        {isFolder ? (
          <span className="mr-2 w-6 h-6 text-center">{open ? "📂" : "📁"}</span>
        ) : (
            <span className="mr-2 w-6 h-6 flex items-center justify-center text-center"><img className="w-6 h-6 " alt={name} src={ process.env.REACT_APP_API_URL + "/image/"+(parent? parent+"/" : "") + name } /></span>
        )}
        {name}
      </div>

      {isFolder && open && (
        <div className="">
          {children.map(([childName, childNode], index) => (
            <TreeNode
              key={childName}
              name={childName}
              node={childNode}
              isLast={index === children.length - 1}
              onOpen={onOpen}
              parent={(parent ? parent + "/" : "") + name}
            />
          ))}
        </div>
      )}
    </div>
  );
};