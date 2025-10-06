import { Popup } from "./Popup";
import FileViewer from "./FileViewer";
import { useEffect, useState } from "react";
import { showError } from "../Utils";

interface Props {
  file: string;
  download?: boolean;
  downloadFileName?: string;
  onClose: () => void;
}

export function FileViewerPopup({ file, download, downloadFileName, onClose }: Props) {

  const [previewFile, setPreviewFile] = useState<File | null>(null);

  console.log(download)
  console.log(downloadFileName)


  useEffect(() => {
    fetch(new URL(file), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    }).then(res => {
      if (res.ok) {
        return res.blob();
      }
      throw new Error("File fetch error");
    }).then(blob => {
      const filename =  downloadFileName || 'file';
      const fileObj = new File([blob], filename, { type: blob.type });
      setPreviewFile(fileObj);
    }).catch(() => {
      onClose();
      showError("Failed to load file for preview")
    })
  },[])

  if (!previewFile) {
    return <></>
  } 

  return (
    <Popup onClose={onClose} title={"Previewing " + previewFile!.name}>
      <div className="flex flex-col items-center">
        <FileViewer file={previewFile!} />
        {download && (<a href={URL.createObjectURL(previewFile!)} download={downloadFileName ? downloadFileName : 'download'} className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300">Download File</a>
        )}
      </div>
    </Popup>
  );
}
