import { Routes, Route, } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { Suggestions } from './pages/Suggestions';
import { Projects } from './pages/Projects';
import { NavBar } from './components/NavBar';
import { Rights } from './components/Rights';
import { ModsInfos } from './ModsInfosRooter';

function App() {
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
      <footer className='bottom-0 right-0 left-0 text-center border-t-2 border-t-black border-t-solid h-16 flex justify-center items-center'>
        <Rights />
      </footer>
    </div>
  );
}

export default App;
