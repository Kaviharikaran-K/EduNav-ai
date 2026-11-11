from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import APP_ENV
from .demo_data import ADMIN_DASHBOARD, AI_ANSWER_TEMPLATE, AI_HISTORY, PARENT_DASHBOARD, STUDENT_DASHBOARD
from .schemas import ChatMessage, ChatResponse, DashboardSummary, LoginRequest, TaskCreate, TokenResponse

app = FastAPI(title="EduNav AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "environment": APP_ENV, "service": "edunav-ai"}


@app.post("/api/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    if not payload.password.strip():
        raise HTTPException(status_code=401, detail="Email and password are required")

    demo_names = {
        "student": "Aarav Nair",
        "parent": "Meera Nair",
        "admin": "EduNav Administrator",
    }
    return TokenResponse(
        access_token="demo-access-token",
        token_type="bearer",
        user={
            "email": payload.email,
            "name": demo_names[payload.role],
            "role": payload.role,
        },
    )


@app.get("/api/dashboard/student", response_model=DashboardSummary)
def student_dashboard():
    return DashboardSummary(**STUDENT_DASHBOARD)


@app.get("/api/dashboard/parent")
def parent_dashboard():
    return PARENT_DASHBOARD


@app.get("/api/dashboard/admin")
def admin_dashboard():
    return ADMIN_DASHBOARD


@app.get("/api/tasks")
def get_tasks():
    return STUDENT_DASHBOARD["tasks"]


@app.post("/api/tasks")
def create_task(task: TaskCreate):
    return {"id": 99, "title": task.title, "description": task.description, "subject": task.subject, "priority": task.priority, "deadline": task.deadline or "Not set", "completed": task.completed}


@app.get("/api/timetable")
def timetable():
    return STUDENT_DASHBOARD["timetable"]


@app.get("/api/documents")
def documents():
    return STUDENT_DASHBOARD["documents"]


@app.post("/api/ai/chat", response_model=ChatResponse)
def ai_chat(payload: ChatMessage):
    answer = AI_ANSWER_TEMPLATE.format(subject=payload.subject, message=payload.message)
    return ChatResponse(answer=answer, subject=payload.subject, grounded=True)


@app.get("/api/ai/history")
def ai_history():
    return AI_HISTORY


@app.get("/api/progress/overview")
def progress_overview():
    return {
        "task_completion": 74,
        "quiz_scores": {"current": 87, "previous": 76},
        "weekly_learning": STUDENT_DASHBOARD["activity"],
        "subject_performance": STUDENT_DASHBOARD["subject_performance"],
    }


@app.get("/api/progress/subjects")
def progress_subjects():
    return STUDENT_DASHBOARD["subject_performance"]


@app.get("/api/progress/weekly")
def progress_weekly():
    return STUDENT_DASHBOARD["activity"]


@app.get("/api/notifications")
def notifications():
    return STUDENT_DASHBOARD["notifications"]
