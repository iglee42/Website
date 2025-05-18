import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";
import { getUpperName, getUser, getUserAvatarUrl, getUserById, hasUserPermission, showError, showInfo } from "../Utils";
import { Popup } from "./Popup";
import { getIconByStatus, getStatusByNumber, Idea, Status } from "../types/idea";
import { DiscordUser } from "../types/discordUser";
import { Mod } from "../types/mod";
import reactStringReplace from "react-string-replace";
import StatusSelect, { StatusOption } from "./StatusSelect";

interface Props {
    idea: Idea;
    mods: Mod[];
    onClose: MouseEventHandler<HTMLButtonElement>;
}

export function IdeaPopup(props: Props) {
    let [user, setUser] = useState<DiscordUser | null>(null);
    let [status, setStatus] = useState(0);

    useEffect(() => {
        async function fetchUser() {
            let usr = await getUserById(props.idea.discord_id);
            setUser(usr);
        }
        if (!user)fetchUser();
    })
    let mod = props.mods.find(m => m.id === props.idea.mod_id)


    function handleUpdateButton(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        e.stopPropagation()
        fetch('https://api.iglee.fr/suggestion/status', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                suggestionId: props.idea.id,
                status: status,
                userId: getUser()?.id,
            })
        }).then(res => {
            if (res.ok) {
                props.onClose(e);
                props.idea.status = status;
                showInfo("Idea status updated");
            } else {
                showError("Failed to update idea status");
            }
        })

    }

    const statusEntries = Object.entries(Status)
        .filter(([key, value]) => typeof value === "number") as [keyof typeof Status, number][];
    function handleSelectChange(option: StatusOption | null): void {
        if (option) {
            setStatus(option.value);
        }
    }

    return (
        <Popup onClose={props.onClose}>
            
            <div className="relative p-4 items-center whitespace-normal break-words">
                    <div className="text-center mt-2">
                    <h2 className="text-xl font-bold">{getUpperName(props.idea.title, " ")}</h2>
                    {mod ? <div className="flex justify-center items-center text-gray-900 text-lg">
                        <span className="mr-2">For :</span>
                        <img src={mod.logoUrl} alt="" className="size-8 mr-2" />
                        <span>{mod.name}</span>
                    </div> : <></>}
                    {hasUserPermission(1) && user ? < div className="flex justify-center items-center text-gray-900 text-lg">
                    <span className="mr-2">By :</span>
                    <img src={getUserAvatarUrl(user)} alt="" className="size-8 rounded-3xl mr-2" />
                    <span>{user.global_name}</span>
                    </div>: <></>}
                    < div className="flex justify-center items-center text-gray-900 text-lg">
                        <span className="mr-2">Status :</span>
                        { getIconByStatus(props.idea.status,"mr-2") }
                        <span>{getStatusByNumber(props.idea.status)}</span>
                    </div>
                    <span className="text-gray-600 text-lg">{reactStringReplace(props.idea.description, '\n', (m, i) => <br />)}</span>

                    {hasUserPermission(1) ?
                    <div className="flex justify-center items-center text-gray-900 text-lg">
                            <StatusSelect statusEntries={statusEntries} onChange={handleSelectChange} currentIdea={props.idea} />
                            <button className={`input-group mb-1 mt-1 flex ml-4 border border-gray-300 rounded-lg p-2.5 justify-center`} onClick={handleUpdateButton}>Update Status</button>
                    </div> : <></>}
                </div>
                </div>
        </Popup>
    )
}
    

