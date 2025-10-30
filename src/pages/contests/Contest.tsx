/* eslint-disable react-hooks/exhaustive-deps */
import { DragEvent, MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import { useUser } from "../../UserProvider";
import { FaArrowLeft, FaBackspace, FaClock, FaSpinner, FaTimes, FaUpload } from "react-icons/fa";
import moment from "moment";
import { getUserAvatarUrl, getUserById, hasPermission, showError, showInfo } from "../../Utils";
import { Contest, Submission } from "../../types/contest";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import { DiscordUser } from "../../types/discordUser";
import { FileViewerPopup } from "../../components/FileViewerPopup";
import FileViewer from "../../components/FileViewer";
import background from "../../images/background.png"
import reactStringReplace from "react-string-replace";

export const ContestPage = () => {

  const [contest, setContest] = useState<Contest | null>(null)
  const [logged, setLogged] = useState(false);
  const [files, setFiles] = useState<File | null>(null)
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<DiscordUser[]>([]);
  const [previewSubmission, setPreviewedSubmission] = useState<Submission | null>(null);
  const [progress, setProgress] = useState<number>(-1);
  const [now, setNow] = useState(new Date());


  const nameFieldRef = useRef<HTMLInputElement>(null);
  const descriptionFieldRef = useRef<HTMLTextAreaElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const fileUploadDivRef = useRef<HTMLDivElement>(null);
  const mainDivRef = useRef<HTMLDivElement>(null);

  const userProvider = useUser();

  const [submission, setSubmission] = useState<Submission | null>(null)

  useEffect(() => {
    if (userProvider.user !== null) setLogged(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);



  const location = useLocation();
  const id = location.pathname.split('/')[2]
  const navigate = useNavigate()

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/contest/" + id, {
      method: "GET"
    })
      .then(res => {
        if (!res.ok) throw new Error("Fetch error");
        return res.json();
      }).then((data: Contest) => {
        setContest(data)
        fetch(process.env.REACT_APP_API_URL + "/contest/" + id + "/submissions", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          }
        })
          .then(res => {
            if (!res.ok) {
              if (res.status === 403) {
                setLoading(false);
                return [];
              }
              else {
                throw new Error("Fetch error");
              }
            }
            return res.json();
          })
          .then((data: Submission[]) => {
            setSubmissions(data)
            const userIds = Array.from(new Set(data.map(sub => sub.discord_id)));
            Promise.all(userIds.map(id => getUserById(id)))
              .then(users => {
                setUsers(users.filter((user): user is DiscordUser => user !== null));
              });
          })
          .catch(() => {
            showError("Failed to fetch submissions")
          })
          .finally(() => setLoading(false));
      })
      .catch(() => {
        navigate('/contests')
        showError("Invalid contest id")
      })
      .finally(() => { })
  }, [])

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/contest/" + id + "/submissionby/" + userProvider.user!.id, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: Submission) => {
        setSubmission(data)
      })
      .catch(() => {
        setSubmission(null)
      })
  }, [userProvider.user])




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

  const openDate = new Date(contest.submissions_open);
  const endDate = new Date(contest.end_at);


  let message = "";
  let targetDate = null;

  if (openDate > now) {
    message = "";
  } else if (endDate > now) {
    message = "Ends in";
    targetDate = endDate;
  } else {
    message = "Contest ended " + moment(endDate).fromNow();
  }


  function selectBodyToShow(): ReactNode {
    if (new Date(contest!.end_at) < new Date()) {
      return <div className="flex justify-center items-center flex-col">
        <FaTimes className="size-20 text-red-500" />
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Contest ended</h2>
        <p className="text-lg text-center mb-3 ">
          Submissions are closed.
        </p>
      </div>
    } else if (new Date(contest!.submissions_open) > new Date()) {
      return <div className="flex justify-center items-center flex-col">
        <FaClock className="size-20 text-yellow-500" />
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Submissions not open yet</h2>
        <p className="text-lg text-center mb-3 ">
          Submissions open in
          <div className="grid grid-flow-col gap-5 mt-2 text-center auto-cols-max">
            <div className="flex flex-col">
              <span className="countdown font-mono text-5xl">
                <span style={{ "--value": moment.duration(moment(contest!.submissions_open).diff(moment(now))).days() } as React.CSSProperties} aria-live="polite" >{moment.duration(moment(contest!.submissions_open).diff(moment(now))).days()}</span>
              </span>
              days
            </div>
            <div className="flex flex-col">
              <span className="countdown font-mono text-5xl">
                <span style={{ "--value": moment.duration(moment(contest!.submissions_open).diff(moment(now))).hours() } as React.CSSProperties} aria-live="polite" >{moment.duration(moment(contest!.submissions_open).diff(moment(now))).hours()}</span>
              </span>
              hours
            </div>
            <div className="flex flex-col">
              <span className="countdown font-mono text-5xl">
                <span style={{ "--value": moment.duration(moment(contest!.submissions_open).diff(moment(now))).minutes() } as React.CSSProperties} aria-live="polite" >{moment.duration(moment(contest!.submissions_open).diff(moment(now))).minutes()}</span>
              </span>
              min
            </div>
            <div className="flex flex-col">
              <span className="countdown font-mono text-5xl">
                <span style={{ "--value": moment.duration(moment(contest!.submissions_open).diff(moment(now))).seconds() } as React.CSSProperties} aria-live="polite" >{moment.duration(moment(contest!.submissions_open).diff(moment(now))).seconds()}</span>
              </span>
              sec
            </div>
          </div>
        </p>
      </div>
    } else {
      return <form className="grid grid-cols-1">
        <h2 className="text-2xl font-bold  text-gray-800 dark:text-white mb-2">Your submission</h2>

        {submission == null ? <div> <p className="text-lg text-center mb-3 ">
          Will be submitted as <img alt="" className="size-6 rounded-full inline-block mr-2 -mt-1" src={getUserAvatarUrl(userProvider.user!)} />{userProvider.user?.username}
        </p>
          <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
            <span className="text-lg mr-2 w-28">Name:</span>
            <input
              required={true}
              className=" mt-0 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none"
              placeholder="Submission Name"
              ref={nameFieldRef}
            />
          </div>

          <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
            <span className="text-lg mr-2 w-28">Description:</span>
            <textarea
              required={true}
              className=" mt-0 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize"
              placeholder="Submission Description"
              ref={descriptionFieldRef}
            />
          </div>

          {contest!.ask_file ? <div className="pt-2 mt-4 grid grid-cols-1 border-t-[1px] dark:border-t-white" ref={fileUploadDivRef}>
            <h3 className="text-xl font-bold  text-gray-800 dark:text-white mb-2 mt-2">File</h3>

            <div className={`${files ? "" : "hidden"}  text-gray-800 dark:text-white`}>
              Selected file :
              <span> {files?.name}</span>
            </div>

            {/*Should be hidden because replaced by another button */}
            <input
              type="file"
              accept={contest!.file_type.allowed_types}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files!)}
            />
            <div className="text-xs text-center text-gray-500 dark:text-gray-400 italic space-y-1">
              <p>Drag and Drop allowed</p>
              <p>Only {contest!.file_type.name} allowed</p>
            </div>

            <button
              className={`${files ? "hidden" : ""} input-group mb-1 mt-1 flex w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 justify-center`}
              onClick={chooseFile}
            >
              Choose a file
            </button>

            <button
              onClick={(e) => deleteUploadedFile(e)}
              className={`${files ? "" : "hidden"} mt-1 ml-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700  bg-red-600 hover:bg-red-700 resize-none`}
            >Delete File</button>

            {files && <FileViewer file={files} />}

          </div> : <></>}

          <div className="pt-2 mt-4 grid grid-cols-1 border-t-[1px] dark:border-t-white">
            <div className="text-xs text-center text-gray-500 dark:text-gray-400 italic space-y-1">
              <p>Once submitted, your submission can't be modified</p>
            </div>
            <button className="mt-4 inline-block bg-green-600  disabled:bg-green-950 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300" onClick={sendSubmission} ref={submitBtnRef}>Submit</button>
            <div className={`${progress >= 0 ? "" : "hidden"} mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4`}>
              <div className="bg-green-600 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
          : <div>
            <p className="text-lg text-center mb-3 ">
              You have already submitted to this contest as <img alt="" className="size-6 rounded-full inline-block mr-2 -mt-1" src={getUserAvatarUrl(userProvider.user!)} />{userProvider.user?.username}
            </p>
            <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
              <span className="text-lg mr-2 "><span className="font-bold underline">Name:</span> {submission.name}</span>
            </div>
            <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center flex-col">
              <span className="text-lg mr-2 w-28 font-bold underline">Description:</span>
              <p>{reactStringReplace(submission.description, "\n", (_, i) => <br key={i} />) }</p>
            </div>
            {contest!.ask_file ? <div className="pt-2 mt-4 grid grid-cols-1 border-t-[1px] dark:border-t-white" ref={fileUploadDivRef}>
              <h3 className="text-xl font-bold  text-gray-800 dark:text-white mb-2 mt-2">File</h3>
              <button className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300" onClick={e => { e.preventDefault(); e.stopPropagation(); setPreviewedSubmission(submission) }}>Preview File</button>
            </div> : <></>}
          </div>}

      </form>
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
    if (mainDivRef.current) {
      mainDivRef.current!.classList.add("hidden")
    }
  }

  function handleFiles(fileList: FileList) {
    const listFiles = Array.from(fileList);
    const file = listFiles[0];
    setFiles(file);
  }

  function chooseFile(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const input = document.querySelector("input[type=file]") as HTMLInputElement | null;
    if (input) input.click();
  }

  function sendSubmission(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();


    if (nameFieldRef.current?.value.trim() === "") {
      showError("You need to enter a name for your submission");
      return;
    }

    if (descriptionFieldRef.current?.value.trim() === "") {
      showError("You need to enter a description for your submission");
      return;
    }

    if (!files && contest?.ask_file) {
      showError("You need to select a file");
      return;
    }
    const form = e.currentTarget.closest("form") as HTMLFormElement | null;
    if (!form) {
      showError("Form not found");
      return;
    }


    submitBtnRef.current!.disabled = true;
    const formData = new FormData();
    if (files) formData.append("file", files);
    formData.append("name", nameFieldRef.current?.value || "");
    formData.append("description", descriptionFieldRef.current?.value || "");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", process.env.REACT_APP_API_URL + "/contest/" + id + "/submission", true);
    xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem("authToken")}`);


    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 201) {
        setProgress(-1);
        showInfo("Submission added successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showError("Failed to upload file: " + JSON.parse(xhr.response).error);
        setProgress(-1);
        submitBtnRef.current!.disabled = false;
      }
    };

    xhr.onerror = () => {
      showError("Error while uploading file: " + xhr.statusText);
    };

    xhr.send(formData);
  }

  function deleteUploadedFile(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setFiles(null);
  }


  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (mainDivRef.current) {
      mainDivRef.current!.classList.remove("hidden")
    }
  }

  function onDragEnd(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (mainDivRef.current) {
      mainDivRef.current!.classList.add("hidden")
    }
  }


  return (
    <div onDrop={handleDrop} onDragOver={onDragOver} onDragLeave={onDragEnd}>

      <div className="z-40 bg-black bg-opacity-70 h-screen top-0 w-full fixed flex justify-center items-center hidden" ref={mainDivRef}>
        <div className=" p-4 rounded-xl flex flex-col justify-center items-center text-white text-2xl font-bold pointer-events-none select-none border border-dashed border-white">
          <FaUpload className="size-32 mb-2" />
          <div>Drop your file here to upload</div>
        </div>
      </div>
      <div className="w-full z-10 text-gray-800 dark:text-white">
        {
          previewSubmission && (
            <FileViewerPopup file={process.env.REACT_APP_API_URL + "/contest/" + contest.id + "/submission/" + previewSubmission.id + "/file"} downloadFileName={(users.find(u => u.id === previewSubmission.discord_id)?.username + "'s Submission") || ""} download={hasPermission(userProvider.user!, 2)} onClose={() => setPreviewedSubmission(null)} />
          )
        }

        <div
          className={`flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-black text-white text-center px-4 py-20 bg-no-repeat bg-cover w-full`}
          style={{ backgroundImage: `linear-gradient(to top, ${localStorage.getItem('darkMode') === "true" ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)"}, transparent 50%,transparent), url(${background})` }}
        >
          <a className="absolute z-10 top-40 left-6 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center cursor-pointer transition-all hover:scale-105 hover:shadow-xl" href="/contests" title="Back">
            <FaArrowLeft className=" w-6 h-6 transition-colors duration-300 dark:text-white text-gray-800" />
          </a>
          <h1 className="text-3xl font-bold text-center mb-6 ">
            {contest.name}
          </h1>
          <p className="text-xl text-center mb-3 ">
            {contest.description}
          </p>

          <p className="text-xl text-center mb-3">
            <span className={`font-semibold transition-colors ${moment.duration(moment(contest!.end_at).diff(moment(now))).minutes() < 5 ? "text-red-600" : ""}`}>{message} {targetDate && (
              <div className={`grid grid-flow-col gap-3 mt-2 text-center auto-cols-max text-lg `}>
                <div className="flex flex-col">
                  <span className="countdown font-mono text-3xl">
                    <span style={{ "--value": moment.duration(moment(contest!.end_at).diff(moment(now))).days() } as React.CSSProperties} aria-live="polite" >{moment.duration(moment(contest!.end_at).diff(moment(now))).days()}</span>
                  </span>
                  days
                </div>
                <div className="flex flex-col">
                  <span className="countdown font-mono text-3xl">
                    <span style={{ "--value": moment.duration(moment(contest!.end_at).diff(moment(now))).hours() } as React.CSSProperties} aria-live="polite" >{moment.duration(moment(contest!.end_at).diff(moment(now))).hours()}</span>
                  </span>
                  hours
                </div>
                <div className="flex flex-col">
                  <span className="countdown font-mono text-3xl">
                    <span style={{ "--value": moment.duration(moment(contest!.end_at).diff(moment(now))).minutes() } as React.CSSProperties} aria-live="polite" >{moment.duration(moment(contest!.end_at).diff(moment(now))).minutes()}</span>
                  </span>
                  min
                </div>
                <div className="flex flex-col">
                  <span className="countdown font-mono text-3xl">
                    <span style={{ "--value": moment.duration(moment(contest!.end_at).diff(moment(now))).seconds() } as React.CSSProperties} aria-live="polite" >{moment.duration(moment(contest!.end_at).diff(moment(now))).seconds()}</span>
                  </span>
                  sec
                </div>
              </div>
            )} </span>
          </p>
          <p className="text-xl text-center mb-3 ">
            Private submissions : {contest.private_submissions ? "✅" : "❌"}
          </p>
        </div>
        <div className="flex w-full font-sans px-4 py-6 text-center justify-center items-start">
          <div className="w-full max-w-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            {selectBodyToShow()}
          </div>
        </div>

        {submissions.length > 0 && (!contest.private_submissions || hasPermission(userProvider.user!, 2)) && <div className={`mt-6 px-4 py-6 w-full border-t-solid text-center justify-center items-center dark:border-t-white ${new Date(contest.submissions_open) < new Date() ? "" : "hidden"} ${new Date(contest.end_at) > new Date() ? "" : "border-t-2"}`}>
          <div className="w-full max-w-screen-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white mt-2">Submissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submissions.map((submission) => {
                const user = users.find(u => u.id === submission.discord_id);
                if (!user) return (<></>)
                return (
                  <div key={submission.id} className="border rounded-xl p-5 bg-white/60 dark:bg-gray-900/60 hover:shadow-lg transition-shadow duration-300 text-left">
                    <h3 className="text-lg font-semibold mb-1">{submission.name}</h3>
                    <p className="text-sm mb-2 line-clamp-4">{submission.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Submitted by <img alt="" className="size-5 rounded-full inline-block mr-2 -mt-1" src={getUserAvatarUrl(user!)} />{user?.username}</p>
                    {contest.ask_file && <button onClick={() => setPreviewedSubmission(submission)} className="mt-2 inline-flex bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors duration-300">Preview File</button>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  );
};