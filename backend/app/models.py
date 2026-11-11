from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, Float, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Institution(Base):
    __tablename__ = "institutions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    institution_type: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)


class Department(Base):
    __tablename__ = "departments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    institution_id: Mapped[int] = mapped_column(ForeignKey("institutions.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)


class Subject(Base):
    __tablename__ = "subjects"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str | None] = mapped_column(String(50), nullable=True)


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    institution_id: Mapped[int | None] = mapped_column(ForeignKey("institutions.id"), nullable=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"), nullable=True)
    academic_year: Mapped[str | None] = mapped_column(String(50), nullable=True)
    semester: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)


class AcademicProfile(Base):
    __tablename__ = "academic_profiles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    study_hours_goal: Mapped[float | None] = mapped_column(Float, nullable=True)
    current_topic: Mapped[str | None] = mapped_column(String(255), nullable=True)
    academic_goals: Mapped[str | None] = mapped_column(Text, nullable=True)
    weak_topics: Mapped[str | None] = mapped_column(Text, nullable=True)


class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    subject: Mapped[str | None] = mapped_column(String(255), nullable=True)
    priority: Mapped[str | None] = mapped_column(String(30), nullable=True)
    deadline: Mapped[DateTime | None] = mapped_column(DateTime, nullable=True)
    completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)


class Notification(Base):
    __tablename__ = "notifications"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
