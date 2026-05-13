import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import History from "./pages/History";
import Analysis from "./pages/Analysis";
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("user_id") !== null
  );

  const [authPage, setAuthPage] = useState("login"); // login | register
  const [page, setPage] = useState("home"); // home | history
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setLoggedIn(false);
    setAuthPage("login");
    setPage("home");
  };

 if (!loggedIn) {
  return authPage === "login" ? (
    <Login 
      onLogin={() => setLoggedIn(true)} 
      onSwitch={setAuthPage}
    />
  ) : (
    <Register 
      onRegisterSuccess={() => setAuthPage("login")} 
      onSwitch={setAuthPage}
    />
  );
}
return (
  <div className = "main-wrapper">
    <Navbar setPage={setPage} onLogout={handleLogout} />
    <div className = "container">
    {page==="home" && <Home/>}
    {page==="history" && <History  setPage={setPage}/>}
    {page==="analysis" && <Analysis/>}
  </div>
  </div>
);
}

export default App;