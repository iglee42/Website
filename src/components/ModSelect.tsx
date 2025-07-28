import { useEffect, useState, forwardRef, useImperativeHandle, FormEvent } from "react";
import { FaChevronDown, FaQuestion } from "react-icons/fa"
import { Mod } from "../types/mod";


export const ModSelect = forwardRef((props, ref) => {


    const [mods, setMods] = useState<Mod[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMod, setSelectedMod] = useState<Mod | null>(null);

    useImperativeHandle(ref, () => ({
        getSelectedMod() {
            return selectedMod;
        }
    }))
    useEffect(() => {
        async function fetchMods() {
            const response = await fetch('https://api.iglee.fr/mods');
            if (response.ok) {
                const data = await response.json();
                setMods(data);
                setLoading(false);
            }
        }
        fetchMods();
    }, [])

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleSelect = (mod: Mod) => {
        setSelectedMod(mod);
        document.getElementById("select-content")?.classList.add("hidden")
    };

    function switchOptions(e: FormEvent<any>) {
        e.preventDefault();
        e.stopPropagation();
        var content = document.getElementById("select-content")
        if (content?.classList.contains("hidden")) {
            content.classList.remove("hidden")
        } else {
            content?.classList.add("hidden")
        }
    }
    const select = (
        <div className="relative w-1/2 flex items-center flex-col" >
            <button className="form-select bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 w-full flex justify-between items-center" aria-label="Select a mod" id="mod-sel" onClick={switchOptions}>
                <div className="flex items-center">
                    {selectedMod ? (
                        <div className="flex items-center">
                            <img src={selectedMod.logoUrl} alt={selectedMod.name} className="h-6 w-6 mr-2" />
                            {selectedMod.name}
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <FaQuestion className="h-6 w-6 mr-2" size="2xs" />
                            Choose A Mod
                        </div>
                    )}
                </div>
                <FaChevronDown className="h-5 w-5 ml-2" />
            </button>
            <div className="hidden absolute mt-2 bg-white dark:bg-black shadow-lg rounded-md w-full z-10 top-full" id="select-content">
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
})


