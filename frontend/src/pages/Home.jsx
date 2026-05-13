import { useState, useEffect } from "react";
import "../style/Home.css";

function Home({ onLogout }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [firstInputTime, setFirstInputTime] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const user_id = localStorage.getItem("user_id");
  if (!user_id) {
  return <p>Please login again</p>;
}

  // Load question
  const loadQuestion = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (topic) params.append("topic", topic);
      if (difficulty) params.append("difficulty", difficulty);

      const url = `${import.meta.env.VITE_API_BASE_URL}/question?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();

      setQuestion(data.question);

      // Reset states
      setAnswer("");
      setFeedback(null);
      setFirstInputTime(null);
      setStartTime(Date.now());

    } catch (err) {
      setError("Failed to load question");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   loadQuestion();
  // }, []);

  // Handle typing
  const handleChange = (e) => {
    setAnswer(e.target.value);

    if (!firstInputTime) {
      setFirstInputTime(Date.now());
    }
  };

  // Submit answer
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const submitTime = Date.now();

      const time_to_start = firstInputTime
        ? Math.floor((firstInputTime - startTime) / 1000)
        : 0;

      const time_to_answer = firstInputTime
        ? Math.floor((submitTime - firstInputTime) / 1000)
        : 0;

      const total_time = Math.floor((submitTime - startTime) / 1000);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id,
          question,
          answer,
          time_to_start,
          time_to_answer,
          total_time
        })
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      const data = await res.json();
      setFeedback(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className = "main-section">
    <div className="container">
      <h1>Interview Practice</h1>
      <div className = "section">
      <div className="home-card">
        <h3> Select Topic and Difficulty </h3>
        <select value ={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">Any Topic</option>
          <option value = "DSA">DSA</option>
          <option value = "System Design">System Design</option>
          <option value = "OOP">OOP</option>
          <option value = "DBMS">DBMS</option>
          <option value = "OS">OS</option>
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{marginLeft: "10px"}}>
          <option value="">Any Difficulty</option>
          <option value = "Easy">Easy</option>
          <option value = "Medium">Medium</option>
          <option value = "Hard">Hard</option>
        </select>
        
        <button
  onClick={() => {
    loadQuestion();
    setStarted(true);
  }}
  disabled={loading}
  style={{ marginLeft: "10px" }}
>
  {started ? "Next Question" : "Start Interview"}
</button>
      </div>
      </div>
      <div className = "section">
        {question && (
      <div className="home-card question-box">
      <h2 className="question-text">{question}</h2>
      </div>
)}
      
      </div>
      <div className = "section">

      <div className="home-card answer">
        <textarea
          value={answer}
          onChange={handleChange}
          placeholder="Type your answer here..."
        />
      </div>
      </div>
      <div className = "action-buttons">
      <div className = "button-group">
      <button
        onClick={handleSubmit}
        disabled={loading || !answer.trim() || !question}
      >
        {loading ? "Submitting..." : "Submit Answer"}
      </button>
      </div>
      {error && <p className="error">{error}</p>}

      {feedback && (
        <div className="card feedback">
          <h3>Score: {feedback.score}/10</h3>
          <p>{feedback.feedback}</p>
        </div>
      )}
    
    </div>
    </div>
    </div>
  );
}

export default Home;