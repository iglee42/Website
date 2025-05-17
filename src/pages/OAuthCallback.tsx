import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showError } from "../Utils";

function OAuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const data = params.get("data");

        if (data) {
            try {
                const json = atob(data); // base64 decode
                const user = JSON.parse(json);
                localStorage.setItem("user", JSON.stringify(user));

                // Redirige vers l'accueil ou un dashboard
                navigate("/");
            } catch (err) {
                console.error("Erreur de décodage", err);
                navigate("/");
                showError("Decoding error");
            }
        } else {
            showError("Invalide Data");
        }
    }, [navigate]);

    return <p>Login...</p>;
}

export default OAuthCallback;
