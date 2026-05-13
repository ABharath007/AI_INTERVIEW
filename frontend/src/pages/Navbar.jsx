import '../style/Navbar.css';

function Navbar({setPage, onLogout}){
    return (
        <div className="navbar">
            <div className = "nav-left">
            <p className="logo">AI INTERVIEW COACH</p>
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