import { MouseEventHandler } from "react";
import { getTypeByNumber, Item } from "../../types/item";
import { convertStringToArray, getUpperName, showError, showInfo, split } from "../../Utils";
import { Tag } from "../Tag";
import { Popup } from "../Popup";

interface Props {
    item: Item;
    onClose: MouseEventHandler<HTMLButtonElement>;
}

export function ItemPopup(props: Props) {
    const handleCopy = async (tag: string) => {
        try {
            await navigator.clipboard.writeText('#'+tag);
            showInfo('Copied to Clipboard')
        } catch (error) {
            showError('Unable to copy to Clipboard')
        }
    };
    return (
        <Popup onClose={props.onClose}>
            
                <div className="relative p-4 flex flex-col items-center min-w-max w-full max-w-full">
                    <img
                        src={props.item.image_link}
                        alt={props.item.display_name}
                        className="w-1/2 h-full object-cover rounded-t-lg pixelated-image"
                    />
                    <div className="text-center mt-2">
                        <h2 className="text-lg font-bold">{props.item.display_name}</h2>
                        <p className="text-gray-600">Mod : {getUpperName(split(props.item.id, ':')[0], '_')}</p>
                        <p className="text-gray-600">ID : {props.item.id}</p>
                        <p className="text-gray-600">Type : {getUpperName(getTypeByNumber(props.item.type), '_')}</p>
                        <p className="text-gray-600">
                            Tags : {convertStringToArray(props.item.tags).map(t => <Tag key={t} tag={t} onClick={handleCopy} />)}
                        </p>
                    </div>
                </div>
        </Popup>
    )
}
    

