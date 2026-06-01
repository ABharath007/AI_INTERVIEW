from fastapi import FastAPI, Depends, Query, HTTPException
from schemas import AnswerCreate , AnswerResponse, UserCreate, UserLogin, SessionCreate
from database import engine, Base ,SessionLocal, get_db
import models
from sqlalchemy.orm import Session
from sqlalchemy import func
import crud
from auth import create_access_token, get_current_user
from typing import List, Optional
import json, re, random
from fastapi.middleware.cors import CORSMiddleware
from auth_utils import hash_password, verify_password
from google.oauth2 import id_token
from google.auth.transport import requests
import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"), override=True)



    

app = FastAPI()
Base.metadata.create_all(bind = engine)
FOCUS_RATIO = 0.7
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-interview-frontend-xrvs.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")

def home():
    return {"message": "Interview AI backend running"}

@app.post("/answer",response_model=AnswerResponse)
def submit_answer(data: AnswerCreate, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    
    if not data.answer.strip():
        raise HTTPException(status_code=400, detail="Answer cannot be empty")
    
    if data.total_time < 0 or data.total_time > 3600:
        raise HTTPException(status_code=400, detail="Invalid time")
    
    ai_result = crud.evaluate_answer_ai(data.question, data.answer, data.time_to_start, data.time_to_answer, data.total_time)
    try:
        parsed = json.loads(ai_result)
        score  = parsed["score"]
        feedback = parsed["feedback"]
        ideal_answer = parsed.get("ideal_answer", "")
    except Exception:
        score = 0
        feedback = ai_result
        ideal_answer = ""
    answer = crud.create_answer(db, data, current_user, score, feedback, ideal_answer)
    if data.session_id:
        session = db.query(models.InterviewSession).filter(
            models.InterviewSession.id == data.session_id
        ).first()

        if session:
            if data.is_followup:
                session.followup_count += 1
            else:
                session.total_questions += 1

            db.commit()
    return {
        "id": answer.id,
        "question": data.question,
        "answer_text": answer.answer_text,
        "time_to_start": answer.time_to_start,
        "time_to_answer": answer.time_to_answer,
        "total_time": answer.total_time,
        "word_count": answer.word_count,
        "score": score,
        "feedback": feedback,
        "ideal_answer": ideal_answer,
        "is_followup": answer.is_followup,
        "parent_question_id": answer.parent_question_id,
        "session_id": answer.session_id
        }


@app.get("/question")
def get_question(
                db: Session = Depends(get_db),
                topic: Optional[str] = None,
                difficulty: Optional[str] = None,
                mode: Optional[str] = None,
                current_user: int = Depends(get_current_user)
    ):
    answers = db.query(models.Answer).filter(
    models.Answer.user_id == current_user
).all()
    
    if not answers or len(answers) < 3:
        return {"question": crud.generate_question_ai(topic, difficulty, mode)}
    
    
    try:
        analysis = crud.analyze_performance_ai(answers)
        match = re.search(r'\{.*\}', analysis, re.DOTALL)
        if match:
            parsed = json.loads(match.group())
            weak_areas = parsed.get("weak_areas", [])
        else:
            weak_areas = []
        if not topic:   # only override if user didn't select
            if weak_areas and random.random() < FOCUS_RATIO:
                topic = random.choice(weak_areas)
            
        question = crud.generate_question_ai(topic, difficulty, mode)
        
    except Exception as e :
        print(f"Error occurred: {e}")
        question = crud.generate_question_ai(topic, difficulty, mode)
        
    return {"question": question}

    

@app.get("/answers")
def get_answers(
                current_user: int = Depends(get_current_user),
                db: Session = Depends(get_db),
                min_score: Optional[int] = Query(None),
                sort: Optional[str] = Query(None),
                limit: Optional[int] = Query(None)
                ):
    query = db.query(models.Answer).filter(models.Answer.user_id == current_user)
    
    if min_score is not None:
        query = query.filter(models.Answer.score >= min_score)
    if sort == "asc":
        query = query.order_by(models.Answer.id.asc())
    elif sort == "desc":
        query = query.order_by(models.Answer.id.desc())
    if limit is not None:
        query = query.limit(limit)
    return query.all()

@app.get("/analysis")
def get_analysis(
                db: Session = Depends(get_db),
                current_user: int = Depends(get_current_user)
    ):
    answers = db.query(models.Answer).filter(models.Answer.user_id == current_user).all()
    if not answers:
        return {"weak_areas": [], "strong_areas": [],"total_questions": 0,
            "average_score": 0,
            "best_score": 0}
    total_questions = len(answers)
    scores = [a.score for a in answers]
    average_score = sum(scores) / len(scores)
    best_score = max(scores)
    ai_result = crud.analyze_performance_ai(answers)
    try:
        parsed = json.loads(ai_result)
    except Exception as e:
        print("Analysis JSON Parse Error:", e)
        print(ai_result)
        parsed = {
            "weak_areas": [],
            "strong_areas": []
        }
    return {
        "weak_areas": parsed.get("weak_areas", []),
        "strong_areas": parsed.get("strong_areas", []),
        "total_questions": total_questions,
        "average_score": round(average_score, 2),
        "best_score": best_score
    }

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_email = db.query(models.User).filter(models.User.email == user.email).first()
    existing_username = db.query(models.User).filter(models.User.username == user.username).first()

    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    db_user = models.User(
        username = user.username,
        email = user.email,
        password = hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User registered successfully"}

@app.post("/login")
def login(user: UserLogin, db:Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token(data={"user_id": db_user.id})
    
    return {
        "user_id": db_user.id,
        "username": db_user.username,
        "access_token": token,
        "token_type": "bearer"
        }
    
@app.post("/google-login")
def google_login(data: dict, db: Session = Depends(get_db)):
    
    token = data["token"]
    idinfo = id_token.verify_oauth2_token(token, requests.Request(), os.getenv("GOOGLE_CLIENT_ID"))
    
    email = idinfo["email"]
    username = idinfo.get("name", "Google User")
    
    user = db.query(models.User).filter(
        models.User.email == email
    ).first()
    
    if not user:
        user = models.User(
            username=username,
            email=email,
            password = hash_password(os.urandom(16).hex())
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    access_token = create_access_token(data={"user_id": user.id})
    
    return {
        "access_token": access_token,
        "username": user.username,
    }
@app.post("/followup")
def generate_folowup(data:dict,
    current_user: int = Depends(get_current_user)):
    question = data["question"]
    answer = data["answer"]
    mode = data.get("mode", "Technical")
    parent_question_id = data.get("parent_question_id")
    if mode == "HR":
        interviewer_type = "HR Interviewer"
    else:
        interviewer_type = "Technical Interviewer"
    prompt = f"""
    You are a {interviewer_type}.

    Original Question:
    {question}

    Candidate Answer:
    {answer}

    Generate ONLY ONE concise follow-up interview question.

Rules:
- Return ONLY the question
- No explanations
- No praise
- No extra text
- No "Your answer is correct"
- Maximum 1 sentence
    """

    followup = crud.ask_groq(prompt)

    return {"followup": followup}
    
    
@app.post("/session")
def create_session(data: SessionCreate, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    
    session = models.InterviewSession(
        user_id = current_user,
        mode = data.mode,
        topic = data.topic,
        difficulty = data.difficulty
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    return {"session_id": session.id}

@app.get("/sessions")
def get_sessions(
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    sessions = (
        db.query(models.InterviewSession)
        .filter(
            models.InterviewSession.user_id == current_user
        )
        .order_by(
            models.InterviewSession.id.desc()
        )
        .all()
    )

    result = []

    for s in sessions:
        answers = (
            db.query(models.Answer)
            .filter(models.Answer.session_id == s.id)
            .all()
        )

        avg_score = (
            round(sum(a.score for a in answers) / len(answers), 2)
            if answers else 0
        )

        result.append({
            "id": s.id,
            "mode": s.mode,
            "topic": s.topic,
            "difficulty": s.difficulty,
            "total_questions": s.total_questions,
            "followup_count": s.followup_count,
            "start_time": s.start_time,
            "end_time": s.end_time,
            "average_score": avg_score
        })

    return result
    
@app.get("/sessions/{session_id}/answers")
def get_session_answers(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    
    answers = (
        db.query(models.Answer)
        .filter(
            models.Answer.user_id == current_user,
            models.Answer.session_id == session_id
        )
        .order_by(models.Answer.id.asc())
        .all()
    )

    return answers

@app.put("/session/{session_id}/end")
def end_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    session = (
        db.query(models.InterviewSession)
        .filter(
            models.InterviewSession.id == session_id,
            models.InterviewSession.user_id == current_user
        )
        .first()
    )

    if not session:
        raise HTTPException(404, "Session not found")

    session.end_time = func.now()

    db.commit()

    return {"message": "Session ended"}