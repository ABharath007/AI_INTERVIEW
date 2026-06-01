from sqlalchemy import Column, Integer, Text, String, ForeignKey, Boolean, DateTime
from database import Base
from sqlalchemy.sql import func

class Answer(Base):
    __tablename__ = "answers"
    
    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    question = Column(Text)
    answer_text = Column(Text)
    time_to_start = Column(Integer)
    time_to_answer = Column(Integer)
    total_time = Column(Integer)
    word_count = Column(Integer)
    score = Column(Integer)
    feedback = Column(Text)
    ideal_answer = Column(Text)
    is_followup = Column(Boolean, default=False)
    parent_question_id = Column(Integer, ForeignKey("answers.id"), nullable=True)
    session_id = Column(Integer,ForeignKey("interview_sessions.id"),nullable=True,index=True)
    created_at = Column(DateTime(timezone=True),server_default=func.now())
    
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key = True, index = True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100))
    
class InterviewSession(Base):
    __tablename__ = "interview_sessions"
    
    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    mode = Column(String) 
    topic = Column(String)
    difficulty = Column(String)
    total_questions = Column(Integer, default=0) 
    followup_count = Column(Integer, default=0)
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)