import { useEffect, useState } from "react";

export const ModSelect = () => {

    type Mod = {
        id: number;
        name: string;
        logoUrl: string;
        disabled: boolean;
    }
    const [mods, setMods] = useState<Mod[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMod, setSelectedMod] = useState<Mod | null>(null);

    useEffect(() => {
        async function fetchMods() {
                const response = await fetch('https://iglee.fr:3000/mods');
                if (response.ok) {
                    const data = await response.json();
                    setMods(data);
                    setLoading(false);
                }
        }
        fetchMods();
    },[])

    console.log(typeof mods)
    if (loading) {
        return <div>Loading...</div>;
    }

    const handleSelect = (mod: Mod) => {
        setSelectedMod(mod);
        document.getElementById("select-content")?.classList.add("hidden")
    };

    function switchOptions() {
        var content = document.getElementById("select-content")
        if (content?.classList.contains("hidden")) {
            content.classList.remove("hidden")
        } else {
            content?.classList.add("hidden")
        }
    }
    const select = (
        <div className="relative w-1/2 flex items-center flex-col">
                <button className="form-select g-gray-50 border border-gray-300 rounded-lg p-2.5 w-full" aria-label="Select a mod" id="mod-sel" onClick={switchOptions}>
                    {selectedMod ? (
                        <div className="flex items-center">
                            <img src={selectedMod.logoUrl} alt={selectedMod.name} className="h-6 w-6 mr-2" />
                            {selectedMod.name}
                        </div>
                    ) : (
                        "Choose A Mod"
                    )}
                </button>
            <div className=" hidden absolute mt-2 bg-white shadow-lg rounded-md w-full z-10 top-full " id="select-content">
                    {mods.map((mod) => (
                        <div
                            key={mod.id}
                            className="flex w-full items-center p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSelect(mod)}
                        >
                            <img src={mod.logoUrl} alt={mod.name} className="h-6 w-6 mr-2" />
                            {mod.name}
                        </div>
                    ))}
                </div>
            </div>
    )

    return select;
}


