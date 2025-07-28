import { Consumer } from "../types/consumer";

interface Props{
    tag: string;
    onClick: Consumer<string>
}

export const Tag = (prop: Props) => {

    return (
        <span className="bg-gray-200 dark:bg-gray-800 rounded mr-2 cursor-pointer" onClick={()=>prop.onClick(prop.tag)}> {prop.tag}</span>
    )
}