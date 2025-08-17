import { FR, GB } from "country-flag-icons/react/3x2";
import { useEffect, useState } from "react"
import Toggle from "react-toggle";

export const Legal = () => {
    
    let [tosen,setTosEn] = useState('')
    let [tosfr, setTosFr] = useState('')
    let [fr,setFr] = useState(false)


    useEffect(() => {
        fetch('/legal/tos_en.txt')
            .then((response) => response.text())
            .then((data) => setTosEn(data))
            .catch((err) => console.error('Failed to load text file', err));
    }, []);

    useEffect(() => {
        fetch('/legal/tos_fr.txt')
            .then((response) => response.text())
            .then((data) => setTosFr(data))
            .catch((err) => console.error('Failed to load text file', err));
    }, []);


    return (
        <div className="dark:text-white whitespace-pre-wrap p-20 pt-2">
            <div className="flex justify-center items-center">
                <h1 className="dark:text-white text-center text-4xl underline font-bold mr-4">Legals</h1>
                <div className="flex justify-center items-center">
                    <GB title="English" className="w-8 mr-2 mt-1" />
                    <Toggle icons={false} onChange={e=>setFr(e.target.checked)} />
                    <FR title="France" className="w-8 ml-2 mt-1" />
                </div>
            </div>
           

            <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-2 mt-2">
                {(fr ? tosfr : tosen) || <></>}
            </div>
        </div>
    )

}