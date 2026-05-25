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
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [followUpCount, setFollowUpCount] = useState(0);

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
      setFollowUpQuestion("");
      setFollowUpCount(0);

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
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
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
  const handleFollowUp = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/followup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          question,
          answer
        })
      });
      const data = await res.json();
      setQuestion(data.followup);
      setAnswer("");
      setFollowUpCount(followUpCount + 1);
      setFeedback(null);
      setStartTime(Date.now());
      setFirstInputTime(null);
    } catch (err) {
      setError("Failed to get follow-up question");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="main-section">
    <div className="container">

      <h1>Interview Practice</h1>

      {/* TOP SECTION */}
      <div className="section">
        <div className="home-card">

          <h3>Select Topic and Difficulty</h3>

          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="">Any Topic</option>
            <option value="DSA">DSA</option>
            <option value="System Design">System Design</option>
            <option value="OOP">OOP</option>
            <option value="DBMS">DBMS</option>
            <option value="OS">OS</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="">Any Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

        </div>
      </div>

      {/* QUESTION */}
      <div className="section">
        {question && (
          <div className="home-card question-box">
            <h2 className="question-text">{question}</h2>
          </div>
        )}
      </div>

      {/* ANSWER */}
      <div className="section">
        <div className="home-card">

          <textarea
            value={answer}
            onChange={handleChange}
            placeholder="Type your answer here..."
            onPaste={(e) => {
              e.preventDefault();
              alert("Pasting is not allowed!");
            }}
          />

        </div>
      </div>

      {/* FEEDBACK */}
      {feedback && (

        <div className="home-card feedback-card">

          <h3>Score: {feedback.score}/10</h3>

          <p>{feedback.feedback}</p>

        </div>

      )}

      {/* BUTTONS */}
      <div className="submit-section">

        <button
          onClick={handleSubmit}
          disabled={loading || !answer.trim() || !question}
          className="small-btn"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {!feedback && (
          <button
            onClick={() => {
              loadQuestion();
              setStarted(true);
            }}
            className="small-btn"
          >
            {started ? "Next Question" : "Start Interview"}
          </button>
        )}

        {feedback && (
          <>
            <button
              onClick={handleFollowUp}
              className="small-btn"
            >
              Follow-Up
            </button>

            <button
              onClick={() => {
                loadQuestion();
              }}
              className="small-btn"
            >
              Next Question
            </button>
          </>
        )}

      </div>

      {/* ERROR */}
      {error && (
        <p className="error">{error}</p>
      )}

    </div>
  </div>
);
}

export default Home;