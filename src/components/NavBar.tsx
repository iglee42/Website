
import { Link, NavLink } from 'react-router-dom';
import logo from '../images/logo.png';
import logoName from '../images/logo_name.png';
import curseforge from '../images/curseforge.svg';
import { FaDownload, FaCode, FaYoutube, FaGithub, FaPlay, FaLightbulb } from "react-icons/fa";
import { FaArrowRightToBracket } from 'react-icons/fa6'
import '../css/navbar.css'
import { ReactElement } from 'react';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';
import { LoggedInfo } from './LoggedInfo';
import { getUser, hasUserPermission, isLogged } from '../Utils';


export const NavBar = () => {
    const { buttonProps, itemProps, isOpen } = useDropdownMenu(3);
    return (
        <nav className='flex justify-between items-center mb-24'>
            <NavItem to='/suggestions' text='Suggestions' component={<FaLightbulb className=' mt-1 mr-2 opacity-0 transi-opa group-[.active]:opacity-100 group-hover:opacity-100' />} />
            <NavItem to='/projects' text='Projects' component={<FaDownload className=' mt-1 mr-2 opacity-0 transi-opa group-[.active]:opacity-100 group-hover:opacity-100' />} />
            <NavLink className='nav-logo' to='/'>
                <img src={logo} alt='Logo' className='fixed top-8 z-40 size-24 normal-logo transi-all' />
                <img src={logoName} alt='Logo' className='fixed top-8 z-30 h-24 opacity-0 hover-logo transi-all' />
            </NavLink>
            <button {...buttonProps} className={['navItem flex text-3xl dark:text-white relative transi-all group', (isOpen ? "rcs-color":"")].join(" ")}>
                <FaCode className={['mt-1 mr-2 opacity-0 group-[.active]:opacity-100 group-hover:opacity-100 transi-opa', (isOpen ? 'opacity-100' : '')].join(" ")} />
                Resources
                <FaPlay className={['mt-3.5 size-3 ml-2 opacity-0 group-[.active]:opacity-100 group-hover:opacity-100 text-xl transi-all', (isOpen ? 'rotate-90 opacity-100': '')].join(" ")} />
                <div className={[(isOpen ? '' : 'opacity-0'), 'absolute -left-8 -bottom-48 bg-gray-50 dark:bg-gray-800 min-w-64 shadow-xl shadow-[#0003] z-10 transi-all'].join(" ")} role='menu'>
                    <a {...itemProps[0]} className='flex items-center w-auto justify-center  text-black dark:text-white px-3 py-3 text-2xl hover:bg-gray-300 dark:hover:bg-gray-700' href='https://youtube.iglee.fr'>
                        <FaYoutube className='mr-2' />
                        Youtube (🇫🇷)
                    </a>
                    <a {...itemProps[1]} className='flex items-center w-full justify-center  text-black dark:text-white px-3 py-3 text-2xl hover:bg-gray-300 dark:hover:bg-gray-700' href='https://git.iglee.fr'>
                        <FaGithub className='mr-2' />
                        Github
                    </a>
                    <Link {...itemProps[2]} className='flex items-center w-full justify-center text-black dark:text-white px-3 py-3 text-2xl hover:bg-gray-300 dark:hover:bg-gray-700' to={ process.env.NODE_ENV === "production" && !hasUserPermission(3) ? "/" : "/modsinfos"}> 
                        <img src={curseforge} alt='Curseforge' className='mr-2' />
                        Mods Infos (WIP)
                    </Link>
                </div>
            </button>


            {/*<NavItem to='https://discord.iglee.fr' text='Contact' component={<FaDiscord className=' mt-1 mr-2 icon' />} />*/}

            {!isLogged() ?
                <NavItem to={'https://api.iglee.fr/login'} text="Login" component={<FaArrowRightToBracket className=' mt-1 mr-2 opacity-0 transi-opa group-[.active]:opacity-100 group-hover:opacity-100' />}/>
                : <LoggedInfo/>
            }

        </nav>
    )
}


function NavItem({ to, text, component }: { to: string, text: string, component: ReactElement }) {
    return (
        <NavLink className={({ isActive, isPending, isTransitioning }) => [
            "text-3xl",
            "flex",
            "navItem", 
            "group",
            "dark:text-white",
            "transi-all",
            isActive ? "active" : "",
            text === "Contact" ? "contact" : ""
        ].join(" ")} to={to}> {component} {text}</NavLink>
    )
}