import { FaClone, FaScrewdriverWrench, FaXmark } from "react-icons/fa6";
import { getUpperName } from "../Utils";
import { FaBookmark, FaCheck, FaClock } from "react-icons/fa";

export type Idea = {
    id: number;
    title: string;
    description: string;
    mod_id: number;
    discord_id: string;
    created_at: Date;
    status: number;
    comment: string;
}
export enum Status {
    WAITING = 0,
    ACCEPTED = 1,
    REFUSED = 2,
    DUPLICATE = 3,
    IN_DEV = 4,
    FINISHED = 5
}

export function getStatusByNumber(statusCode: number) {
    return getUpperName(Status[statusCode], '_');
}

export function getIconByStatus(statusCode: number, className: string) {
    switch (statusCode) {
        case 1:
            return <FaBookmark className={`text-green-500 ${className} `} />;
        case 2:
            return <FaXmark className={`text-red-500 ${className}`} />;
        case 5:
            return <FaCheck className={`text-green-500 ${className}`} />;
        case 0:
            return <FaClock className={`text-yellow-500 ${className} `} />;
        case 4:
            return <FaScrewdriverWrench className={`text-blue-500 ${className} `} />;
        case 3:
            return <FaClone className={`text-red-500 ${className} `} />;
        default:
            break;
    }
}