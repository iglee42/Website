import { useNavigate } from "react-router-dom";
import { showError } from "../../Utils";

function FailedLogin() {
    const navigate = useNavigate();
    showError("Login failed");
    navigate("/");
    return null;
}

export default FailedLogin;
