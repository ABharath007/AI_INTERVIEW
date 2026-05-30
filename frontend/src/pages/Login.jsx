import { useState} from "react";
import '../style/Login_Register.css';
import logo from "../assets/logo.png";
import { GoogleLogin } from "@react-oauth/google";

function Login({ onLogin, onSwitch }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const handleLogin = async () =>{
        try{
            setError(null);
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            if(!res.ok){
                throw new Error("Invalid email or password.");
            }
            const data = await res.json();

            localStorage.setItem("token", data.access_token);
            localStorage.setItem("username", data.username);
            onLogin();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/google-login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: credentialResponse.credential }),
        });
        const data = await res.json();

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", data.username);
        onLogin();
    }

    return (
        <div className="auth-page">
            <img src={logo} alt="InterviAI" className="page-logo" />
        
        <form className = "login-card"
        onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
        }}>
            <button type="button" className="back-btn"
            onClick={() => onSwitch("LandingPage")}>
                ← Back
            </button>
            <h2>Login</h2>
            <input
                placeholder = "Email"
                value = {email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
            />
            <div className="password-box">
            <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            />

            <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            >
            {showPassword ? "Hide" : "Show"}
            </span>
            </div>
            <button type ="submit">Login</button>
            {error && <p className = "error">{error}</p>}
            <p className="auth-switch">
      Don't have an account?
      <span onClick={() => onSwitch("Register")}> Register</span>
    </p>
    <GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={() => console.log("Google Login Failed")}
/>
            
        </form>
        </div>
    );
}
export default Login;