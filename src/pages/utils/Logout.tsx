import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showInfo } from "../../Utils";
import { setGlobalState } from "../../Vars";
import { useUser } from "../../UserProvider";

function Logout() {
    const navigate = useNavigate();
    const userProvider = useUser();

    useEffect(() => {
        userProvider.logout();
        showInfo("You have been logged out successfully.");
    }, [navigate]);

    return <p>Logout...</p>;
}

export default Logout;
