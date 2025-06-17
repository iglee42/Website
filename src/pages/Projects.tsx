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
        async function fetchItems() {
            const response = await fetch('https://api.iglee.fr/mods');
            if (response.ok) {
                const data = await response.json();
                setMods(data);
                setLoading(false);
            }
        }
        showInfo('Loading Mods...');
        fetchItems();
    }, [])

    if (loading) {
        return <div></div>;
    }
    
    let sorted = mods.filter(m=>m.curseforgeId > 0 || m.modrinthId.length > 0).sort((a, b) => b.downloads - a.downloads);

    return (
        <div className="flex">
                        {currentMod && <DownloadPopup mod={currentMod} onClose={() => setCurrent(null)}  />}
        
            {/* Liste des items */}
            <div className="flex flex-wrap -mx-2">
                {sorted.map(it => (
                    <ModInfo key={it.id} mod={it} onClick={() => setCurrent(it)} />
                ))}
            </div>
        </div>
    );
}