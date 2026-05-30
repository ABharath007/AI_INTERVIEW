import "../style/LandingPage.css";
import homeImg from "../assets/home-preview.png";
import historyImg from "../assets/history-preview.png";
import analysisImg from "../assets/analysis-preview.png";

function LandingPage({ onLogin, onRegister }) {
return ( <div className="landing-page">
  <nav className="landing-nav">
    <div className="landing-logo">InterviAI</div>

    <div className="landing-buttons">
      <button onClick={onLogin}>Login</button>
      <button onClick={onRegister}>Get Started</button>
    </div>
  </nav>

  <section className="hero">
    <div className="hero-left">

      <h1>Ace Your Next Interview with AI</h1>

      <p>
        Practice technical and HR interviews,
        receive instant feedback,
        ideal answers,
        follow-up questions,
        and performance analysis.
      </p>

      <div className="hero-buttons">
        <button onClick={onRegister}>Start Free</button>
        <button onClick={onLogin}>Login</button>
      </div>

    </div>

    <div className="hero-right">
      <img
        src={homeImg}
        alt="InterviAI Preview"
        className="hero-image"
      />
    </div>
  </section>

  <section className="features">
    <h2>Why Choose InterviAI?</h2>

    <div className="feature-grid">

      <div className="feature-card">
        <h3>AI Question Generation</h3>
        <p>
          Generate technical and HR interview questions
          tailored to your selected topic and difficulty.
        </p>
      </div>

      <div className="feature-card">
        <h3>AI Evaluation</h3>
        <p>
          Receive instant scores, feedback,
          and ideal answers for every response.
        </p>
      </div>

      <div className="feature-card">
        <h3>Follow-Up Questions</h3>
        <p>
          Experience realistic interview conversations
          with adaptive follow-up questioning.
        </p>
      </div>

      <div className="feature-card">
        <h3>Performance Analytics</h3>
        <p>
          Track strengths, weaknesses,
          scores and overall interview progress.
        </p>
      </div>

    </div>
  </section>

  <section className="showcase">

    <h2>See InterviAI In Action</h2>

    <div className="showcase-card">

      <img src={homeImg} alt="Home" />

      <div>
        <h3>Practice Interviews</h3>

        <p>
          Select interview mode, topic and difficulty
          to generate realistic AI-powered interview questions.
        </p>
      </div>

    </div>

    <div className="showcase-card reverse">

      <div>
        <h3>Track Your Progress</h3>

        <p>
          Review previous interviews,
          scores, feedback,
          ideal answers and follow-up questions.
        </p>
      </div>

      <img src={historyImg} alt="History" />

    </div>

    <div className="showcase-card">

      <img src={analysisImg} alt="Analysis" />

      <div>
        <h3>Performance Analysis</h3>

        <p>
          Identify strengths and weaknesses
          through AI-generated performance insights.
        </p>
      </div>

    </div>

  </section>

  <section className="stats-section">

    <div className="stat-box">
      <h3>AI Powered</h3>
      <p>Instant Interview Evaluation</p>
    </div>

    <div className="stat-box">
      <h3>Follow-Ups</h3>
      <p>Adaptive Interview Flow</p>
    </div>

    <div className="stat-box">
      <h3>Analytics</h3>
      <p>Track Long-Term Progress</p>
    </div>

  </section>

  <section className="how-it-works">

    <h2>How It Works</h2>

    <div className="steps">

      <div className="step-card">
        <h3>1</h3>
        <h4>Select Interview Mode</h4>
        <p>Choose Technical, HR, or Mixed interviews.</p>
      </div>

      <div className="step-card">
        <h3>2</h3>
        <h4>Answer Questions</h4>
        <p>Practice realistic AI-generated interview questions.</p>
      </div>

      <div className="step-card">
        <h3>3</h3>
        <h4>Get Feedback</h4>
        <p>Receive scores, feedback and ideal answers instantly.</p>
      </div>

      <div className="step-card">
        <h3>4</h3>
        <h4>Improve</h4>
        <p>Track strengths and weaknesses through analytics.</p>
      </div>

    </div>

  </section>

  <section className="cta">

    <h2>Ready to Ace Your Next Interview?</h2>

    <p>
      Practice technical and HR interviews with AI-powered
      feedback, follow-up questions and performance analytics.
    </p>

    <button onClick={onRegister}>
      Start Practicing Free
    </button>

  </section>

  <footer className="footer">

    <h3>InterviAI</h3>

    <p>AI-Powered Interview Preparation Platform</p>

    <p>Built with React, FastAPI, PostgreSQL and Groq AI</p>

    <p>© 2026 InterviAI</p>

  </footer>

</div>


);
}

export default LandingPage;
