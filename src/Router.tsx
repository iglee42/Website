import { Navigate, Route, Routes } from "react-router-dom";
import OAuthCallback from './pages/utils/OAuthCallback';
import { ModsInfosRouter } from './ModsInfosRouter';
import { hasPermission, isLogged } from './Utils';
import { UploadChests } from './pages/UploadChests';
import { Redirect } from './components/Redirect';
import { Home } from './pages/Home';
import { Suggestions } from './pages/Suggestions';
import { Projects } from './pages/Projects';
import Logout from "./pages/utils/Logout";
import { AdminPanel } from "./pages/utils/AdminPanel";
import { useUser } from "./UserProvider";
import { FaSpinner } from "react-icons/fa";
import { Legal } from "./pages/utils/Legal";
import { Contests } from "./pages/contests/Contests";
import { ContestPage } from "./pages/contests/Contest";
import FailedLogin from "./pages/utils/FailedLogin";
import NotFound from "./pages/utils/404";

export function Router() {
    const { user, loading } = useUser();
    const logged = isLogged();

    // Si on charge et qu'on n'a pas de user
    if (loading && !user) {
        return (
            <div className="flex justify-center items-center h-40 text-gray-600 dark:text-gray-400">
                <FaSpinner className="animate-spin mr-2" />
                <span>Loading…</span>
            </div>
        );
    }

    // Si on est censé être connecté mais user absent → log out / message
    if (!loading && logged && !user) {
        return (
            <div className="flex justify-center items-center h-40 text-gray-600 dark:text-gray-400">
                <FaSpinner className="animate-spin mr-2" />
                <span>Loading…</span>
            </div>
        );
    }

    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/suggestions' element={<Suggestions />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/oauth-callback' element={<OAuthCallback />} />
            <Route path='/modsinfos/*' element={process.env.NODE_ENV !== "production" && hasPermission(user, 3) ? <ModsInfosRouter /> : <Navigate to='/' />} />
            <Route path='/uploadChests' element={hasPermission(user, 2) ? <UploadChests /> : <Navigate to='/' replace />} />
            <Route path='/phpmyadmin' element={hasPermission(user, 3) ? <Redirect href="https://api.iglee.fr/phpmyadmin" /> : <Navigate to='/' />} />
            <Route path='/adminPanel' element={hasPermission(user, 3) ? <AdminPanel /> : <p>{hasPermission(user, 3)}</p>} />
            <Route path='/logout' element={isLogged() ? <Logout /> : <Navigate to='/' />} />
            <Route path='/contests' element={<Contests />} />
            <Route path='/contest/*' element={<ContestPage />} />
            <Route path="/legals" element={<Legal />} />
            <Route path="/failed-login" element={<FailedLogin />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}