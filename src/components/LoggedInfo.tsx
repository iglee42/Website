import useDropdownMenu from "react-accessible-dropdown-menu-hook";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { getUserAvatarUrl, hasPermission, isLogged } from "../Utils";
import { useUser } from "../UserProvider";

export const LoggedInfo = () => {
  const userProvider = useUser();
  
  const { user, loading } = userProvider;

  const menuItems = hasPermission(user, 3) ? 3 : (hasPermission(user, 2) ? 2 : 1);
  const { buttonProps, itemProps, isOpen } = useDropdownMenu(menuItems);
  

  // Tant que l'utilisateur n'est pas chargé, on ne fait rien (ou un loading state si tu veux)
  if (loading) {
    return (
      <span className="text-3xl flex navItem transi-all select-none text-gray-600 dark:text-gray-400">
        Loading...
      </span>
    );
  }

  if (!isLogged() || !user) {
    return (
      <span className="text-3xl flex navItem transi-all select-none text-gray-600 dark:text-gray-400">
        Logged
      </span>
    );
  }




  function fixEncoding(str: string): string {
    const bytes = new Uint8Array(Array.from(str).map((ch) => ch.charCodeAt(0)));
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(bytes);
  }

  const username = user?.username;
  const displayName = fixEncoding(user?.username);


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
        className={`${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          } absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 transition-opacity z-50`}
        style={{ bottom: "calc(-70px * " + menuItems + " - " + 10 * (menuItems - 1) + "px)" }}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="py-1">
          {hasPermission(user, 2) && (
            <a
              {...getItemProps()}
              href="/uploadChests"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-600 hover:text-white transition cursor-pointer"
              role="menuitem"
              tabIndex={-1}
            >
              <img
                src={process.env.REACT_APP_API_URL + "/gif/nec"}
                alt=""
                className="mr-3 w-12 rounded-sm object-contain"
              />
              Upload Chest Textures
            </a>
          )}
          {hasPermission(user, 3) && (
            <a
              {...getItemProps()}
              href="/adminPanel"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-600 hover:text-white transition cursor-pointer"
              role="menuitem"
              tabIndex={-1}
            >
              <img
                src="https://miro.medium.com/v2/resize:fit:1400/1*5Hnnv0awfSv0BGcq1C522w.png"
                alt=""
                className="mr-3 w-12 rounded-sm object-contain"
              />
              Admin Panel (In Dev)
            </a>
          )}

          <a
            {...getItemProps()}
            href="/logout"
            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-600 hover:text-white transition cursor-pointer"
            role="menuitem"
            tabIndex={-1}
          >
            <FaArrowRightFromBracket className="mr-3 rotate-180 w-12 text-3xl" />
            Logout
          </a>
        </div>
      </div>
    </div>
  );
};
