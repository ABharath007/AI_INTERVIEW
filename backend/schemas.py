from pydantic import BaseModel

class AnswerCreate(BaseModel):
    user_id: int
    question: str
    answer: str
    time_to_start: int
    time_to_answer: int
    total_time: int

class AnswerResponse(BaseModel):
    id: int
    question: str
    answer_text: str  
    time_to_start: int
    time_to_answer: int
    total_time: int
    word_count: int
    score: int
    feedback: str
    model_config = {
    "from_attributes": True}

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    
class UserLogin(BaseModel):
    email: str
    password: str