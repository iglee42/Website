import { useEffect, useState, forwardRef } from "react";
import { getStatusByNumber, Idea } from "../types/idea";
import { Mod } from "../types/mod";
import reactStringReplace from "react-string-replace";
import moment from "moment";


export const IdeasTable = forwardRef((props, ref) => {


    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [mods, setMods] = useState<Mod[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState(0)

    useEffect(() => {
        async function fetchIdeas() {
            const response = await fetch('https://iglee.fr:3000/ideas');
            if (response.ok) {
                const data = await response.json();
                setIdeas(data);
                setLoading(false);
            }
        }
        async function fetchMods() {
            const response = await fetch('https://iglee.fr:3000/mods');
            if (response.ok) {
                const data = await response.json();
                setMods(data);
                setLoading(false);
            }
        }
        fetchIdeas();
        fetchMods();
    }, [])

    if (loading) {
        return <div>Loading Ideas...</div>;
    }

    let ideaPredicate = (idea: Idea) => {
        return selectedStatus === 2 ? idea.status === 2 || idea.status === 3 : (selectedStatus === 1 ? idea.status === 1 || idea.status === 4 || idea.status === 5 : idea.status === selectedStatus) 
    }


    const select = (
        <div className="relative flex items-center flex-col mt-5 mb-5" >
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
                    </tr>
                </thead>
                <tbody>
                    {
                        ideas.filter(i => ideaPredicate(i)).map(idea => {
                            let mod = mods.find(m => m.id === idea.mod_id)
                            let formatted = moment(idea.created_at).format('L LT')
                            return (
                                <tr key={idea.id} className=" border-y border-gray-400 text-center">
                                    <td className="p-4"><img src={mod?.logoUrl} alt={mod?.name} className="w-32" /></td>
                                    <td className="p-4">{mod?.name}</td>
                                    <td className="p-4 w-1/4">{idea.title}</td>
                                    <td className="p-4 text-left">{reactStringReplace(idea.description, '\n', (m, i) => <br />)}</td>
                                    <td className="p-4">{formatted}</td>
                                    <td className="p-4">{getStatusByNumber(idea.status)}</td>
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


