import {useEffect, useState} from "react";
import '../style/History.css';

function History({ setPage }) {
    const [answers, setAnswers] = useState([]);
    const [minScore, setMinScore] = useState("");
    const [sort, setSort] = useState("");
    const [ error, setError ] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [expandedFollowupId, setExpandedFollowupId] = useState(null);
    const token = localStorage.getItem("token");
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState("");

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    }

    const toggleFollowupExpand = (id) => {
        setExpandedFollowupId(expandedFollowupId === id ? null : id);
    }
    const fetchSessions = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/sessions`,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await res.json();
  setSessions(data);
};

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
        fetchSessions();
    }, [minScore, sort]);

    return (
  <div className="container">

    <h2>Your History</h2>

    <div style={{ marginBottom: "20px" }}>
<select
  value={selectedSession}
  onChange={(e)=>setSelectedSession(e.target.value)}
>
  <option value="">All Sessions</option>

  {sessions.map((s)=>(
    <option key={s.id} value={s.id}>
  #{s.id} | {s.mode} | {s.topic || "General"}
</option>
  ))}
</select>
      <input
        type="number"
        placeholder="Min Score"
        value={minScore}
        onChange={(e) => setMinScore(e.target.value)}
        style={{ marginRight: "10px" }}
      />

      <select onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort By</option>
        <option value="asc">Oldest</option>
        <option value="desc">Newest</option>
      </select>

      <button
        onClick={fetchAnswers}
        style={{ marginLeft: "10px" }}
      >
        Apply
      </button>

    </div>

    {error && <p style={{ color: "red" }}>{error}</p>}

    {(() => {
  const filteredAnswers = answers
    .filter((ans) => !ans.is_followup)
    .filter(
      (ans) =>
        !selectedSession ||
        ans.session_id === Number(selectedSession)
    );

  if (answers.length === 0) {
  return (
    <div className="empty-history">
      <h3>No Interview History Yet</h3>
      <p>
        Start your first interview session to see your history here.
      </p>
    </div>
  );
}

if (filteredAnswers.length === 0) {
  return (
    <div className="empty-history">
      <h3>No questions answered in this session</h3>
      <p>
        This session was started but no answers were submitted.
      </p>
    </div>
  );
}

  return filteredAnswers.map((ans) => {
          const followups = answers.filter(
            (a) => a.parent_question_id === ans.id
          );

          return (
            <div key={ans.id} className="history-card">

              <h3>{ans.question}</h3>

              <p><strong>Score:</strong> {ans.score}/10</p>

              <p>
                <strong>Answer:</strong>{" "}
                {ans.answer_text.length > 80
                  ? ans.answer_text.slice(0, 80) + "..."
                  : ans.answer_text}
              </p>

              {expandedId === ans.id && (
                <div style={{ marginTop: "10px" }}>
                  <p><strong>Session:</strong> {ans.session_id}</p>
                  {sessions
  .filter((s) => s.id === ans.session_id)
  .map((s) => (
    <div key={s.id}>
      <p><strong>Mode:</strong> {s.mode}</p>
      <p><strong>Topic:</strong> {s.topic || "General"}</p>
      <p><strong>Difficulty:</strong> {s.difficulty || "Any"}</p>
      <p><strong>Questions:</strong> {s.total_questions}</p>
      <p><strong>Follow Ups:</strong> {s.followup_count}</p>
      <p><strong>Average Score:</strong> {s.average_score}</p>
    </div>
))}
                  <p><strong>Date:</strong>{" "}{new Date(ans.created_at).toLocaleString()}</p>
                  <p><strong>Full Answer:</strong> {ans.answer_text}</p>

                  <p>
                    <strong>Feedback:</strong>{" "}
                    {ans.feedback || "No feedback provided."}
                  </p>

                  <p>
                    <strong>Ideal Answer:</strong>{" "}
                    {ans.ideal_answer || "No ideal answer provided."}
                  </p>

                  <p><strong>Thinking Time:</strong> {ans.time_to_start}s</p>

                  <p><strong>Answer Time:</strong> {ans.time_to_answer}s</p>

                  <p><strong>Total Time:</strong> {ans.total_time}s</p>

                  <p className={ans.score >= 7 ? "score-good" : "score-bad"}>
                    Score: {ans.score}/10
                  </p>

                  {followups.length > 0 && (
                    <div className="followup-section">

                      <h4>Follow-Up Questions</h4>

                      {followups.map((f) => (
                        <div
                          key={f.id}
                          className="followup-card"
                        >

                          <p><strong>Question:</strong> {f.question}</p>

<p>
  <strong>Answer:</strong>{" "}
  {f.answer_text.length > 80
    ? f.answer_text.slice(0, 80) + "..."
    : f.answer_text}
</p>

<p><strong>Score:</strong> {f.score}/10</p>

{expandedFollowupId === f.id && (
  <div style={{ marginTop: "10px" }}>

    <p><strong>Full Answer:</strong> {f.answer_text}</p>

    <p><strong>Feedback:</strong> {f.feedback}</p>

    <p><strong>Ideal Answer:</strong> {f.ideal_answer}</p>

    <p><strong>Thinking Time:</strong> {f.time_to_start}s</p>

    <p><strong>Answer Time:</strong> {f.time_to_answer}s</p>

    <p><strong>Total Time:</strong> {f.total_time}s</p>

  </div>
)}

<button onClick={() => toggleFollowupExpand(f.id)}>
  {expandedFollowupId === f.id
    ? "Hide Details"
    : "View Details"}
</button>
                        </div>
                      ))}

                    </div>
                  )}

                </div>
              )}

              <button onClick={() => toggleExpand(ans.id)}>
                {expandedId === ans.id
                  ? "Hide details"
                  : "View details"}
              </button>

            </div>
          );        });
})()}

    <button
      onClick={() => setPage("home")}
      style={{ marginTop: "20px" }}
    >
      Back
    </button>

  </div>
);
}

export default History;