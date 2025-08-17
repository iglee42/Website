import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showInfo } from "../../Utils";
import { useUser } from "../../UserProvider";

function Logout() {
    const navigate = useNavigate();
    const userProvider = useUser();

    useEffect(() => {
        userProvider.logout();
        showInfo("You have been logged out successfully.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    return <p>Logout...</p>;
}

export default Logout;
