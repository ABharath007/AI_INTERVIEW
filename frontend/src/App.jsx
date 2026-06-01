import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import History from "./pages/History";
import Analysis from "./pages/Analysis";
import LandingPage from "./pages/LandingPage";
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("token") !== null
  );

  const [authPage, setAuthPage] = useState("LandingPage"); // login | register
  const [page, setPage] = useState("home"); // home | history
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("session_id");
    setLoggedIn(false);
    setAuthPage("LandingPage");
    setPage("home");
  };

 if (!loggedIn) {

  if (authPage === "LandingPage") {
    return (
      <LandingPage
        onLogin={() => setAuthPage("Login")}
        onRegister={() => setAuthPage("Register")}
      />
    );
  }

  if (authPage === "Login") {
    return (
      <Login
        onLogin={() => setLoggedIn(true)}
        onSwitch={setAuthPage}
      />
    );
  }

  return (
    <Register
      onRegisterSuccess={() => setAuthPage("Login")}
      onSwitch={setAuthPage}
    />
  );
}
return (
  <div className = "main-wrapper">
    <Navbar setPage={setPage} onLogout={handleLogout} page={page} />
    <div className = "container">
    {page==="home" && <Home/>}
    {page==="history" && <History  setPage={setPage}/>}
    {page==="analysis" && <Analysis/>}
  </div>
  </div>
);
}

export default App;