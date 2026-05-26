import {useEffect, useState} from "react";
import '../style/History.css';

function History({ setPage }) {
    const [answers, setAnswers] = useState([]);
    const [minScore, setMinScore] = useState("");
    const [sort, setSort] = useState("");
    const [ error, setError ] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const token = localStorage.getItem("token");

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    }

    const fetchAnswers = async () => {
        try {
            let url = `${import.meta.env.VITE_API_BASE_URL}/answers?`;
            if(minScore)url+=`min_score=${minScore}&`;
            if(sort)url+=`sort=${sort}`;

            const res = await fetch(url, {
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
            setAnswers(data);
        } catch (err) {
            setError("Failed to fetch history. Please try again later.");
        }
    };

    useEffect(() => {
        fetchAnswers();
    }, [minScore, sort]);

    return (
        <div className = "container">
            <h2> Your History</h2>
            <div style = {{marginBottom: "20px"}}>
                <input
                    type="number"
                    placeholder="Min Score"
                    value={minScore}
                    onChange={(e) => setMinScore(e.target.value)}
                    style={{ marginRight: "10px" }}
                />
            <select onChange={(e)=> setSort(e.target.value)}>
                <option value="">Sort By</option>
                <option value = "asc">Oldest</option>
                <option value = "desc">Newest</option>
            </select>
            <button onClick={fetchAnswers} style={{ marginLeft: "10px" }}>Apply</button>
            </div>
            {error && <p style={{color: "red"}}>{error}</p>}
            {answers.length === 0 ? (
                <p>No history found.</p>
            ) : (
                answers.map((ans) => (
                    <div key  ={ans.id} className="history-card">
                    <h3>{ans.question}</h3>
                    <p><strong>Score:</strong> {ans.score}/10</p>
                    <p>
                        <strong>Answer:</strong>{" "}
                        {ans.answer_text.length > 80
                        ? ans.answer_text.slice(0,80) + "..."
                        : ans.answer_text}
                    </p>

                    
                    {expandedId === ans.id && (
                        <div style={{marginTop: "10px"}}>
                            <p><strong>Full Answer:</strong> {ans.answer_text}</p>
                            <p><strong>Feedback:</strong> {ans.feedback || "No feedback provided."}</p>

                            <p><strong>Thinking Time:</strong>{ans.time_to_start}s</p>
                            <p><strong>Answer Time:</strong>{ans.time_to_answer}s</p>
                            <p><strong>Total Time:</strong>{ans.total_time}s</p>
                            <p className={ans.score >= 7 ? "score-good" : "score-bad"}>
                                Score: {ans.score}/10
                            </p>
                        </div>
                    )}
                    <button onClick={()=>toggleExpand(ans.id)}>
                        {expandedId === ans.id ? "Hide details" : "View details"}
                    </button>
                </div>
                ))
            )}
            <button onClick={()=>setPage("home")} style={{marginTop: "20px"}}>Back</button>
            </div>
        
    );
}

export default History;