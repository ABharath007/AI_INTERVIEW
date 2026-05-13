from sqlalchemy import Column, Integer, Text, String, ForeignKey
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
    
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key = True, index = True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100))