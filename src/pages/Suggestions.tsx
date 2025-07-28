import { FormEvent, useRef, useState } from "react";
import { ModSelect } from "../components/ModSelect";
import { FaPaperPlane } from "react-icons/fa";
import '../css/suggestion.css'
import { IdeasTable } from "../components/IdeasTable";
import { getUser, isLogged, showError } from "../Utils";


export const Suggestions = () => {



    const [animationClass, setAnimationClass] = useState('');

    const modSelectRef = useRef<any>();


    function setError(error: string) {
        showError(error)
    }

    function sendForm(event: FormEvent<any>) {
        event.preventDefault()
        clearTimeout(0)

        let form: HTMLFormElement = document.querySelector("#suggest-form")!
        if (modSelectRef.current) {
            if (!modSelectRef.current.getSelectedMod()) {
                sendAnimation(false)
                setError("Please choose a mod")
                return;
            }
        }
        let titleField: HTMLInputElement = form.querySelector("#title")!
        if (titleField.value.length === 0) {
            sendAnimation(false)
            setError("Please enter a title")
            return;
        }
        let descField: HTMLTextAreaElement = form.querySelector("#description")!
        if (descField.value.length === 0) {
            sendAnimation(false)
            setError("Please enter a description")
            return;
        }
        var http = new XMLHttpRequest();
        var url = "https://api.iglee.fr/suggestion";
        http.open("POST", url, true);
        http.setRequestHeader("Content-type", "application/json");

        http.onreadystatechange = function () {
            if (http.readyState === 4 && http.status === 201) {
                sendAnimation(true)
                setTimeout(() => window.location.reload(), 1000)
            }
        }
        http.onerror = function () {
            setError('Internal Error, Try Later')
            sendAnimation(false)
        }
        http.send(JSON.stringify({
            modID: modSelectRef.current.getSelectedMod().id,
            title: titleField.value,
            description: descField.value,
            userId: isLogged() ? getUser()?.id : -1
        }));
    }

    function sendAnimation(success: boolean) {
        setAnimationClass('animation-send-' + (success ? 'success' : 'fail'))
        if (!success) {
            setTimeout(() => {
                setAnimationClass('');
            }, 500);
        }
    }



    return (
        <div className="flex items-center flex-col mt-5">
            <form onSubmit={sendForm} className="w-1/2 flex items-center flex-col" id="suggest-form">
                <ModSelect ref={modSelectRef} />
                <div className="input-group mb-3 mt-3 w-1/2 border border-gray-300 dark:border-gray-700 rounded-lg flex">
                    <span className="bg-gray-200 dark:bg-gray-800 w-1/4 p-2.5 flex items-center justify-center rounded-l-lg border-r border-gray-300 dark:border-gray-700">
                        Title
                    </span>
                    <input type="text" className="form-control w-3/4 p-2.5 rounded-r-lg focus:outline-none" aria-label="Title" id="title" />
                </div>
                <div className="input-group mt-3 w-1/2 border border-gray-300 dark:border-gray-700 rounded-lg flex">
                    <span className="bg-gray-200 dark:bg-gray-800 w-1/4 p-2.5 flex items-center justify-center rounded-l-lg border-r border-gray-300 dark:border-gray-700">
                        Description
                    </span>
                    <textarea className="form-control w-3/4 p-2.5 bg-white dark:bg-black rounded-r-lg focus:outline-none" aria-label="Description" id="description" rows={4}></textarea>
                </div>
                <p className={`input-group transi-all flex w-2/4 text-sm p-2.5 justify-center text-gray-500`}><i>There is no formatting on the description (No markdown)</i></p>
                <p className={`input-group transi-all flex w-2/4 text-sm p-2.5 justify-center text-gray-500`}><i>You can login to be notified of the changes of your suggestion</i></p>
                <button type="submit" className={`input-group mb-3 mt-3 flex w-1/4 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 justify-center ${animationClass}`} id="send-suggest"><FaPaperPlane className="h-5 w-5 mr-2 mt-1" id="send-icon" /> <span id="send-text">Send</span></button>
            </form>
            <IdeasTable />
        </div>
    );
}