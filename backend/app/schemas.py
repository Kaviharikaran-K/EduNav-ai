from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(min_length=8)
    role: str = "student"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: Literal["student", "parent", "admin"] = "student"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    subject: str = "Mathematics"
    priority: str = "medium"
    deadline: Optional[str] = None
    completed: bool = False


class ChatMessage(BaseModel):
    message: str
    subject: str = "Mathematics"


class ChatResponse(BaseModel):
    answer: str
    subject: str
    grounded: bool = True
    conversation_id: str = "demo-conversation"


class DashboardSummary(BaseModel):
    welcome: str
    academic_year: str
    semester: str
    metrics: List[dict]
    activity: List[dict]
    tasks: List[dict]
    documents: List[dict]
    timetable: List[dict]
    notifications: List[dict]
    subject_performance: List[dict] = Field(default_factory=list)
    weak_topics: List[str] = Field(default_factory=list)


class TimestampedModel(BaseModel):
    created_at: datetime
    updated_at: Optional[datetime] = None
