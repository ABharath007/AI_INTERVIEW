import '../style/Navbar.css';
import logo from '../assets/logo.png';

function Navbar({setPage, onLogout, page}) {
    return (
        <div className="navbar">
            <div className="brand">
            <img src={logo} alt="InterviAI Logo" className="logo" />
            </div>
            <div className = "nav-right">
            <button onClick={() => setPage("home")} className={page === "home" ? "active" : ""}>
                Home
            </button>
            <button onClick={() => setPage("history")} className={page === "history" ? "active" : ""}>
                History
            </button>
            <button onClick={() => setPage("analysis")} className={page === "analysis" ? "active" : ""}>
                Analysis
            </button>
            <button onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
}
export default Navbar;