import { useState } from "react";
import '../style/Login_Register.css';
import logo from "../assets/logo.png";

function Register({ onRegisterSuccess, onSwitch }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password })
    });
    if (!res.ok) {
  alert("Registration failed");
  return;
}

alert("Registered successfully");
    setUsername("");
    setEmail("");
    setPassword("");

    onRegisterSuccess();
  };

  return (
    <div className="auth-page">
      <img src={logo} alt="InterviAI" className="page-logo" />
    <div className="login-card">
      
      <h2>Register</h2>

       <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" />
      <input value={email} onChange={(e)=>setEmail(e.target.value) } placeholder="Email" autoComplete="email" />
      <div className="password-box">
            <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="new-password"
            />

            <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            >
            {showPassword ? "Hide" : "Show"}
            </span>
            </div>

      <button onClick={handleRegister}>
        Register
      </button>
      <p className="auth-switch">
  Already have an account?
  <span onClick={() => onSwitch("login")}> Login</span>
</p>
    </div>
    </div>
  );
}

export default Register;