import os

from sqlalchemy.orm import Session
import models, schemas
from groq import Groq
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"), override=True)

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise Exception("GROQ_API_KEY not set")
client = Groq(api_key=api_key)

def create_answer(db: Session, answer: schemas.AnswerCreate, current_user: int, score: int, feedback: str, ideal_answer: str):
    
    answer_text = answer.answer
    word_count = len(answer_text.split())
    
    db_answer = models.Answer(
                              user_id = current_user,
                              question = answer.question,
                              answer_text = answer_text,
                              time_to_start = answer.time_to_start,
                              time_to_answer = answer.time_to_answer,
                              total_time = answer.total_time,
                              word_count = word_count,
                              score = score,
                              feedback = feedback,
                              ideal_answer = ideal_answer,
                              is_followup = answer.is_followup,
                              parent_question_id = answer.parent_question_id,
                              session_id = answer.session_id
                              )
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    
    return db_answer
def get_answers(db:Session,min_score = None, sort = None, limit = None):
  query = db.query(models.Answer)
  if min_score is not None:
    query = query.filter(models.Answer.score >= min_score)
  
  if sort == "desc":
    query = query.order_by(models.Answer.id.desc())
  elif sort == "asc":
    query = query.order_by(models.Answer.id.asc())
  
  if limit is not None:
    query = query.limit(limit)
  
  return query.all()

def evaluate_answer_ai(question: str, answer_text: str, time_to_start: int, time_to_answer: int, total_time: int):
  prompt = f"""
  You are an AI Interview Evaluator.

Evaluate the candidate's answer based on:
- technical correctness
- clarity
- communication quality
- confidence
- timing behavior

Question:
{question}

Answer:
{answer_text}

Performance Metrics:
- Thinking Time: {time_to_start} seconds
- Answer Time: {time_to_answer} seconds
- Total Time: {total_time} seconds

Evaluation Rules:

FEEDBACK:
- Feedback must be short, clear, and practical
- Maximum 3 lines
- Mention mistakes and improvements only

IDEAL ANSWER:
- Generate a concise ideal interview answer
- Ideal answer should be educational
- Maximum 5 lines
- Should directly answer the interview question properly

OUTPUT RULES:
- Score must be between 0 and 10
- Do not overly penalize long thinking time
- Timing should only slightly influence evaluation
- No bullet points
- No numbering
- No markdown
- No extra explanation outside JSON

Return ONLY valid JSON in this exact format:

{{
    "score": 0,
    "feedback": "your feedback here",
    "ideal_answer": "the ideal answer here"
}}
"""
  # api_key = os.getenv("GROQ_API_KEY")
  # client = Groq(api_key=api_key)
  response = client.chat.completions.create(
    model = "llama-3.1-8b-instant",
    messages = [
      {
        "role": "user",
        "content": prompt
      }
    ],
    temperature=0.7,
    timeout=20)
  
  return response.choices[0].message.content

def generate_question_ai(topic = None, difficulty = None, mode = None):
  
  prompt = "You are an interviewer.\n\n"
  if mode == "HR":
    prompt += """
Interview Type:
HR Behavioral Interview

Ask ONLY behavioral interview questions.
No technical questions.
"""
  elif mode == "Technical":
    prompt += """
Interview Type:
Technical Interview

Ask ONLY technical interview questions.
"""
  elif mode == "Mixed":
    prompt += """
Interview Type:
Mixed Interview

Mix HR and technical questions randomly.
"""
  elif mode == "Rapid Fire":
    prompt += """
Interview Type:
Rapid Fire

Generate short quick interview questions.
Keep question concise.
"""
  if topic:
    prompt += f"Topic: {topic}\n"
  else:
    prompt += """
Topic:
DSA, OOP, DBMS, Operating Systems,
System Design, Web Development,
Java, Python, JavaScript,
React, SQL, Computer Networks,
HR Behavioral Questions
"""

  if difficulty:
    prompt += f"Difficulty: {difficulty}\n"

  prompt += """
Task:
Generate ONLY ONE interview question.

STRICT RULES:
- Output must be ONLY the question
- No prefix like "Question:"
- No explanation
- No extra text
- No formatting
- Maximum 20 words

Correct Example:
What is polymorphism in OOP?

Wrong Examples:
Here is a question: ...
**Question:** ...
Explain ...
"""
  # api_key = os.getenv("GROQ_API_KEY")
  # client = Groq(api_key=api_key)
  response = client.chat.completions.create(
  model = "llama-3.1-8b-instant",
  messages =[{"role":"user","content":prompt}],
  temperature=0.7,
  timeout=20
  )
  return response.choices[0].message.content

def analyze_performance_ai(answers):
  
  formatted_data = ""
  
  for ans in answers:
    formatted_data += f"""
    Question: {ans.question}
    Score: {ans.score}
    Feedback: {ans.feedback}
    """
  prompt = f"""
  Analyze the interview performance 
  
  Data:
  {formatted_data}
  
 Identify:

1. Top 5 weak areas only
2. Top 5 strong areas only

Rules:
- Maximum 5 weak areas
- Maximum 5 strong areas
- Remove duplicates
- Return short topic names only
- Return valid JSON only
- Return ONLY valid JSON
- Do NOT include explanation
- Do NOT include markdown
- Do NOT include text before or after JSON
  
  return ONLY valid JSON in the format:
  {{
    "weak_areas": ["..."],
    "strong_areas": ["..."]
  }}
  """
  # api_key = os.getenv("GROQ_API_KEY")
  # client = Groq(api_key=api_key)
  response = client.chat.completions.create(
    model = "llama-3.1-8b-instant",
    temperature=0,
    messages=[{"role":"user","content":prompt}],
    timeout=20
  )
  return response.choices[0].message.content

def ask_groq(prompt :str):
  completion = client.chat.completions.create(
    model = "llama-3.1-8b-instant",
    messages=[{"role":"user","content":prompt}],
    temperature=0.7
  )
  return completion.choices[0].message.content