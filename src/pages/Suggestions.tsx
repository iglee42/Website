import { FormEvent, useRef, useState } from "react";
import { ModSelect } from "../components/ModSelect";
import { FaPaperPlane } from "react-icons/fa";
import '../css/suggestion.css'
import { IdeasTable } from "../components/IdeasTable";
import { getUser, isLogged } from "../Utils";


export const Suggestions = () => {



    const [animationClass, setAnimationClass] = useState('');
    const [error, setErrorInternal] = useState('');

    const modSelectRef = useRef<any>();


    function setError(error: string) {
        setErrorInternal(error)
        setTimeout(() => {
            setErrorInternal('')
        }, 3000)
    }

    function sendForm(event: FormEvent<any>) {
        event.preventDefault()
        setErrorInternal('');
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
                <div className="input-group mb-3 mt-3 w-1/2 border border-gray-300 rounded-lg flex">
                    <span className="bg-gray-200 w-1/4 p-2.5 flex items-center justify-center rounded-l-lg border-r border-gray-300">
                        Title
                    </span>
                    <input type="text" className="form-control w-3/4 p-2.5  rounded-r-lg focus:outline-none" aria-label="Title" id="title" />
                </div>
                <div className="input-group mt-3 w-1/2 border border-gray-300 rounded-lg flex">
                    <span className="bg-gray-200 w-1/4 p-2.5 flex items-center justify-center rounded-l-lg border-r border-gray-300">
                        Description
                    </span>
                    <textarea className="form-control w-3/4 p-2.5 bg-white rounded-r-lg focus:outline-none" aria-label="Description" id="description" rows={4}></textarea>
                </div>
                <p className={`input-group transi-all flex w-2/4 text-sm p-2.5 justify-center text-gray-500`}><i>There is no formatting on the description (No markdown)</i></p>
                <button type="submit" className={`input-group mb-3 mt-3 flex w-1/4 border border-gray-300 rounded-lg p-2.5 justify-center ${animationClass}`} id="send-suggest"><FaPaperPlane className="h-5 w-5 mr-2 mt-1" id="send-icon" /> <span id="send-text">Send</span></button>
                <p className={`input-group transi-all mb-3 mt-3 flex w-2/4 text-lg p-2.5 justify-center text-red-600 ${error.length > 0 ? 'translate-0' : '-translate-y-1/4'}`}>{error}</p>
            </form>
            <IdeasTable />
        </div>
    );
}