import useDropdownMenu from "react-accessible-dropdown-menu-hook";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { Navigate } from "react-router-dom";
import { getUser, getUserAvatarUrl, hasUserPermission, isLogged } from "../Utils";

export const LoggedInfo = () => {
    let menuItems = hasUserPermission(2) ? 2 : 1;

    const { buttonProps, itemProps, isOpen } = useDropdownMenu(menuItems);

    if (!isLogged()) {
        return (
            <span className={[
                "text-3xl",
                "flex",
                "navItem",
                "transi-all"
            ].join(" ")}> Logged</span>
        )
    }
    let user = getUser();

    if (!user) {
        return <Navigate to="/" />
    }
    function fixEncoding(str: String): string {
        // Convertir la chaîne en bytes "latin1"
        const bytes = new Uint8Array(Array.from(str).map(ch => ch.charCodeAt(0)));


        // Décoder en UTF-8
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    }
    let username = user.username;
    let displayName = fixEncoding(user.global_name);
    
    const logout = async () => {
        localStorage.removeItem("user");
        window.location.reload();
    };

    let currentProps = 0;
    function getItemProps() {
        return itemProps[currentProps++];
    }
    
    return (
        <button {...buttonProps} className={['navItem flex text-2xl items-center relative transi-all', (isOpen ? "rcs-color":"")].join(" ")}>
            <img src={getUserAvatarUrl(user)} alt={username} className=' rounded-full size-10 mr-2 icon'></img> {displayName}

            <div className={[(isOpen ? '' : 'invisible'), 'absolute -left-8 dropdown-content transi-all'].join(" ")} style= {{ bottom: -70*menuItems -(10*(menuItems-1))}} role='menu'>
                {/*<a {...itemProps[0]} className='flex items-center w-auto justify-center' href='https://youtube.iglee.fr'>
                    <FaYoutube className='mr-2' />
                    Youtube (🇫🇷)
                </a>*/}
                {hasUserPermission(2) ? <a {...getItemProps()} className='flex items-center w-full justify-center' href="/uploadChests">
                    <img src="https://api.iglee.fr/gif/nec" alt="" className='mr-2 w-12'></img>
                    Upload Chest Textures
                </a> : <></>}
                <a {...getItemProps()} className='flex items-center w-full justify-center' onClick={logout}>
                    <FaArrowRightFromBracket className='mr-2 rotate-180' />
                    Logout
                </a>
            </div>
        </button>
    )
}