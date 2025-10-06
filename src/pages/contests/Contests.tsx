/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useUser } from "../../UserProvider";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { Contest } from "../../types/contest";
import { hasPermission } from "../../Utils";
import { ContestEditPopup } from "../../components/contests/EditContestPopup";


export const Contests = () => {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState<Contest[]>([])

  const [editingContest, setEditingContest] = useState<Contest | undefined>(undefined);
  const [isEditingContest, setIsEditingContest] = useState<boolean>(false);


  const userProvider = useUser();

  useEffect(() => {
    if (userProvider.user !== null) setLogged(true)
  }, [])
  
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/contests", {
      method: "GET"
    })
      .then(res => {
        if (!res.ok) throw new Error("Fetch error");
        return res.json();
      })
      .then((data: Contest[]) => {
        setContests(data)
        console.log(data)
      })
      .catch(() => {
        setContests([]);
      })
      .finally(() => {
        setLoading(false);
      });
  },[])


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



  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-10 text-gray-800 dark:text-white">
      {isEditingContest && <ContestEditPopup contest={editingContest} onClose={() => { setEditingContest(undefined); setIsEditingContest(false) }} />}
      <h1 className="text-3xl font-bold text-center mb-6 ">
        Available Contests
      </h1>
      <div>
      {contests.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">
          No contests available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => (
              <div key={contest.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-2">{contest.name}</h2>
                <p className="text-sm mb-4">{contest.description}</p>
                {new Date(contest.end_at) > new Date() && <p className="text-sm text-gray-500">{(new Date(contest.submissions_open) < new Date() ? "In Progress " : "Submissions Open : " + new Date(contest.submissions_open).toLocaleString())}</p>}
                <p className="text-sm text-gray-500">{(new Date(contest.end_at) < new Date() ? "Ended " : "End : " + new Date(contest.end_at).toLocaleString()) }</p>
                <a href={`/contest/${contest.id}`} className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300">View Contest</a>
                {hasPermission(userProvider.user!, 2) && <button onClick={e => { setEditingContest(contest); setIsEditingContest(true) }} className="mt-4 ml-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300">Edit Contest</button>}
              </div>
            ))}
        </div>
        )}
        {hasPermission(userProvider.user!, 2) && <button onClick={e => { setIsEditingContest(true) }} className="mt-4 ml-2 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300">Create a Contest</button>}
      </div>
    </div>
  );
};