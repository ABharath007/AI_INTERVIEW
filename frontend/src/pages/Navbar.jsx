import '../style/Navbar.css';
import logo from '../assets/logo.png';

function Navbar({setPage, onLogout}){
    return (
        <div className="navbar">
            <div className="brand">
            <img src={logo} alt="InterviAI Logo" className="logo" />
            </div>
            <div className = "nav-right">
            <button onClick={() => setPage("home")}>Home</button>
            <button onClick={() => setPage("history")}>History</button>
            <button onClick={() => setPage("analysis")}>Analysis</button>
            <button onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
}
export default Navbar;