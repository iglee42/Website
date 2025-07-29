import useDropdownMenu from "react-accessible-dropdown-menu-hook";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { Navigate } from "react-router-dom";
import { getUser, getUserAvatarUrl, hasUserPermission, isLogged } from "../Utils";

export const LoggedInfo = () => {
  const menuItems = hasUserPermission(2) ? 2 : 1;
  const { buttonProps, itemProps, isOpen } = useDropdownMenu(menuItems);

  if (!isLogged()) {
    return (
      <span className="text-3xl flex navItem transi-all select-none text-gray-600 dark:text-gray-400">
        Logged
      </span>
    );
  }

  const user = getUser();
  if (!user) return <Navigate to="/" />;

  function fixEncoding(str: string): string {
    const bytes = new Uint8Array(Array.from(str).map((ch) => ch.charCodeAt(0)));
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(bytes);
  }

  const username = user.username;
  const displayName = fixEncoding(user.global_name);

  const logout = async () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  let currentProps = 0;
  function getItemProps() {
    return itemProps[currentProps++];
  }

  return (
    <div className="relative inline-block text-left">
      <button
        {...buttonProps}
        className={`navItem flex items-center text-2xl rounded-lg px-3 py-1 bg-white dark:bg-gray-800 shadow-sm border border-gray-300 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      >
        <img
          src={getUserAvatarUrl(user)}
          alt={username}
          className="rounded-full w-10 h-10 mr-3 object-cover"
        />
        <span className="select-none text-gray-900 dark:text-gray-100">{displayName}</span>
      </button>

      {/* Dropdown menu */}
      <div
        className={`${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 transition-opacity z-50`}
        style={{ bottom: "calc(-70px * " + menuItems + " - " + 10 * (menuItems - 1) + "px)" }}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="py-1">
          {hasUserPermission(2) && (
            <a
              {...getItemProps()}
              href="/uploadChests"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-600 hover:text-white transition cursor-pointer"
              role="menuitem"
              tabIndex={-1}
            >
              <img
                src="https://api.iglee.fr/gif/nec"
                alt=""
                className="mr-3 w-12 rounded-sm object-contain"
              />
              Upload Chest Textures
            </a>
          )}

          <a
            {...getItemProps()}
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
            href="#"
            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-600 hover:text-white transition cursor-pointer"
            role="menuitem"
            tabIndex={-1}
          >
            <FaArrowRightFromBracket className="mr-3 rotate-180" />
            Logout
          </a>
        </div>
      </div>
    </div>
  );
};
