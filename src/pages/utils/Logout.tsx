import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showInfo } from "../../Utils";

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("user");
        navigate("/");
        showInfo("You have been logged out successfully.");
    }, [navigate]);

    return <p>Logout...</p>;
}

export default Logout;
