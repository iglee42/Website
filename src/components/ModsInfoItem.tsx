import { useState } from "react";
import { Item } from "../types/item";
import { Consumer } from "../types/consumer";

interface Props {
    item: Item;
    onClick: Consumer<Item>;
}


export const ModsInfoItems = (props:Props) => {

    const [hover, setHover] = useState(false);
    
    return (
        <button
            className="w-24 aspect-square m-2 perspective"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={()=>props.onClick(props.item)}
        >
            <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${hover ? "rotate-y-180" : ""}`}
            >
                {/* Face avant */}
                <div className="absolute w-full h-full backface-hidden">
                    <img src={props.item.image_link} alt={props.item.id} className="w-full h-full object-cover border border-gray-300 rounded-lg pixelated-image" />
                </div>

                {/* Face arrière */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gray-200 border border-gray-300 rounded-lg flex flex-col justify-center items-center text-center">
                    <p>{props.item.display_name}</p>
                    <p className="text-gray-400 italic text-xs">Click for more details</p>
                </div>
            </div>
        </button>
    );
}


