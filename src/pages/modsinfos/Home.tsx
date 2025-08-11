import { useEffect, useState } from "react";
import { ModsInfoItems } from "../../components/ModsInfoItem";
import { Item } from "../../types/item";
import { showInfo, split } from "../../Utils";
import { ModFilterPopup } from "../../components/ModFilterPopup";
import { ItemPopup } from "../../components/modsinfos/ItemPopup";

export const HomeModsInfos = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentItem, setCurrent] = useState<Item | null>(null);
  const [selectedMod, setSelectedMod] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    async function fetchItems() {
      showInfo("Loading Items...");
      const response = await fetch(process.env.REACT_APP_API_URL + "/items");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
      setLoading(false);
    }
    fetchItems();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Extraction des mods uniques depuis les items
  const mods = Array.from(new Set(items.map((item) => split(item.id, ":")[0])));

  // Filtrer les items selon les mods sélectionnés
  const filteredItems =
    selectedMod.length > 0
      ? items.filter((item) =>
        selectedMod.includes(split(item.id, ":")[0])
      )
      : items;

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-4">
      {/* Liste des items */}
      <div className="flex flex-wrap -mx-2 w-3/4">
        {filteredItems.map((it) => (
          <ModsInfoItems key={it.id} item={it} onClick={() => setCurrent(it)} />
        ))}
        {currentItem && (
          <ItemPopup item={currentItem} onClose={() => setCurrent(null)} />
        )}
      </div>

      {/* Sidebar ou menu flottant pour le filtre + bouton */}
      <div className="w-1/4 flex flex-col items-center">
        <button
          className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setShowFilter(!showFilter)}
          aria-expanded={showFilter}
          aria-controls="mod-filter-popup"
        >
          Settings
        </button>
        {showFilter && (
          <div id="mod-filter-popup" className="w-full">
            <ModFilterPopup
              mods={mods}
              onSelect={setSelectedMod}
              onClose={() => setShowFilter(false)}
              alreadySelected={selectedMod}
            />
          </div>
        )}
      </div>
    </div>
  );
};
