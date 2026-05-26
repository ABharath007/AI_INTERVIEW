import { useEffect, useState } from "react";
import '../style/Analysis.css';

function Analysis() {
    const [analysis, setAnalysis] = useState();
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");
    

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/analysis`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.status === 401) {
                    localStorage.clear();
                    window.location.reload();
                    return;
                }
                const data = await res.json();
                setAnalysis(data);
            } catch (err) {
                setError("Failed to fetch analysis. Please try again later.");
            }
        };
        fetchAnalysis();
    }, []);

    return (
        <div className = "container">
            <h2> Performance Analysis </h2>
            {error && <p style={{color: "red"}}>{error}</p>}
            
                {!analysis ? (  
                    <p>Loading analysis...</p>
                ) : (
        <>  
        <div className="analysis-card">
        <h3>Stats</h3>
        <div className="stats">
        <div className = "stat-box"> <p>Total Questions: {analysis.total_questions}</p></div>
        <div className = "stat-box"> <p>Average Score: {analysis.average_score}</p></div>
        <div className = "stat-box"> <p>Best Score: {analysis.best_score}</p></div>
        </div>
        
        <div className = "card">
            <h3> Weak Areas </h3>
            {analysis.weak_areas.length === 0 ? (
                <p>No weak areas identified. Great job!</p>
            ) : (
                <ul>
                    {analysis.weak_areas.map((item,i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
                )}
        </div>
        
        <div className = "card">
            <h3> Strong Areas </h3>
            {analysis.strong_areas.length === 0 ? (
                <p>No strong areas identified.</p>
            ) : (
                <ul>
                    {analysis.strong_areas.map((item,i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            )}
        </div>
        </div>
        </>
        
    )}
    
    </div>
    );
}

export default Analysis;
