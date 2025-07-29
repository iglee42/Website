import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logUser, showError, showInfo } from "../../Utils";
import { useUser } from "../../UserProvider";

function OAuthCallback() {
    const navigate = useNavigate();
    const userProvider = useUser();

    useEffect(() => {
        async function handleOAuthCallback() {
            const params = new URLSearchParams(window.location.search);
            const data = params.get("token");
            if (data && data.length > 0) {

                try {
                    const token = data
                    localStorage.setItem("authToken", token);

                    await userProvider.reloadUser();
                    navigate("/");
                    showInfo("Logged as "+userProvider.user?.username);
                } catch (err) {
                    showError("Token Error");
                    navigate("/");
                }
            }
        }
        handleOAuthCallback();
    }, [navigate]);

    return <p>Login...</p>;
}

export default OAuthCallback;
