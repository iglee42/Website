
import { NavLink } from 'react-router-dom';
import logo from '../images/logo.png';
import logoName from '../images/logo_name.png';
import curseforge from '../images/curseforge.svg';
import { FaLink, FaDownload, FaCode, FaDiscord, FaYoutube, FaGithub, FaPlay } from "react-icons/fa";
import '../css/navbar.css'
import { ReactElement } from 'react';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';


export const NavBar = () => {
    const { buttonProps, itemProps, isOpen } = useDropdownMenu(3);
    return (
        <nav className='flex justify-between items-center'>
            <NavItem to='/socials' activeColor='#f50000' text='Socials' component={<FaLink className=' mt-1 mr-2 opacity-0 icon' />} />
            <NavItem to='/projects' activeColor='#43d800' text='Projects' component={<FaDownload className=' mt-1 mr-2 opacity-0 icon' />} />
            <NavLink className='nav-logo' to='/'>
                <img src={logo} alt='Logo' className='z-10 size-24 normal-logo transi-all' />
                <img src={logoName} alt='Logo' className='fixed top-10 h-24 opacity-0 hover-logo transi-all' />
            </NavLink>
            <button {...buttonProps} className={['navItem flex text-3xl relative transi-all', (isOpen ? "rcs-color":"")].join(" ")}>
                <FaCode className={['mt-1 mr-2 opacity-0 icon ', (isOpen ? 'opacity-100' : '')].join(" ")} />
                Resources
                <FaPlay className={['mt-2.5 ml-2 opacity-0 icon text-xl transi-all', (isOpen ? 'rotate-90 opacity-100': '')].join(" ")} />
                <div className={[(isOpen ? '' : 'invisible'), 'absolute -left-8 -bottom-48 dropdown-content transi-all'].join(" ")} role='menu'>
                    <a {...itemProps[0]} className='flex items-center w-auto justify-center' href='https://www.youtube.com/channel/UCenQbpUwq9-eKKJc-S7j8Rw'>
                        <FaYoutube className='mr-2' />
                        Youtube (🇫🇷)
                    </a>
                    <a {...itemProps[1]} className='flex items-center w-full justify-center' href='https://git.iglee.fr'>
                        <FaGithub className='mr-2' />
                        Github
                    </a>
                    <a {...itemProps[2]} className='flex items-center w-full pointer-events-none justify-center' href='/modsinfo/index.html'>
                        <img src={curseforge} alt='Curseforge' className='mr-2' />
                        Mods Infos (WIP)
                    </a>
                </div>
            </button>


            <NavItem to='/contact' activeColor='#324bd8' text='Contact' component={<FaDiscord className=' mt-1 mr-2 opacity-0 icon' />} />

        </nav>
    )
}


function NavItem({ to, activeColor, text, component }: { to: string, activeColor: string, text: string, component: ReactElement }) {
    return (
        <NavLink className={({ isActive, isPending, isTransitioning }) => [
            "text-3xl",
            "flex",
            "navItem", 
            "transi-all",
            isActive ? "active" : ""
        ].join(" ")} to={to} style={({ isActive }) => ({ color: isActive ? activeColor : "#000000" })}> {component} {text}</NavLink>
    )
}