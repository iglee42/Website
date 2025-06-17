import { useEffect, useState, forwardRef, FormEvent } from "react";
import { FaChevronDown, FaQuestion } from "react-icons/fa"
import { Mod } from "../types/mod";
import { getModLoader, ModLoader } from "../types/modloader";
import { getUpperName } from "../Utils";

type Props = {
    mod: Mod;
    onChange?: (option: ModLoader | null) => void;
}

export const ModLoaderSelect = forwardRef<HTMLHtmlElement,Props>((props,ref) => {


    const [versions, setVersions] = useState<ModLoader[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVersion, setSelectedVersion] = useState<ModLoader | null>(null);

    useEffect(() => {
        async function fetchVersions() {
            const versions = await getModLoader(props.mod, "both");
            setVersions(versions);
            setLoading(false)
        }
        fetchVersions();
    }, [props.mod])

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleSelect = (version: ModLoader) => {
        setSelectedVersion(version);
        document.getElementById("select-content")?.classList.add("hidden")
        props.onChange?.(version);
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
    let imgs: Map<string,string> = new Map()
    versions.forEach((v:string) => {
        let img: string = "";
        switch (v) {
            case "forge": img = "https://pbs.twimg.com/profile_images/778706890914095109/fhMDH9o6_400x400.jpg"; break;
            case "neoforge": img = "https://neoforged.net/img/authors/neoforged.png"; break;
        }
        imgs.set(v,img)
    })
    const select = (
        <div className="relative flex items-center flex-col" >
            <button className="form-select bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full flex justify-between items-center" aria-label="Select a mod" id="mod-sel" onClick={switchOptions}>
                <div className="flex items-center">
                    {selectedVersion ? (
                        <div className="flex items-center">
                            <img src={imgs.get(selectedVersion)} alt="" className="size-8 mr-2" />
                            {getUpperName(selectedVersion," ")}
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <FaQuestion className="h-6 w-6 mr-2" size="2xs" />
                            Mod Loader
                        </div>
                    )}
                </div>
                <FaChevronDown className="h-5 w-5 ml-2" />

            </button>
            <div className=" hidden absolute mt-2 bg-white shadow-lg rounded-md w-full z-10 top-full " id="select-content">
                {versions.map((version) => (
                    <div
                        key={version}
                        className="flex w-full items-center p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSelect(version)}
                    >
                        <img src={imgs.get(version)} alt="" className="size-8 mr-2"/>
                        {getUpperName(version, " ")}
                    </div>
                ))}
            </div>
        </div>
    )

    return select;
})


