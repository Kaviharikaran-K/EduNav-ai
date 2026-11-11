# EduNav AI

EduNav AI is a full-stack academic navigation platform for students, parents, and administrators. It combines a premium dashboard, AI tutor workflows, academic document management, task planning, timetable tracking, and role-aware analytics in a single application.

## Features

- Student dashboard with personalized academic metrics
- AI tutoring workflow with subject-aware prompts and grounded answers
- Academic document hub with uploads, metadata, and subject filters
- Previous-year paper and revision planning sections
- Timetable and study-planner experience
- To-do list, notifications, and progress monitoring
- Parent guidance summary with approved data sharing
- Admin overview for institutions and platform metrics
- FastAPI backend with demo data and SQLAlchemy-ready schema

## Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: FastAPI, Pydantic, SQLAlchemy
- Database: SQLite for local development; PostgreSQL-ready SQLAlchemy models and Alembic migration structure
- AI: Retrieval-aware classroom tutoring with document-grounded prompt responses

## Local setup

1. Install frontend dependencies:

   ```bash
   npm install
   ```

2. Create the backend environment if you do not already have it:

   ```bash
   python -m venv .venv
   .\.venv\Scripts\python.exe -m pip install --upgrade pip
   .\.venv\Scripts\python.exe -m pip install fastapi[standard] sqlalchemy alembic psycopg[binary] pydantic[email] python-dotenv passlib[bcrypt] PyJWT python-multipart httpx email-validator pytest pytest-asyncio
   ```

3. Copy the environment template:

   ```bash
   copy .env.example .env
   ```

4. Run the FastAPI backend:

   ```bash
   cd backend
   ..\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

5. Start the frontend app:

   ```bash
   cd ..
   npm run dev
   ```

6. Open the app at `http://localhost:3000`.

## Sign in

The local demo sign-in accepts any valid email address and any non-empty password. Choose Student, Parent, or Admin on the sign-in screen. After signing in, use the workspace tabs to switch between Overview, AI Tutor, Documents, Planner, and Progress. Use **Sign out** in the header to end the local demo session.

This is demonstration authentication only: it does not verify accounts or provide production-grade authorization. Do not use real credentials or deploy it as-is.

## Demo data notice

The included data is clearly marked as demo data for design and validation. It is not real student data and should be replaced with authenticated production records before deployment.

## Architecture notes

- Backend routes live under `backend/app/main.py`.
- Database models are defined in `backend/app/models.py`.
- Alembic migration scaffolding is available under `backend/migrations`.
- Frontend dashboard is implemented in `src/app/page.tsx`.

## Deployment readiness

For deployment, move from local SQLite to PostgreSQL, add secure JWT secrets, configure file storage, connect a real LLM provider, and add database migrations and a production-grade auth layer.
