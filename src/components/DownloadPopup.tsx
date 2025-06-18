/* eslint-disable jsx-a11y/anchor-is-valid */
import { MouseEventHandler, useEffect, useState } from "react";
import { formatDownloads, getFiles } from "../Utils";
import { Popup } from "./Popup";
import { Mod } from "../types/mod";
import { Version } from "../types/version";
import { VersionSelect } from "./VersionSelect";
import { ModLoader } from "../types/modloader";
import { ModLoaderSelect } from "./ModLoaderSelect";
import { FaDownload } from "react-icons/fa";
import '../css/button.css'
import { Files } from "../types/files";
import { CurseSVG, ModrinthSVG } from "./SVG";

interface Props {
    mod: Mod;
    onClose: MouseEventHandler<HTMLButtonElement>;
}

export function DownloadPopup(props: Props) {

    let mod = props.mod;
    let [version, setVersionInternal] = useState<Version | null>(null);
    let [modLoader, setModLoaderInternal] = useState<ModLoader | null>(null);
    let [disableCurseforge, setDisableCurseforge] = useState(false);
    let [disableModrinth, setDisableModrinth] = useState(false);
    let [disableDl, setDisableDl] = useState(false);
    let [response, setResponse] = useState<Files | null>(null)

    useEffect(()=>update(null,null),[])


    function update(version: string | null, modLoader: string | null) {
        async function tick() {
            let data: Files | null = await getFiles(mod, version, modLoader);
            if (data) {
                setResponse(data)
                if (data.curseforge) {
                    setDisableCurseforge(false);
                    document.getElementById("curseBtn")!.setAttribute("href", `curseforge://install?addonId=${data.curseforge.modId}&fileId=${data.curseforge.id}&source=cf_website`);
                } else {
                    setDisableCurseforge(true);
                }
                if (data.modrinth) {
                    setDisableModrinth(false);
                    document.getElementById("modrinthBtn")!.setAttribute("href", `modrinth://mod/${data.modrinth.project_id}`);
                } else {
                    setDisableModrinth(true);
                }
                if (data.jar) {
                    setDisableDl(false);
                    document.getElementById("dlBtn")!.setAttribute("href", data.jar);
                } else {
                    setDisableDl(true);
                }
            } else {
                setDisableCurseforge(true)
                setDisableModrinth(true);
                setDisableDl(true);
            }

            if (!data || !data?.curseforge) {
                document.getElementById("curseBtn")!.classList.add("pointer-events-none");
            } else {
                document.getElementById("curseBtn")!.classList.remove("pointer-events-none");
            }

            if (!data || !data?.modrinth) {
                document.getElementById("modrinthBtn")!.classList.add("pointer-events-none");
            } else {
                document.getElementById("modrinthBtn")!.classList.remove("pointer-events-none");
            }

            if (!data || !data?.jar) {
                document.getElementById("dlBtn")!.classList.add("pointer-events-none", 'bg-gray-400');

            } else {
                document.getElementById("dlBtn")!.classList.remove("pointer-events-none", 'bg-gray-400');
            }
        }
        tick()
    }

    function setVersion(version: Version | null) {
        setVersionInternal(version);
        update(version, modLoader);
    }

    function setModLoader(modLoader: ModLoader | null) {
        setModLoaderInternal(modLoader);
        update(version, modLoader);
    }

    return (
        <Popup onClose={props.onClose}>

            <div className="relative p-4 items-center whitespace-normal break-words">
                <div className="text-center mt-2">
                    <h2 className="text-xl font-bold">Download {mod.name}</h2>
                    <br />
                    <div className="flex justify-center items-center text-gray-900 text-lg">
                        <span className="mr-4">Version :</span>
                        <VersionSelect mod={mod} onChange={setVersion} />
                    </div>
                    <br />
                    <div className="flex justify-center items-center text-gray-900 text-lg">
                        <span className="mr-4">Mod Loader :</span>
                        <ModLoaderSelect mod={mod} onChange={setModLoader} />
                    </div>
                    <br/>
                    <div className="flex justify-center items-center text-gray-900 text-lg">
                        {
                            disableCurseforge || response === null || !response.curseforge ? <></> :
                                <div className="relative bg-white rounded-lg shadow-md border max-w-5xl flex flex-wrap text-center justify-center ">
                                    <h3 className="font-semibold flex"><CurseSVG className="mr-1 mt-0.5 " fill="f16436"  /> Curseforge</h3>
                                    <span className="w-full">
                                        {
                                            response.curseforge.fileName
                                        }
                                    </span>
                                    <span className="w-full">
                                        {
                                            "Downloads : " + formatDownloads(response.curseforge.downloadCount)
                                        }
                                    </span>
                                </div>
                        }
                        {
                            disableModrinth || response === null || !response.modrinth ? <></> :
                                <div className="relative bg-white rounded-lg shadow-md border max-w-5xl flex flex-wrap text-center justify-center ml-4 ">
                                    <h3 className="font-semibold flex"><ModrinthSVG className="rounded-full size-6 mt-1 mr-2" fill="1bd96a"/> Modrinth</h3>
                                    <span className="w-full">
                                        {
                                            response.modrinth.files[0]?.filename
                                        }
                                    </span>
                                    <span className="w-full">
                                        {
                                            "Downloads : " + formatDownloads(response.modrinth.downloads)
                                        }
                                    </span>
                                </div>
                        }
                    </div>
                    <br />
                    <div className="flex justify-center items-center text-gray-900 text-lg rounded-lg bg-gray-200 w-full">
                        <a className={`input-group mb-1 mt-1 flex ml-4 border border-gray-300 rounded-lg p-2.5 justify-center bg-white hover:bg-gray-200 `} id="dlBtn" href=""><FaDownload className="size-8 mr-2" /> Download</a>
                        <a className={`input-group mb-1 mt-1 flex ml-4 border border-gray-300 rounded-lg p-2.5 justify-center curse text-white`} id="curseBtn" style={{ backgroundColor: disableCurseforge ? "#a84625" : "" }} href=""><CurseSVG className="mr-2 mt-0.5 fill-white" fill="ffffff" />Curseforge</a>
                        <a className={`input-group mb-1 mt-1 flex ml-4 border border-gray-300 rounded-lg p-2.5 justify-center modrinth text-white`} id="modrinthBtn" style={{ backgroundColor: disableModrinth ? "#12974a" : "" }} href=""><ModrinthSVG fill="ffffff" className="rounded-full size-7 mr-2" /> Modrinth</a>
                    </div>
                </div>
            </div>
        </Popup>
    )
}


