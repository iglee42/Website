import { useEffect, useState } from "react";
import { Popup } from "../Popup";
import { Mod } from "../../types/mod";
import Toggle from "react-toggle";
import 'react-toggle/style.css'
import { showError, showInfo } from "../../Utils";
import { Contest, FileType } from "../../types/contest";
import { FaSpinner } from "react-icons/fa";
import FileTypeSelect from "./FileTypeSelect";
import moment from "moment";

interface Props {
  onClose: () => void;
  contest: Contest | undefined;
}

export function ContestEditPopup({ onClose, contest }: Props) {
  const [name, setName] = useState(contest ? contest.name : "");
  const [description, setDescription] = useState(contest ? contest.description : "");
  const [submissionsOpen, setSubmissionsOpen] = useState<number>(
    contest ? new Date(contest.submissions_open).getTime() : Date.now()
  );
  const [end, setEnd] = useState<number>(
    contest ? new Date(contest.end_at).getTime() : Date.now()
  );
  const [askFile, setAskFile] = useState(contest ? contest.ask_file : false);
  const [fileType, setFileType] = useState(contest ? contest.file_type : null);
  const [privateSubmissions, setPrivateSubmissions] = useState(contest ? contest.private_submissions : false);

  const [loading, setLoading] = useState(false);
  const [fileTypes, setFileTypes] = useState([] as FileType[]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/filetypes", {
      method: "GET"
    })
      .then(res => {
        if (!res.ok) throw new Error("Fetch error");
        return res.json();
      })
      .then((data: FileType[]) => {
        setFileTypes(data)
      })
      .catch(() => {
        setFileTypes([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [])

  const formatForInput = (timestamp: number) => {
    const date = new Date(timestamp);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const sendModUpdate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!name) {
      showError("Name is required");
      return;
    }
    if (!description) {
      showError("Description is required");
      return;
    }

    console.log({ submissionsOpen, end });

    if (!submissionsOpen || !end || isNaN(submissionsOpen) || isNaN(end)) {
      showError("Please set valid start and end dates");
      return;
    }

    if (submissionsOpen >= end) {
      showError("The opening date must be before the end date");
      return;
    }

    const res = await fetch(process.env.REACT_APP_API_URL + "/contest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      },
      body: JSON.stringify({
        id: contest ? contest.id : null,
        name,
        description,
        submissions_open: Math.floor(submissionsOpen/1000),
        end_at: Math.floor(end/1000),
        ask_file: askFile,
        file_type: fileType?.id || null,
        private_submissions: privateSubmissions
      })
    })
    if (res.ok) {
      onClose();
      showInfo("Contest " + name + " created/updated successfully");
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showError("Failed to create/update contest " + name);
    }
  }

  if (loading) {
    return (
      <Popup onClose={onClose} title="Loading...">
        <div className="flex justify-center items-center h-40 text-gray-600 dark:text-gray-400">
          <FaSpinner className="animate-spin mr-2" />
          <span>Loading…</span>
        </div>
      </Popup>
    )
  }

  function localDatetimeToTimestamp(value: string): number {
    // Exemple: "2025-10-06T14:30"
    const [datePart, timePart] = value.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    // Important : new Date(year, monthIndex, day, hour, minute)
    // => crée une date dans le fuseau LOCAL, pas UTC.
    return new Date(year, month - 1, day, hour, minute).getTime();
  }
  function utcTimestampToLocalDatetime(ts: number): string {
    const date = new Date(ts);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }



  return (
    <Popup onClose={onClose} title={contest ? "Edit " + contest.name : "Create A Contest"}>
      <div>
        <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
          <span className="text-lg mr-2 w-28">Name:</span>
          <input
            required={true}
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
            className=" mt-0 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none"
            placeholder="Set the contest name"
          />
        </div>

        <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
          <span className="text-lg mr-2 w-28 ">Description:</span>
          <textarea
            required={true}
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
            className=" mt-0 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize"
            placeholder="Set the contest description"
          />
        </div>

        <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
          <span className="text-sm mr-2 w-28 ">Submissions Open:</span>
          <input
            type="datetime-local"
            defaultValue={utcTimestampToLocalDatetime(submissionsOpen)}
            onChange={(e) => setSubmissionsOpen(localDatetimeToTimestamp(e.target.value))}
            className=" mt-0 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none"
            placeholder="Set the Submissions open Date"
          />
        </div>
        <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
          <span className="text-sm mr-2 w-28 ">End:</span>
          <input
            type="datetime-local"
            defaultValue={utcTimestampToLocalDatetime(end)}
            onChange={(e) => setEnd(localDatetimeToTimestamp(e.target.value))}
            className=" mt-0 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none"
            placeholder="Set the End Date"
          />
        </div>
        <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
          <span className="text-lg mr-2 w-28 ">Ask File:</span>
          <div className="w-full">
            <Toggle
              defaultChecked={askFile}
              onChange={(e) => setAskFile(e.target.checked)}
              className=" mt-0 px-3 py-2 border border-gray-300 dark:border-zinc-700  bg-red-500 resize-none"
              placeholder="Set the ask file state"
            />
          </div>
        </div>
        <div className={`pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center ${askFile ? "" : "hidden"}`}>
          <span className="text-lg mr-2 w-28 ">File Type:</span>
          <div className="w-full">
            <FileTypeSelect
              types={fileTypes}
              currentFileType={fileType}
              onChange={(e) => setFileType(e ? e.value : null)}
            />
          </div>
        </div>
        <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
          <span className="text-lg mr-2 w-28 ">Private Submissions:</span>
          <div className="w-full">
            <Toggle
              defaultChecked={privateSubmissions}
              onChange={(e) => setPrivateSubmissions(e.target.checked)}
              className=" mt-0 px-3 py-2 border border-gray-300 dark:border-zinc-700  bg-red-500 resize-none"
              placeholder="Set the featured state"
            />
          </div>
        </div>

        <div className="pt-4 border-gray-200 dark:border-zinc-700 flex justify-center items-center">
          <button
            onClick={(e) => sendModUpdate(e)}
            className=" mt-0 px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700  bg-green-600 hover:bg-green-700 resize-none"
          >Save</button>
        </div>
      </div>

    </Popup>
  );
}
