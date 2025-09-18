/* eslint-disable react-hooks/exhaustive-deps */
import { DragEvent, MouseEvent, useEffect, useState } from "react";
import { useUser } from "../../UserProvider";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { NbtCompound, NbtFile } from "deepslate";
import StructureViewer from "../../components/StructureViewer";
import moment from "moment";
import { getUserAvatarUrl, showError } from "../../Utils";
import { Contest } from "../../types/contest";
import { useLocation, useNavigate } from "react-router-dom";


export const ContestPage = () => {

  const [contest, setContest] = useState<Contest | null>(null)
  const [logged, setLogged] = useState(false);
  const [files,setFiles] = useState<File[] | File | null>(null)
  const [structure, setStructure] = useState<NbtCompound | null>(null);
  const [loading, setLoading] = useState(true);


  const userProvider = useUser();

  useEffect(() => {
    if (userProvider.user !== null) setLogged(true)
  }, [])
  
  const location = useLocation();
  const id = location.pathname.split('/')[2]
  const navigate = useNavigate()
  
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/contests/"+id, {
      method: "GET"
    })
      .then(res => {
        if (!res.ok) throw new Error("Fetch error");
        return res.json();
      })
      .then((data: Contest) => {
        setContest(data)
        console.log(data)
      })
      .catch(() => {
        navigate('/contests')
        showError("Invalid contest id")
      })
      .finally(() => {
        setLoading(false);
      });
  },[])


  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  }

  function handleFiles(fileList: FileList) {
    const listFiles = Array.from(fileList);
    setFiles(listFiles.length > 1 ? listFiles : listFiles[0])

  }

  
  function chooseFile(e: MouseEvent<HTMLButtonElement>) {
      e.preventDefault();
      e.stopPropagation();
      const input = document.querySelector("input[type=file]") as HTMLInputElement | null;
      if (input) input.click();
  }

  
  useEffect(() => {
    if (files) {
      (Array.isArray(files)
        ? files[0]
        : files).arrayBuffer().then(data => {
        const file = NbtFile.read(new Uint8Array(data))
        setStructure(file.root)
      })
    } else {
      setStructure(null)
    }
  },[files])
  

  if (!logged) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-red-600">
        <FaTimes className="size-32" />
        <div className="text-gray-600 dark:text-gray-400">
          <span className="animate-pulse">You need to be logged to access this page !</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-600 dark:text-gray-400">
        <FaSpinner className="animate-spin mr-2" />
        <span>Loading…</span>
      </div>
    )
  }

  if (!contest) {
    navigate('/conquests')
    showError("Invalid contest id")
    return (<></>);
  }



  return (
    <div onDrop={handleDrop} onDragOver={(e)=>e.preventDefault()} className="w-full max-w-screen-xl mx-auto px-4 py-10 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold text-center mb-6 ">
        {contest.name}
      </h1>
      <p className="text-sm text-center mb-3 ">
        {contest.description}

      </p>
      <p className="text-sm text-center mb-3 ">
        {(new Date(contest.end_at) < new Date() ? "Ended " : "End : " )+ moment(contest.end_at).fromNow()}
      </p>
      <div
        className="flex w-full font-sans p-4 text-center justify-center items-center border-t-solid border-t-2  dark:border-t-white"
        
      >
        <form className="grid grid-cols-1">
          <h2 className="text-2xl font-bold  text-gray-800 dark:text-white mb-2">Your submission</h2>

          <p className="text-lg text-center mb-3 ">
            Will be submitted as <img alt="" className="size-6 rounded-full inline-block mr-2 -mt-1" src={getUserAvatarUrl(userProvider.user!)} />{userProvider.user?.username}
          </p>
          <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
            <span className="text-lg mr-2 w-28">Name:</span>
            <input
              required={true}
              className=" mt-0 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none"
              placeholder="Submission Name"
            />
          </div>

          <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
            <span className="text-lg mr-2 w-28">Description:</span>
            <textarea
              required={true}
              className=" mt-0 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize"
              placeholder="Submission Description"
            />
          </div>

          {contest.ask_file ? <div className="pt-4 border-gray-200 dark:border-zinc-700 grid grid-cols-1">
            <h3 className="text-xl font-bold  text-gray-800 dark:text-white mb-2 mt-2">Files</h3>

          <div className={`${files ? "" : "hidden"}  text-gray-800 dark:text-white`}>
            Selected file(s) :
            {Array.isArray(files) ? files.map(f => <span><br/>- {f?.name}</span>) : <span> { files?.name }</span>}
          </div>

          {/*Should be hidden because replaced by another button */}
          <input 
            type="file"
            accept={contest.file_type.allowed_types}
            className="hidden"
            onChange={(e)=>handleFiles(e.target.files!)}
          />

          <span>Drag and Drop allowed</span>
          <span>Only {contest.file_type.name} allowed</span>

          <button
            className={`${files ? "hidden" : ""} input-group mb-1 mt-1 flex w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 justify-center`}
            onClick={chooseFile}
          >
            Choose a file
          </button>


          <button
            className={`${!files ? "hidden" : ""} input-group mb-1 mt-1 flex w-full border border-gray-300 dark:border-gray-700 bg-red-600 hover:bg-red-700 rounded-lg p-2.5 justify-center`}
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); setStructure(null);  setFiles(null)}}
          >
            Delete File
          </button>
          </div>
            : <></>}

        </form>
        </div>
      {structure && <StructureViewer structure={structure} />}
    </div>
  );
};