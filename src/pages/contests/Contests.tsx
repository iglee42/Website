/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useUser } from "../../UserProvider";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { Contest } from "../../types/contest";


export const Contests = () => {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState<Contest[]>([])


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
     
    </div>
  );
};