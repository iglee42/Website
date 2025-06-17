import { useEffect, useState, forwardRef } from "react";
import { getIconByStatus, getStatusByNumber, Idea } from "../types/idea";
import { Mod } from "../types/mod";
import reactStringReplace from "react-string-replace";
import moment from "moment";
import { getUserAvatarUrl, getUserById, hasUserPermission } from "../Utils";
import { DiscordUser } from "../types/discordUser";
import { IdeaPopup } from "./IdeaPopup";


export const IdeasTable = forwardRef((props, ref) => {


    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [mods, setMods] = useState<Mod[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState(0)
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
    const [hoveredIdea, setHoveredIdea] = useState<Idea | null>(null);


    const [usersByDiscordId, setUsersByDiscordId] = useState({} as Record<string, DiscordUser>);


    useEffect(() => {
        async function fetchIdeas() {
            const response = await fetch('https://api.iglee.fr/ideas');
            if (response.ok) {
                const data = await response.json();
                setIdeas(data);
                setLoading(false);
            }
        }
        async function fetchMods() {
            const response = await fetch('https://api.iglee.fr/mods');
            if (response.ok) {
                const data = await response.json();
                setMods(data);
                setLoading(false);
            }
        }
        fetchIdeas();
        fetchMods();
    }, [])

    useEffect(() => {
        async function fetchUsers() {
            // Récupérer tous les discord_id uniques à récupérer
            const discordIds: string[] = ideas
                .map(i => i["discord_id"])
                .filter(id => id !== null)
                .filter(id => id !== undefined)

            // Pour éviter les doublons
            const uniqueIds: string[] = [];

            discordIds.forEach(id => {
                if (!uniqueIds.includes(id)) {
                    uniqueIds.push(id);
                }
            })

            const usersMap: Record<string, DiscordUser> = {};
            for (const id of uniqueIds) {
                if (id === null) continue;
                const user = await getUserById(id); 
                if (user) {
                    usersMap[id] = user;
                }
            }

            setUsersByDiscordId(usersMap);
        }

        fetchUsers();
    }, [ideas]);

    if (loading) {
        return <div>Loading Ideas...</div>;
    }

    let ideaPredicate = (idea: Idea) => {
        return selectedStatus === 2 ? idea.status === 2 || idea.status === 3 : (selectedStatus === 1 ? idea.status === 1 || idea.status === 4 || idea.status === 5 : idea.status === selectedStatus)
    }


    ideas.sort((a, b) => a.status - b.status);

    const select = (
        <div className="relative flex items-center flex-col mt-5 mb-5" >

            {selectedIdea && <IdeaPopup idea={selectedIdea} mods={mods} onClose={() => setSelectedIdea(null)} />}
            
            <div className="flex items-centers">
                <button className={`input-group mb-3 mt-3 ml-3 flex border border-gray-300 rounded-lg p-2.5 justify-center ${selectedStatus === 0 ? 'bg-gray-300 shadow-inner' : ''}`} onClick={e => setSelectedStatus(0)}>Waiting</button>
                <button className={`input-group mb-3 mt-3 ml-3 flex border border-gray-300 rounded-lg p-2.5 justify-center ${selectedStatus === 1 ? 'bg-gray-300 shadow-inner' : ''}`} onClick={e => setSelectedStatus(1)}>Accepted/In Dev/Finished</button>
                <button className={`input-group mb-3 mt-3 ml-3 flex border border-gray-300 rounded-lg p-2.5 justify-center ${selectedStatus === 2 ? 'bg-gray-300 shadow-inner' : ''}`} onClick={e => setSelectedStatus(2)}>Refused/Duplicated</button>
            </div>
            {ideas.filter(i => ideaPredicate(i)).length === 0 && <h1>There is no ideas in this category</h1>}
            {ideas.filter(i => ideaPredicate(i)).length > 0 && <table className="table-fixed">
                <thead>
                    <tr className="mb-5">
                        <th></th>
                        <th>Mod</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Created</th>
                        <th>Status</th>
                        {hasUserPermission(1) ? <th>Created by</th> : <></>}
                    </tr>
                </thead>
                <tbody>
                    {
                        ideas.filter(i => ideaPredicate(i)).map(idea => {
                            let mod = mods.find(m => m.id === idea.mod_id)
                            let user = idea.discord_id ? usersByDiscordId[idea.discord_id] : null;
                            let formatted = moment(idea.created_at).format('L LT')
                            return (
                                <tr key={idea.id} className=" border-y border-gray-400 text-center cursor-pointer" style={{ backgroundColor: hoveredIdea === idea ? "#eeeeee" : "#ffffff"} } onMouseEnter={()=>setHoveredIdea(idea)} onMouseLeave={()=>setHoveredIdea(null)} onClick={()=>setSelectedIdea(idea)}>
                                    <td className="p-4"><img src={mod?.logoUrl} alt={mod?.name} className="w-1/2 h-full" /></td>
                                    <td className="p-4">{mod?.name}</td>
                                    <td className="p-4 w-1/4">{idea.title}</td>
                                    <td className="p-4 text-left">{reactStringReplace(idea.description, '\n', (m, i) => <br />)}</td>
                                    <td className="p-4">{formatted}</td>
                                    <td className="p-4"><div className="flex justify-center">{getIconByStatus(idea.status, "mr-2 mt-1 size-5")} {getStatusByNumber(idea.status)} </div></td>
                                    {hasUserPermission(1) ? <td className="p-4"><div className="items-center justify-center flex">{user ? <img src={getUserAvatarUrl(user)} alt="" className="rounded-full w-12 mr-2" /> : <span></span>}{user ? user.global_name: "Unknown"} </div></td> : <></>}
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            }
        </div>
    )

    return select;
})


