import { Routes, Route, Navigate, } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { Suggestions } from './pages/Suggestions';
import { Projects } from './pages/Projects';
import { NavBar } from './components/NavBar';
import { Rights } from './components/Rights';
//import { ModsInfos } from './ModsInfosRooter';
import { useGlobalState } from './Vars';
import OAuthCallback from './pages/OAuthCallback';
import { ModsInfos } from './ModsInfosRooter';
import { hasUserPermission } from './Utils';
import { UploadChests } from './pages/UploadChests';
import { Redirect } from './components/Redirect';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useEffect, useState } from 'react';

function App() {
  const isInfoError = useGlobalState("isInfoError")[0];
  const showInfo = useGlobalState("showInfo")[0];
  const info = useGlobalState('info')[0];
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return saved === "true";
    let dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    localStorage.setItem("darkMode", dark.toString());
    return dark;
  });

  useEffect(() => {
    const root = document.querySelector('body');
    if (isDarkMode) {
      root?.classList.add("dark");
    } else {
      root?.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    localStorage.setItem("darkMode", newValue.toString());
  };


  return (
    <div className='dark:bg-black bg-white w-screen min-h-screen'>
    <div className='container mt-10 mx-auto w-full max-w-full px-20'>
      <header>
        <NavBar/>
      </header>
      {<div
        className="fixed z-50 bottom-6 right-6 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
        onClick={toggleDarkMode}
        title="Toggle Dark Mode"
      >
        {
          isDarkMode
            ? <FaSun className="text-yellow-400 w-6 h-6 transition-colors duration-300" />
            : <FaMoon className="text-gray-700 dark:text-white w-6 h-6 transition-colors duration-300" />
        }
        </div>
        }
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/suggestions' element={<Suggestions />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/oauth-callback' element={<OAuthCallback />} />
        <Route path='/modsinfos/*' element={process.env.NODE_ENV !== "production" && hasUserPermission(3) ?<ModsInfos /> : <Navigate to='/' replace />}/>
        <Route path='/uploadChests' element={hasUserPermission(2) ? <UploadChests /> : <Navigate to='/' replace />} /> 
        <Route path='/phpmyadmin' element={<Redirect href="https://api.iglee.fr/phpmyadmin"/>}  />
      </Routes>
      <div className='fixed left-0 z-50 w-full flex justify-center h-10 items-center transi-all' style={{ bottom: (showInfo ? '32px' : '-50px'), opacity: (showInfo ? 1 : 0) }}>
        <p className={[isInfoError ? 'bg-red-700' : 'bg-gray-200', isInfoError ? 'text-white' : 'text-black', 'shadow-xl rounded-lg px-6 mx-auto h-10 text-center max-w-fit lh-8'].join(' ')}>{info}</p>
      </div>
      <footer className='bottom-0 right-0 left-0 text-center border-t-2 border-t-black dark:border-t-white border-t-solid h-16 flex justify-center items-center'>
        <Rights />
      </footer>
      </div>
    </div>
  );
}

export default App;
