import { Navigate, Route, Routes } from "react-router-dom";
import OAuthCallback from './pages/utils/OAuthCallback';
import { ModsInfosRouter } from './ModsInfosRouter';
import { hasUserPermission, isLogged } from './Utils';
import { UploadChests } from './pages/UploadChests';
import { Redirect } from './components/Redirect';
import { Home } from './pages/Home';
import { Suggestions } from './pages/Suggestions';
import { Projects } from './pages/Projects';
import Logout from "./pages/utils/Logout";
import { AdminPanel } from "./pages/utils/AdminPanel";

export function Router() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/suggestions' element={<Suggestions />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/oauth-callback' element={<OAuthCallback />} />
            <Route path='/modsinfos/*' element={process.env.NODE_ENV !== "production" && hasUserPermission(3) ? <ModsInfosRouter /> : <Navigate to='/' replace />} />
            <Route path='/uploadChests' element={hasUserPermission(2) ? <UploadChests /> : <Navigate to='/' replace />} />
            <Route path='/phpmyadmin' element={hasUserPermission(3) ? <Redirect href="https://api.iglee.fr/phpmyadmin" /> : <Navigate to='/' replace />} />
            <Route path='/adminPanel' element={hasUserPermission(3) ? <AdminPanel /> : <Navigate to='/' replace />} />
            <Route path='/logout' element={isLogged() ? <Logout /> : <Navigate to='/' replace />} />
        </Routes>
    )
}