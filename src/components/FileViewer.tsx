import React, { useEffect, useState } from 'react';
import StructureViewer from './StructureViewer';
import { NbtCompound, NbtFile } from 'deepslate';


interface FileViewerProps {
    file: File;
}

const FileViewer: React.FC<FileViewerProps> = ({ file }) => {

    const [preview, setPreview] = useState<string | null>(null);
    const [structure, setStructure] = useState<NbtCompound | null>(null);
    
    

    useEffect(() => {
        // Images
        if (file.type.startsWith("image/")) {
            setPreview(URL.createObjectURL(file));
        }
        // Text / JSON
        else if (file.type.startsWith("text/") || file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsText(file);
        }
        // PDF
        else if (file.type === "application/pdf") {
            setPreview(URL.createObjectURL(file));
        }
        // Sinon pas de preview
        else {
            file.arrayBuffer().then(data => {
                try {
                    const file = NbtFile.read(new Uint8Array(data))
                    setStructure(file.root)
                } catch (e) {
                    setStructure(null)
                }
            })
            setPreview(null);
        }
    },[file])

    

    return <div>
        {structure && <StructureViewer structure={structure} />}
        {/* Preview si dispo */}
        {preview && (
            <div className="mt-3 flex justify-center pixelated-image">
                {file.type.startsWith("image/") && (
                    <img
                        src={preview}
                        alt="preview"
                        className="w-full max-w-sm max-h-64 object-contain border rounded shadow mt-2 pixelated"
                    />
                )}
                {(file?.type.startsWith("text/") || file.type === "application/json") && (
                    <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded min-h-40 h-40 overflow-y-auto text-wrap text-left resize">
                        {preview}
                    </pre>
                )}
                {file?.type === "application/pdf" && (
                    <embed src={preview} type="application/pdf" width="100%" height="400px" />
                )}
            </div>
        )}
    </div>;
};

export default FileViewer;
