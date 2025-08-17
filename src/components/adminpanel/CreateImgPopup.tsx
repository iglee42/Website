import { useState } from "react";
import { Popup } from "../Popup";
import 'react-toggle/style.css'
import { showError, showInfo } from "../../Utils";

interface Props {
  onClose: () => void;
 folders: Set<string>
}

export function CreateImgPopup({ onClose, folders }: Props) {

    const [file, setFile] = useState<File | null>(null)
    const [name, setName] = useState('')
    const [folder, setFolder] = useState('')
    

    const sendImgUpdate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!file) return;
        if (file.name.endsWith(".zip")) {
            const body = new FormData();
            body.append("file", file)
            const res = await fetch(process.env.REACT_APP_API_URL + "/images", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: body
            })
            if (res.ok) {
                onClose();
                showInfo("Images added successfully");
                setTimeout(() => window.location.reload(), 1000);
            } else {
                showError("Failed to add images");
            }
        } else {
            let toName = (folder ? folder + "/" : '') + name
            const body = new FormData();
            body.append("file", file!)
            body.append("name", toName)
            const res = await fetch(process.env.REACT_APP_API_URL + "/image", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: body
            })
            if (res.ok) {
                onClose();
                showInfo("Image created successfully");
                setTimeout(() => window.location.reload(), 1000);
            } else {
                showError("Failed to create image");
            }
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const file: File = event.target.files[0];
        setFile(file);
        if (file.name.endsWith(".zip")) {
            let name = document.getElementById("nameInput")! as HTMLInputElement
            name.disabled = true
            let folder = document.getElementById("folderInput")! as HTMLSelectElement
            folder.disabled = true
        } else {
            setName(file.name)
        }
    };

  return (
    <Popup onClose={onClose} title={"Adding image(s)"}>
          <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center flex-col">
              <input
                  type="file"
                  required={true}
                  accept="image/png, image/gif, .zip"
                  onChange={(e) => handleFileChange(e)}
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none"
                  placeholder="Add file"
              />
              <input
                  required={true}
                  defaultValue={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none disabled:dark:bg-gray-900 disabled:bg-gray-200"
                  placeholder="Set the image name"
                  id="nameInput"
              />
              <select
                  required={true}
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none disabled:dark:bg-gray-900 disabled:bg-gray-200"
                  onChange={(e) => setFolder(e.target.value)}
                  id="folderInput"
              >
                  {Array.from(folders).map((f) => 
                      (<option value={f} selected={folder === f}>{f}</option>)
                  )}
              </select>
              <button
                  onClick={(e) => sendImgUpdate(e)}
                  className=" mt-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700  bg-green-600 hover:bg-green-700 resize-none text-white"
              >Save</button>
      </div>
    </Popup>
  );
}
