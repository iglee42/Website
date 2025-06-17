import { useEffect, useState, forwardRef, useImperativeHandle, FormEvent } from "react";
import { FaChevronDown, FaQuestion } from "react-icons/fa"
import { Mod } from "../types/mod";
import { getMinecraftVersion, Version } from "../types/version";

type Props = {
    mod: Mod;
    onChange?: (option: Version | null) => void;
}

export const VersionSelect = forwardRef<HTMLHtmlElement,Props>((props,ref) => {


    const [versions, setVersions] = useState<Version[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

    useEffect(() => {
        async function fetchVersions() {
            const versions = await getMinecraftVersion(props.mod, "both");
            setVersions(versions);
            setLoading(false)
        }
        fetchVersions();
    }, [])

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleSelect = (version: Version) => {
        setSelectedVersion(version);
        document.getElementById("select-loader")?.classList.add("hidden")
        props.onChange?.(version);
    };

    function switchOptions(e: FormEvent<any>) {
        e.preventDefault();
        e.stopPropagation();
        var content = document.getElementById("select-loader")
        if (content?.classList.contains("hidden")) {
            content.classList.remove("hidden")
        } else {
            content?.classList.add("hidden")
        }
    }
    const select = (
        <div className="relative flex items-center flex-col" >
            <button className="form-select bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full flex justify-between items-center" aria-label="Select a mod" id="mod-sel" onClick={switchOptions}>
                <div className="flex items-center">
                    {selectedVersion ? (
                        <div className="flex items-center">
                            {selectedVersion}
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <FaQuestion className="h-6 w-6 mr-2" size="2xs" />
                            Version
                        </div>
                    )}
                </div>
                <FaChevronDown className="h-5 w-5 ml-2" />

            </button>
            <div className=" hidden absolute mt-2 bg-white shadow-lg rounded-md w-full z-10 top-full " id="select-loader">
                {versions.map((version) => (
                    <div
                        key={version}
                        className="flex w-full items-center p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSelect(version)}
                    >
                        {version}
                    </div>
                ))}
            </div>
        </div>
    )

    return select;
})


