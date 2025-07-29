import { ChangeEvent, DragEvent, MouseEvent, useState } from "react";

export const UploadChests = () => {
    const [hasFile, setHasFile] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [selectedType, setSelectedType] = useState("chest_single");
    const [uploading, setUploading] = useState(false);

    function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        handleFiles(e.dataTransfer.files);
    }

    function handleFiles(fileList: FileList) {
        const listFiles = Array.from(fileList);
        setFiles(listFiles);
        setHasFile(listFiles.length > 0);
    }

    function handleSendClick(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();
        if (!files.length) return;
        sendFiles(selectedType);
    }

    function handleClearClick(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();
        setFiles([]);
        setHasFile(false);
        updateProgress(0);
    }

    function sendFiles(type: string) {
        if (files.length === 0) return;

        const url = process.env.REACT_APP_API_URL + "/textures/" + type;
        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        setUploading(true);

        xhr.open("POST", url, true);

        xhr.upload.addEventListener("progress", (e) => {
            updateProgress((e.loaded * 100) / (e.total || 1));
        });

        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState === 4) {
                setUploading(false);
                if (xhr.status === 201) {
                    updateProgress(0);
                    setHasFile(false);
                    setFiles([]);
                    window.location.reload();
                } else {
                    console.error("Erreur upload :", xhr.statusText);
                }
            }
        });

        formData.append("file", files[0]);
        xhr.send(formData);
    }

    function updateProgress(percent: number) {
        const progress = document.querySelector("progress") as HTMLProgressElement | null;
        if (progress) progress.value = percent;
    }

    function handleChangeFiles(e: ChangeEvent<HTMLInputElement>) {
        const newFiles = e.target.files ? Array.from(e.target.files) : [];
        setFiles(newFiles);
        setHasFile(newFiles.length > 0);
    }

    function stopOver(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    function chooseFile(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();
        const input = document.querySelector("input[type=file]") as HTMLInputElement | null;
        if (input) input.click();
    }

    function handleSelectChange(e: ChangeEvent<HTMLSelectElement>) {
        setSelectedType(e.target.value);
    }

    return (
        <div className="mt-5" id="main-div">
            <h1 className="text-center">
                <b>Upload Chest Textures Page</b>
            </h1>
            <div className="flex justify-center">
                <div
                    className="flex border-dashed border-2 border-slate-400 dark:border-slate-600 w-fit font-sans m-24 p-8 text-center justify-center items-center"
                    onDragOver={stopOver}
                    onDrop={handleDrop}
                >
                    <form className="grid grid-cols-1">
                        <h2 className="text-xl font-bold">Chest Textures</h2>

                        <label className={`${hasFile ? "" : "hidden"}`}>
                            Fichier sélectionné : {files[0]?.name || ""}
                        </label>

                        <input
                            type="file"
                            accept=".zip"
                            className="hidden input-group w-full border border-gray-300 dark:border-gray-700 rounded-lg"
                            onChange={handleChangeFiles}
                        />

                        <label>Tu peux drag-and-drop (Uniquement .zip)</label>

                        <button
                            className={`${hasFile ? "hidden" : ""} input-group mb-1 mt-1 flex w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 justify-center`}
                            onClick={chooseFile}
                            disabled={uploading}
                        >
                            Choisir un fichier
                        </button>

                        <select
                            className="input-group mb-1 mt-1 flex w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 justify-center"
                            aria-label="Select a mod"
                            id="mod-sel"
                            value={selectedType}
                            onChange={handleSelectChange}
                            disabled={uploading}
                        >
                            <option value="chest_single">Single Chest</option>
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

                        <button
                            className={`${hasFile ? "" : "hidden"} input-group mb-1 mt-1 flex w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 justify-center`}
                            onClick={handleClearClick}
                            disabled={uploading}
                        >
                            Supprimer
                        </button>

                        <button
                            className={`${hasFile ? "" : "hidden"} input-group mb-1 mt-1 flex w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 justify-center`}
                            onClick={handleSendClick}
                            disabled={uploading}
                        >
                            Envoyer
                        </button>

                        <progress
                            id="progress-bar"
                            className={`${hasFile ? "" : "hidden"} rounded-lg w-full`}
                            max={100}
                            value={0}
                        ></progress>
                    </form>
                </div>
            </div>
        </div>
    );
};
