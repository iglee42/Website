import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showError, showInfo } from "../Utils";

function OAuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const data = params.get("data");

        if (data && data !== null && data.length > 0) {
            try {
                const json = atob(data);
                const user = JSON.parse(json);
                localStorage.setItem("user", JSON.stringify(user));

                navigate("/");
                showInfo("Logged as " + user.username);
            } catch (err) {
                console.error("Erreur de décodage", err);
                navigate("/");
                showError("Decoding error");
            }
        } 
    }, [navigate]);

    return <p>Login...</p>;
}

export default OAuthCallback;
