STUDENT_DASHBOARD = {
    "welcome": "Welcome back, Aarav!",
    "academic_year": "2026-2027",
    "semester": "Semester 5",
    "metrics": [
        {"label": "Study Hours", "value": "18.4h", "change": "+2.1h", "tone": "teal"},
        {"label": "Tasks Completed", "value": "24/30", "change": "+6 this week", "tone": "navy"},
        {"label": "Quiz Performance", "value": "87%", "change": "+9%", "tone": "teal"},
        {"label": "Learning Progress", "value": "74%", "change": "+5%", "tone": "slate"},
    ],
    "activity": [
        {"day": "Mon", "hours": 2.2},
        {"day": "Tue", "hours": 3.1},
        {"day": "Wed", "hours": 2.8},
        {"day": "Thu", "hours": 4.2},
        {"day": "Fri", "hours": 3.4},
        {"day": "Sat", "hours": 2.9},
        {"day": "Sun", "hours": 1.8},
    ],
    "tasks": [
        {"id": 1, "title": "Prepare Machine Learning notes", "subject": "AI", "priority": "High", "deadline": "Today, 7:00 PM", "completed": False},
        {"id": 2, "title": "Complete DBMS quiz review", "subject": "Database Systems", "priority": "Medium", "deadline": "Tomorrow, 10:00 AM", "completed": False},
        {"id": 3, "title": "Submit seminar presentation", "subject": "Data Structures", "priority": "High", "deadline": "Thu, 3:00 PM", "completed": True},
    ],
    "documents": [
        {"id": 1, "title": "Neural Networks Class Notes.pdf", "subject": "AI", "category": "Class Notes", "size": "2.1 MB"},
        {"id": 2, "title": "Operating Systems PYQ 2025.pdf", "subject": "OS", "category": "Previous Year Papers", "size": "1.8 MB"},
        {"id": 3, "title": "Database practice set.docx", "subject": "DBMS", "category": "Question Banks", "size": "856 KB"},
    ],
    "timetable": [
        {"id": 1, "title": "Data Structures Lab", "day": "Monday", "time": "09:00 - 11:00", "subject": "Data Structures"},
        {"id": 2, "title": "AI Lecture", "day": "Tuesday", "time": "11:30 - 12:45", "subject": "AI"},
        {"id": 3, "title": "Revision Session", "day": "Thursday", "time": "18:00 - 19:00", "subject": "DBMS"},
    ],
    "notifications": [
        {"id": 1, "title": "Midterm exam reminder", "body": "AI exam is scheduled for Friday morning.", "read": False},
        {"id": 2, "title": "Parent update shared", "body": "Your weekly report has been shared with your parent.", "read": True},
    ],
    "subject_performance": [
        {"subject": "AI", "score": 91},
        {"subject": "DBMS", "score": 84},
        {"subject": "OS", "score": 76},
        {"subject": "Maths", "score": 88},
    ],
    "weak_topics": ["Concurrency in Operating Systems", "Gradient descent derivation", "Normalization in relational design"],
}

PARENT_DASHBOARD = {
    "student": "Aarav Nair",
    "overall_status": "On track for strong semester performance",
    "weekly_progress": [
        {"day": "Mon", "score": 68},
        {"day": "Tue", "score": 72},
        {"day": "Wed", "score": 79},
        {"day": "Thu", "score": 75},
        {"day": "Fri", "score": 87},
        {"day": "Sat", "score": 82},
        {"day": "Sun", "score": 90},
    ],
    "assignments": [
        {"title": "ML assignment", "status": "Completed", "due": "Due yesterday"},
        {"title": "DBMS schema revision", "status": "Pending", "due": "Due Friday"},
    ],
    "notifications": [
        {"id": 1, "title": "Progress summary", "body": "Your student completed 75% of this week’s planned tasks.", "read": False},
    ],
    "guidance": [
        "Your student has completed most scheduled tasks this week. Encourage regular revision of the topics where quiz accuracy is lower.",
        "Plan one focused revision block for OS concurrency before the next quiz.",
    ],
}

ADMIN_DASHBOARD = {
    "stats": [
        {"label": "Total Students", "value": "1248"},
        {"label": "Total Parents", "value": "721"},
        {"label": "Active Institutions", "value": "18"},
        {"label": "AI Usage", "value": "62.4k"},
    ],
    "institutions": [
        {"name": "Northbridge College", "students": 420},
        {"name": "Greenfield Institute", "students": 355},
        {"name": "State Engineering School", "students": 273},
    ],
    "alerts": [
        "2 documents require moderation review.",
        "New semester onboarding is 17% complete across departments.",
    ],
}

AI_HISTORY = [
    {"question": "Explain the difference between supervised and unsupervised learning with examples.", "answer": "Supervised learning uses labelled examples, while unsupervised learning finds patterns in unlabelled data. For example, spam classification is supervised, while customer segmentation is unsupervised."},
    {"question": "Give me a two-mark answer on SQL joins.", "answer": "A join combines rows from two tables based on related columns. Inner joins return matching rows, while left joins return all rows from the left table and matching rows from the right table."},
]

AI_ANSWER_TEMPLATE = "Based on the {subject} study context, here is a structured explanation: {message}. Start with the core idea, explain a practical example, then finish with a quick revision clue."
