import { ChangeEvent, DragEvent, MouseEvent, useState } from "react";

export const UploadChests = () => {

    let [hasFile, setHasFile] = useState(false);
    let [files,setFiles] = useState<File[]>([])
    function handleDrop(e: DragEvent<HTMLDivElement>) {
        console.log("Dropped")
        e.stopPropagation();
        e.preventDefault();
        handleFiles(e.dataTransfer.files)

    }

    function handleFiles(files: FileList) {
        setHasFile(true)
        let listFiles = Array.from(files); 
        setFiles(listFiles)
    }

    function handleSendClick(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        e.stopPropagation()
        sendFiles((document.querySelector("#mod-sel") as HTMLSelectElement).value)
    }

    function handleClearClick(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        e.stopPropagation()
        setFiles([])
        setHasFile(false)
    }

    function sendFiles(type: string) {
        var url = 'https://api.iglee.fr/textures/' + type
        var xhr = new XMLHttpRequest()
        var formData = new FormData()

        xhr.open('POST', url, true)

        xhr.setRequestHeader("Access-Control-Allow-Origin", "*")


        // Update progress (can be used to show progress indicator)
        xhr.upload.addEventListener("progress", function (e) {
            updateProgress((e.loaded * 100.0 / e.total) || 100)
        })

        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState === 4 && xhr.status === 201) {
                updateProgress(0)
                setHasFile(false)
                setFiles([])
                window.location.reload()
            }
            else if (xhr.readyState === 4 && xhr.status !== 200) {
            }
        })

        formData.append('file', files[0])
        xhr.send(formData)
    }

    function updateProgress(percent: number) {
        if (document.querySelector("progress") === null) return
        let progress = document.querySelector("progress") as HTMLProgressElement
        progress.value = percent
    }
    function handleChangeFiles(e: ChangeEvent<HTMLInputElement>): void {
        setFiles(Array.from(e.target.files || []))
        setHasFile(true)
    }

    function stopOver(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        return false;
    }



    function chooseFile(e: MouseEvent<HTMLButtonElement>): void {
        e.preventDefault()
        e.stopPropagation()
        let input = document.querySelector("input[type=file]") as HTMLInputElement
        if (input) input.click()
    }

    return (

        
        <div className="mt-5" id="main-div">
            <h1 className="text-center"><b>Upload Chest Textures Page</b></h1>
            <div className="flex justify-center">
                <div className="flex border-dashed border-2 border-slate-400 dark:border-slate-600 w-fit font-sans m-24 p-8 text-center justify-center items-center" onDragOver={(e) => { stopOver(e) }} onDrop={e=>{handleDrop(e)}}>
                    <form className="grid grid-cols-1">
                        <h2 className="text-xl font-bold">Chest Textures</h2>
                        <label className={`label ${hasFile ? "" : "hidden"}`}>Fichier Selectionné : {files[0] ? files[0].name : ""}</label>
                        <input type="file" accept=".zip" className="hidden input-group w-full border border-gray-300 dark:border-gray-700 rounded-lg" onChange={(e)=>handleChangeFiles(e)} />
                        <label>Tu peux drag-and-drop (Uniquement .zip)</label>
                        <button className={`${!hasFile ? "" : "hidden"} input-group mb-1 mt-1 flex w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 justify-center`} onClick={chooseFile}>Choisir un fichier</button>

                            <select className="input-group mb-1 mt-1 flex w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 justify-center" aria-label="Select a mod" id="mod-sel">
                                <option value="chest_single" selected>Single Chest</option>
                                <option value="chest_left">Left Chest</option>
                                <option value="chest_right">Right Chest</option>
                                <option value="chest_trapped_single">Single Trapped Chest</option>
                                <option value="chest_trapped_left">Left Trapped Chest</option>
                                <option value="chest_trapped_right">Right Trapped Chest</option>
                                <option value="barrel_side">Barrel Side</option>
                                <option value="barrel_top">Barrel Top</option>
                                <option value="barrel_top_open">Barrel Top Open</option>
                                <option value="barrel_bottom">Barrel Bottom</option>
                                <option value="crafting_table_top">Crafting Table Top</option>
                                <option value="crafting_table_front">Crafting Table Front</option>
                                <option value="crafting_table_side">Crafting Table Side</option>
                            </select>
                            
                        <button className={`${hasFile ? "" : "hidden"} input-group mb-1 mt-1 flex w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 justify-center`} onClick={handleClearClick}>Supprimer</button>
                        <button className={`${hasFile ? "" : "hidden"} input-group mb-1 mt-1 flex w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 justify-center`} onClick={handleSendClick}>Envoyer</button>
                        <progress id="progress-bar" className={`${hasFile ? "" : "hidden"} rounded-lg w-full`} max={100} value={0}></progress>
                    </form>

                </div>

            </div>

        </div>
    )
}