import { useState} from "react";
import '../style/Login_Register.css';
import logo from "../assets/logo.png";

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

            localStorage.setItem("user_id", data.user_id);
            onLogin();
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <div className="auth-page">
            <img src={logo} alt="InterviAI" className="page-logo" />
        <div className = "login-card">
            
            <h2>Login</h2>
            <input
                placeholder = "Email"
                value = {email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-box">
            <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            />

            <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            >
            {showPassword ? "Hide" : "Show"}
            </span>
            </div>
            <button onClick={handleLogin}>Login</button>
            {error && <p className = "error">{error}</p>}
            <p className="auth-switch">
      Don't have an account?
      <span onClick={() => onSwitch("register")}> Register</span>
    </p>
            
        </div>
        </div>
    );
}
export default Login;