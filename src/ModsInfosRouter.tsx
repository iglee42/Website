import { Routes, Route } from 'react-router-dom';
import { HomeModsInfos } from './pages/modsinfos/Home';


export function ModsInfosRouter() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<HomeModsInfos />} />
            </Routes>
        </div>
    );
}
