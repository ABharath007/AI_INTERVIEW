from pydantic import BaseModel

class AnswerCreate(BaseModel):
    question: str
    answer: str
    time_to_start: int
    time_to_answer: int
    total_time: int
    is_followup: bool = False
    parent_question_id: int | None = None

class AnswerResponse(BaseModel):
    id: int
    question: str
    answer_text: str  
    time_to_start: int
    time_to_answer: int
    total_time: int
    word_count: int
    score: float
    feedback: str
    ideal_answer: str
    is_followup: bool
    parent_question_id: int | None
    model_config = {
    "from_attributes": True}

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    
class UserLogin(BaseModel):
    email: str
    password: str