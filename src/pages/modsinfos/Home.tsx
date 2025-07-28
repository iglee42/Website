import { useEffect, useState } from "react";
import { ModsInfoItems } from "../../components/ModsInfoItem"
import { Item } from "../../types/item";
import { showInfo, split } from "../../Utils";
import { ModFilterPopup } from "../../components/ModFilterPopup";
import { ItemPopup } from "../../components/modsinfos/ItemPopup";

export const HomeModsInfos = () => {

    
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentItem, setCurrent] = useState<Item | null>(null);
    const [selectedMod, setSelectedMod] = useState<string[] >([]);
    const [showFilter, setShowFilter] = useState(false);


    useEffect(() => {
        async function fetchItems() {
            const response = await fetch('https://api.iglee.fr/items');
            if (response.ok) {
                const data = await response.json();
                setItems(data);
                setLoading(false);
            }
        }
        showInfo('Loading Items...');
        fetchItems();
    }, [])

    if (loading) {
        return <div></div>;
    }
    const mods = Array.from(new Set(items.map(item => split(item.id, ':')[0])));
    const filteredItems = selectedMod.length > 0 ? items.filter(item => selectedMod.findIndex(s => split(item.id, ':')[0] === s) !== -1) : items;


    return (
        <div className="flex">


            {/* Menu de sélection des mods */}
            {showFilter && <ModFilterPopup mods={mods} onSelect={setSelectedMod} onClose={() => setShowFilter(false)} alreadySelected={selectedMod} />}
            {/* Liste des items */}
            <div className="flex flex-wrap -mx-2 w-3/4">
                {filteredItems.map(it => (
                    <ModsInfoItems key={it.id} item={it} onClick={() => setCurrent(it)} />
                ))}
                {currentItem && <ItemPopup item={currentItem} onClose={() => setCurrent(null)} />}
            </div>

            {/* Bouton Paramètres */}
            <button
                className="top-4 bg-gray-200 dark:bg-gray-800 p-2 rounded shadow-md hover:bg-gray-300 ml-auto"
                onClick={() => setShowFilter(!showFilter)}
            >
                Paramètres
            </button>
        </div>
    );
}