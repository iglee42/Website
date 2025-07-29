import { Link, NavLink } from "react-router-dom";
import logo from "../images/logo.png";
import logoName from "../images/logo_name.png";
import curseforge from "../images/curseforge.svg";
import {
  FaDownload,
  FaCode,
  FaYoutube,
  FaGithub,
  FaPlay,
  FaLightbulb,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";
import { LoggedInfo } from "./LoggedInfo";
import { hasUserPermission, isLogged } from "../Utils";
import clsx from "clsx";

export const NavBar = () => {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        resourcesRef.current &&
        !resourcesRef.current.contains(event.target as Node)
      ) {
        setResourcesOpen(false);
      }
      
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.mobile-menu-button')
      ) {
        setMobileMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  return (
    <nav className="top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Menu gauche - version desktop */}
        <div className="hidden md:flex space-x-8">
          <CustomNavLink to="/suggestions" icon={<FaLightbulb />}>
            Suggestions
          </CustomNavLink>
          <CustomNavLink to="/projects" icon={<FaDownload />}>
            Projects
          </CustomNavLink>
        </div>

        {/* Bouton burger - version mobile */}
        <button
          className="mobile-menu-button md:hidden text-gray-800 dark:text-gray-200 mr-4"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Logo centré */}
        <Link 
          to="/" 
          className="relative items-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2 group"
        >
          <img
            src={logo}
            alt="Logo"
            className="absolute h-10 w-10 object-contain translate-x-[calc(50%+1.125rem)] transition-all duration-200 group-hover:opacity-0 group-hover:translate-x-0"
          />
          <img
            src={logoName}
            alt="Logo name"
            className="sm:block opacity-0 h-10 -z-10 object-contain transition-all duration-[450ms] delay-[100ms] group-hover:opacity-100"
          />
        </Link>

        {/* Menu droit */}
        <div className="flex items-center space-x-6">
          {/* Dropdown Resources */}
          <div className="relative" ref={resourcesRef}>
            <button
              onClick={() => setResourcesOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={resourcesOpen}
              className={clsx(
                "flex items-center space-x-2 text-gray-800 dark:text-gray-200 font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
                resourcesOpen && "text-blue-600 dark:text-blue-400"
              )}
            >
              <FaCode className="text-lg" />
              <span className="hidden sm:inline">Resources</span>
              <FaPlay
                className={clsx(
                  "transform transition-transform duration-200 hidden sm:inline",
                  resourcesOpen ? "rotate-90" : ""
                )}
              />
            </button>
            {resourcesOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
              >
                <a
                  href="https://youtube.iglee.fr"
                  role="menuitem"
                  className="flex items-center px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaYoutube className="mr-2" />
                  Youtube (🇫🇷)
                </a>
                <a
                  href="https://git.iglee.fr"
                  role="menuitem"
                  className="flex items-center px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaGithub className="mr-2" />
                  Github
                </a>
                <Link
                  to={
                    process.env.NODE_ENV === "production" &&
                    !hasUserPermission(3)
                      ? "/"
                      : "/modsinfos"
                  }
                  role="menuitem"
                  className="flex items-center px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <img
                    src={curseforge}
                    alt="Curseforge"
                    className="mr-2 h-5 w-5 object-contain"
                  />
                  Mods Infos (WIP)
                </Link>
              </div>
            )}
          </div>

          {/* Login / User info */}
          {!isLogged() ? (
            <a
              href={"https://api.iglee.fr/login" +( process.env.NODE_ENV !== "production" ? "?dev=true" : "")}
              className="flex items-center space-x-1 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold"
            >
              <FaArrowRightToBracket />
              <span className="hidden sm:inline">Login</span>
            </a>
          ) : (
              <LoggedInfo />
          )}
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-16 overflow-y-auto"
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-6">
              <MobileNavLink to="/suggestions" icon={<FaLightbulb />} onClick={() => setMobileMenuOpen(false)}>
                Suggestions
              </MobileNavLink>
              
              <MobileNavLink to="/projects" icon={<FaDownload />} onClick={() => setMobileMenuOpen(false)}>
                Projects
              </MobileNavLink>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-2">
                  Resources
                </h3>
                
                <a
                  href="https://youtube.iglee.fr"
                  className="flex items-center py-3 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaYoutube className="mr-3" />
                  Youtube (🇫🇷)
                </a>
                
                <a
                  href="https://git.iglee.fr"
                  className="flex items-center py-3 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaGithub className="mr-3" />
                  Github
                </a>
                
                <Link
                  to={
                    process.env.NODE_ENV === "production" &&
                    !hasUserPermission(3)
                      ? "/"
                      : "/modsinfos"
                  }
                  className="flex items-center py-3 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <img
                    src={curseforge}
                    alt="Curseforge"
                    className="mr-3 h-5 w-5 object-contain"
                  />
                  Mods Infos (WIP)
                </Link>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {!isLogged() ? (
                  <a
                    href="https://api.iglee.fr/login"
                    className="flex items-center py-3 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaArrowRightToBracket className="mr-3" />
                    Login
                  </a>
                ) : (
                  <div className="py-3">
                    <LoggedInfo />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

function CustomNavLink({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactElement;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "flex items-center space-x-2 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-lg",
          isActive &&
            "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
        )
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
}

function MobileNavLink({
  to,
  icon,
  children,
  onClick,
}: {
  to: string;
  icon: React.ReactElement;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "flex items-center py-3 text-xl font-medium border-l-4 pl-4",
          isActive
            ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
            : "text-gray-800 dark:text-gray-200 border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
        )
      }
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </NavLink>
  );
}