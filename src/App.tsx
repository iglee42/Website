import { Routes, Route, } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { Suggestions } from './pages/Suggestions';
import { Projects } from './pages/Projects';
import { NavBar } from './components/NavBar';
import { Rights } from './components/Rights';
//import { ModsInfos } from './ModsInfosRooter';
import { useGlobalState } from './Vars';

function App() {
  const isInfoError = useGlobalState("isInfoError")[0];
  const showInfo = useGlobalState("showInfo")[0];
  const info = useGlobalState('info')[0];
  return (
    <div className='container mt-10'>
      <header>
        <NavBar/>
      </header>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/suggestions' element={<Suggestions />} />
        <Route path='/projects' element={<Projects />} />
        {/*<Route path='/modsinfos/*' element={<ModsInfos />} />*/}
      </Routes>
      <div className='absolute left-0 z-50 w-full flex justify-center h-10 items-center transi-all' style={{ bottom: (showInfo ? '8px' : '-50px'), opacity: (showInfo ? 1 : 0) }}>
        <p className={[isInfoError ? 'bg-red-700' : 'bg-white', isInfoError ? 'text-white' : 'text-black', 'rounded-lg px-6 h-10 text-center lh-8'].join(' ')}>{info}</p>
      </div>
      <footer className='bottom-0 right-0 left-0 text-center border-t-2 border-t-black border-t-solid h-16 flex justify-center items-center'>
        <Rights />
      </footer>
    </div>
  );
}

export default App;
