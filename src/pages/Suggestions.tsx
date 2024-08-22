import { FormEvent } from "react";
import { ModSelect } from "../components/ModSelect";

export const Suggestions = () => {

    function sendForm(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        console.log("slt")
        
    }

    return (
        <div className="flex items-center flex-col mt-5">
            <form onSubmit={sendForm} className="w-1/2 flex items-center flex-col">
                <ModSelect />
                <button type="submit">Search</button>
            </form>
        </div>
    );
}