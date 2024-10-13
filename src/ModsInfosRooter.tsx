import { Routes, Route } from 'react-router-dom';
import { HomeModsInfos } from './pages/modsinfos/Home';


export function ModsInfos() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<HomeModsInfos/>} />
            </Routes>
        </div>
    );
}
