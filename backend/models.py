from sqlalchemy import Column, Integer, Text, String, ForeignKey, Boolean
from database import Base

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
    
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key = True, index = True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100))