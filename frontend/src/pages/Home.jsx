import { useState } from "react";
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

  const [mode, setMode] = useState("Technical");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [followUpCount, setFollowUpCount] = useState(0);

  // Load Question
  const loadQuestion = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (topic) params.append("topic", topic);
      if (difficulty) params.append("difficulty", difficulty);
      if (mode) params.append("mode", mode);

      const url = `${import.meta.env.VITE_API_BASE_URL}/question?${params.toString()}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`}
        });

      if (res.status === 401) {
        localStorage.clear();
        window.location.reload();
        return;
      }

      const data = await res.json();

      setQuestion(data.question);

      // Reset States
      setAnswer("");
      setFeedback(null);
      setFirstInputTime(null);
      setStartTime(Date.now());
      setFollowUpCount(0);

    } catch (err) {
      setError("Failed to load question");
    } finally {
      setLoading(false);
    }
  };

  // Handle Typing
  const handleChange = (e) => {
    setAnswer(e.target.value);

    if (!firstInputTime) {
      setFirstInputTime(Date.now());
    }
  };

  // Submit Answer
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

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            question,
            answer,
            time_to_start,
            time_to_answer,
            total_time,
          }),
        }
      );

      if (res.status === 401) {
        localStorage.clear();
        window.location.reload();
        return;
      }

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

  // Follow-Up Question
  const handleFollowUp = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/followup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            question,
            answer,
            mode
          }),
        }
      );

      if (res.status === 401) {
        localStorage.clear();
        window.location.reload();
        return;
      }

      const data = await res.json();

      setQuestion(data.followup);

      setAnswer("");
      setFeedback(null);
      setStartTime(Date.now());
      setFirstInputTime(null);

      setFollowUpCount((prev) => prev + 1);

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

            <h3>Configure Interview</h3>

            {/* INTERVIEW MODE */}
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);

                // Reset topic when HR selected
                if (e.target.value === "HR") {
                  setTopic("");
                }
              }}
            >
              <option value="Technical">Technical</option>
              <option value="HR">HR Behavioral</option>
              <option value="Mixed">Mixed</option>
              <option value="Rapid Fire">Rapid Fire</option>
            </select>

            {/* TOPIC */}
            {mode !== "HR" && (
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option value="">Select Topic</option>

                <option value="DSA">DSA</option>
                <option value="OOP">OOP</option>
                <option value="DBMS">DBMS</option>
                <option value="OS">Operating Systems</option>
                <option value="System Design">System Design</option>
                <option value="Web Development">Web Development</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="React">React</option>
                <option value="SQL">SQL</option>
                <option value="Networking">
                  Computer Networks
                </option>
              </select>
            )}

            {/* DIFFICULTY */}
            {mode !== "Rapid Fire" && (
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
            )}

          </div>
        </div>

        {/* QUESTION */}
        <div className="section">
          {question && (
            <div className="home-card question-box">

              <p className="mode-badge">
                {mode} Interview
              </p>

              <h2 className="question-text">
                {question}
              </h2>

            </div>
          )}
        </div>

        {/* ANSWER */}
        <div className="section">
          <div className="home-card">
            {question ? (
              <textarea
                value={answer}
                onChange={handleChange}
                placeholder="Type your answer here..."
                onPaste={(e) => {
                  e.preventDefault();
                  alert("Pasting is not allowed!");
                }}
              />
            ) : (
              <p>Please start the interview to get a question.</p>
            )}
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

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={loading || !answer.trim() || !question}
            className="small-btn"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {/* START / NEXT */}
          {!feedback && (
            <button
              disabled={loading}
              onClick={() => {
                loadQuestion();
                setStarted(true);
              }}
              className="small-btn"
            >
              {started ? "Next Question" : "Start Interview"}
            </button>
          )}

          {/* FEEDBACK BUTTONS */}
          {feedback && (
            <>
              <button
                onClick={handleFollowUp}
                className="small-btn"
                disabled={loading || followUpCount >= 2}
              >
                {followUpCount >= 2
                  ? "Follow-Up Limit Reached"
                  : "Follow-Up"}
              </button>

              <button
                onClick={() => {
                  loadQuestion();
                }}
                className="small-btn"
                disabled={loading}
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