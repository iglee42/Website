import { useState } from "react";
import { Popup } from "../Popup";
import 'react-toggle/style.css'
import { showError, showInfo } from "../../Utils";

interface Props {
  onClose: () => void;
    img: string;
    folders: Set<string>
}

export function PreviewImgPopup({ onClose, img, folders }: Props) {

    const splitted = img.split('/');
    const noext = splitted[splitted.length - 1].split(".")[0] 
    const [name, setName] = useState(noext)
    const [folder, setFolder] = useState(splitted[0])
    

    const sendImgUpdate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        if (name === noext && folder === splitted[0]) return;
        const res = await fetch(process.env.REACT_APP_API_URL + "/image", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({
                image: img,
                name: name !== noext ? name : '',
                folder: folder !== splitted[0] ? (folder ? folder : 'none') : ''
            })
        })
        if (res.ok) {
            onClose();
            showInfo("Image updated successfully");
            setTimeout(() => window.location.reload(), 1000);
        } else {
            showError("Failed to update image");
        }
    }

  return (
    <Popup onClose={onClose} title={"Preview of " + img}>
    <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center flex-col">
              <img className="min-w-48 pixelated-image" alt={img} src={process.env.REACT_APP_API_URL + "/image/" + img} />
              <input
                  required={true}
                  defaultValue={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none"
                  placeholder="Set the mod name"
              />
              <select
                  required={true}
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none"
                  onChange={(e)=> setFolder(e.target.value)}
              >
                  {Array.from(folders).map((f) => 
                      (<option value={f} selected={folder === f}>{f}</option>)
                  )}
              </select>
              <button
                  onClick={(e) => sendImgUpdate(e)}
                  className=" mt-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700  bg-green-600 hover:bg-green-700 resize-none"
              >Save</button>
      </div>
    </Popup>
  );
}
