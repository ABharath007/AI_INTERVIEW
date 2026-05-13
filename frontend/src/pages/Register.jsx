import { useState } from "react";
import '../style/Login_Register.css';

function Register({ onRegisterSuccess, onSwitch }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <div className="login-card">
      <h2>Register</h2>

       <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" />
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />

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