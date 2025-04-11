import { MouseEventHandler, ReactNode } from "react";
import { FaTimes } from "react-icons/fa";

interface Props {
    onClose: MouseEventHandler<HTMLButtonElement>;
    children: ReactNode
}

export function Popup( props: Props ) {
    
    return (
        <div className="fixed inset-0 flex flex-wrap w-full items-center justify-center bg-black bg-opacity-50 z-10 transi-all">
            <div className="relative bg-white rounded-lg shadow-lg min-w-max max-w-full flex flex-wrap w-max">
                <div className="flex flex-wrap w-full">
                    {props.children}
                </div>
                <button
                    onClick={props.onClose}
                    className="absolute top-2 right-2 -mr-11  px-2 py-2 bg-gray-100 rounded hover:bg-gray-200 transi-all"
                >
                    <FaTimes />
                </button>

            </div>
        </div>
    )
}