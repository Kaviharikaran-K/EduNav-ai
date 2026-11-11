"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  Bell,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  ShieldCheck,
  Target,
  Upload,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const roleOptions = [
  { id: "student", label: "Student" },
  { id: "parent", label: "Parent" },
  { id: "admin", label: "Admin" },
] as const;

const workspaceTabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tutor", label: "AI Tutor", icon: BrainCircuit },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "planner", label: "Planner", icon: CalendarRange },
  { id: "progress", label: "Progress", icon: BarChart3 },
] as const;

const quickActions = [
  "Explain this concept",
  "Generate MCQs",
  "Create a 5-mark answer",
  "Recommend revision tasks",
];

const subjectOptions = ["AI", "DBMS", "Operating Systems", "Mathematics"] as const;

type DashboardMetric = { label: string; value: string; change: string; tone: string };
type ActivityItem = { day: string; hours: number };
type TaskItem = { id: number; title: string; subject: string; priority: string; deadline: string; completed: boolean };
type DocumentItem = { id: number; title: string; subject: string; category: string; size: string };
type TimetableItem = { id: number; title: string; day: string; time: string; subject: string };
type NotificationItem = { id: number; title: string; body: string; read: boolean };
type StudentDashboard = {
  welcome: string;
  academic_year: string;
  semester: string;
  metrics: DashboardMetric[];
  activity: ActivityItem[];
  tasks: TaskItem[];
  documents: DocumentItem[];
  timetable: TimetableItem[];
  notifications: NotificationItem[];
  subject_performance: { subject: string; score: number }[];
  weak_topics: string[];
};
type ParentDashboard = {
  student: string;
  overall_status: string;
  weekly_progress: { day: string; score: number }[];
  guidance: string[];
  academic_year?: string;
  metrics?: DashboardMetric[];
};
type AdminDashboard = {
  stats: { label: string; value: string }[];
  institutions: { name: string; students: number }[];
  alerts: string[];
  academic_year?: string;
  metrics?: DashboardMetric[];
};

export default function Home() {
  const [role, setRole] = useState<(typeof roleOptions)[number]["id"]>("student");
  const [activeTab, setActiveTab] = useState<(typeof workspaceTabs)[number]["id"]>("overview");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [studentData, setStudentData] = useState<StudentDashboard | null>(null);
  const [parentData, setParentData] = useState<ParentDashboard | null>(null);
  const [adminData, setAdminData] = useState<AdminDashboard | null>(null);
  const [taskData, setTaskData] = useState<TaskItem[]>([]);
  const [documentData, setDocumentData] = useState<DocumentItem[]>([]);
  const [timetableData, setTimetableData] = useState<TimetableItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [chatInput, setChatInput] = useState("Explain the key idea behind backpropagation in simple words.");
  const [chatMessages, setChatMessages] = useState([
    {
      from: "assistant",
      text: "I can help you revise your current topic. Choose a subject and ask for a concept explanation, MCQ, or practice questions.",
    },
  ]);
  const [selectedSubject, setSelectedSubject] = useState<(typeof subjectOptions)[number]>("AI");

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      try {
        const [studentRes, parentRes, adminRes, tasksRes, docsRes, timeRes, notifRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/dashboard/student"),
          fetch("http://127.0.0.1:8000/api/dashboard/parent"),
          fetch("http://127.0.0.1:8000/api/dashboard/admin"),
          fetch("http://127.0.0.1:8000/api/tasks"),
          fetch("http://127.0.0.1:8000/api/documents"),
          fetch("http://127.0.0.1:8000/api/timetable"),
          fetch("http://127.0.0.1:8000/api/notifications"),
        ]);

        const [studentJson, parentJson, adminJson, tasksJson, docsJson, timeJson, notifJson] = await Promise.all([
          studentRes.json() as Promise<StudentDashboard>,
          parentRes.json() as Promise<ParentDashboard>,
          adminRes.json() as Promise<AdminDashboard>,
          tasksRes.json() as Promise<TaskItem[]>,
          docsRes.json() as Promise<DocumentItem[]>,
          timeRes.json() as Promise<TimetableItem[]>,
          notifRes.json() as Promise<NotificationItem[]>,
        ]);

        setStudentData(studentJson);
        setParentData(parentJson);
        setAdminData(adminJson);
        setTaskData(tasksJson);
        setDocumentData(docsJson);
        setTimetableData(timeJson);
        setNotifications(notifJson);
      } catch (error) {
        console.error("Failed to fetch EduNav data:", error);
      }
    };

    loadData();
  }, [isAuthenticated]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginBusy(true);
    setLoginError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword, role }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail ?? "Sign in failed. Check your details and try again.");
      }
      setCurrentUser(result.user);
      setIsAuthenticated(true);
      setActiveTab("overview");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Unable to sign in right now.");
    } finally {
      setLoginBusy(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginPassword("");
    setActiveTab("overview");
  };

  const activeData = useMemo(() => {
    if (role === "student") return studentData;
    if (role === "parent") return parentData;
    return adminData;
  }, [adminData, parentData, role, studentData]);

  const handleSendPrompt = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { from: "user", text: chatInput };
    setChatMessages((current) => [...current, userMessage]);
    setChatInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text, subject: selectedSubject }),
      });

      const result = await response.json();
      setChatMessages((current) => [...current, { from: "assistant", text: result.answer }]);
    } catch {
      setChatMessages((current) => [
        ...current,
        { from: "assistant", text: "I’m unable to reach the tutor service right now. Please retry in a moment." },
      ]);
    }
  };

  const statCards = activeData?.metrics ?? [
    { label: "Study Hours", value: "--", change: "--", tone: "teal" },
    { label: "Tasks Completed", value: "--", change: "--", tone: "navy" },
    { label: "Quiz Performance", value: "--", change: "--", tone: "teal" },
    { label: "Learning Progress", value: "--", change: "--", tone: "slate" },
  ];

  const progressChart = studentData?.activity ?? [
    { day: "Mon", hours: 2 },
    { day: "Tue", hours: 3 },
    { day: "Wed", hours: 2.5 },
    { day: "Thu", hours: 4 },
    { day: "Fri", hours: 3 },
    { day: "Sat", hours: 2.7 },
    { day: "Sun", hours: 1.5 },
  ];

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
          <section className="flex flex-col justify-between bg-[#0b1830] p-8 text-white sm:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0d9488]">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Academic companion</p>
                <h1 className="text-xl font-semibold">EduNav AI</h1>
              </div>
            </div>
            <div className="my-12">
              <p className="mb-3 text-sm font-medium text-teal-300">Your learning, thoughtfully guided</p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">Make every study session count.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                Personalized learning tools and academic guidance for students, families, and institutions.
              </p>
            </div>
            <p className="text-xs text-slate-400">Demo access · Use any valid email and a non-empty password</p>
          </section>

          <section className="p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900">Sign in to EduNav</h2>
              <p className="mt-2 text-sm text-slate-500">Choose your account type, then continue to your workspace.</p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              <fieldset>
                <legend className="mb-2 text-sm font-medium text-slate-700">I am signing in as</legend>
                <div className="grid grid-cols-3 gap-2">
                  {roleOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setRole(option.id)}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-sm font-medium transition",
                        role === option.id
                          ? "border-[#0d9488] bg-teal-50 text-teal-800 ring-1 ring-[#0d9488]"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block text-sm font-medium text-slate-700">
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none transition focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Password
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none transition focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100"
                />
              </label>

              {loginError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{loginError}</p>}

              <button
                type="submit"
                disabled={loginBusy}
                className="w-full rounded-xl bg-[#142b4a] px-4 py-3 font-medium text-white transition hover:bg-[#0b1830] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loginBusy ? "Signing in…" : `Continue as ${roleOptions.find((option) => option.id === role)?.label}`}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-slate-500">
              Demo sign-in only. Use a valid email address and any non-empty password.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#142b4a] text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Academic companion</p>
              <h1 className="text-xl font-semibold text-slate-900">EduNav AI</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800 sm:inline-flex">Demo account</span>
            <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 sm:flex">
              <Bell className="h-4 w-4" />
              <span>{notifications.length} alerts</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0d9488] font-semibold text-white">AN</div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-slate-900">{currentUser?.name}</p>
                <p className="text-[11px] capitalize text-slate-500">{currentUser?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav aria-label="Workspace tabs" className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {workspaceTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition",
                activeTab === tab.id
                  ? "border-[#0d9488] text-[#0d9488]"
                  : "border-transparent text-slate-500 hover:text-slate-900",
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "overview" && <>
        <section id="overview" className="mb-8 rounded-3xl border border-slate-200 bg-[#0b1830] p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-slate-600 bg-slate-800 px-2.5 py-1">AI learning workspace</span>
                <span className="rounded-full border border-slate-600 bg-slate-800 px-2.5 py-1">Demo data</span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Personalized academic navigation for smarter learning.
              </h2>
              <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
                Track progress, review weak topics, access note-based tutoring, and keep students, parents, and administrators aligned in one connected ecosystem.
              </p>
            </div>

            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/30 p-4">
              <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
                <span className="font-medium text-white">Role access</span>
                <span className="rounded-full bg-[#0d9488] px-2 py-0.5 text-xs font-medium text-white">Live</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setRole(option.id)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-sm font-medium transition",
                      role === option.id
                        ? "border-[#0d9488] bg-[#0d9488]/20 text-white"
                        : "border-slate-700 bg-slate-900/30 text-slate-300 hover:border-slate-500",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card: { label: string; value: string; change: string; tone: string }) => (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    card.tone === "teal" && "bg-teal-50 text-teal-700",
                    card.tone === "navy" && "bg-slate-100 text-slate-700",
                    card.tone === "slate" && "bg-sky-50 text-sky-700",
                  )}
                >
                  {card.change}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="mb-8 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Weekly learning</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Study activity overview</h3>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{activeData?.academic_year ?? "2026-2027"}</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressChart}>
                  <defs>
                    <linearGradient id="fillColor" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="hours" stroke="#0d9488" fill="url(#fillColor)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Recommended plan</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Next actions</h3>
              </div>
              <Target className="h-5 w-5 text-[#0d9488]" />
            </div>
            <div className="space-y-4">
              {[
                { label: "Revision block", detail: "30 minutes on OS concurrency", icon: LayoutDashboard },
                { label: "Quiz practice", detail: "6 MCQs for AI model evaluation", icon: BrainCircuit },
                { label: "Document review", detail: "Open latest Neural Networks notes", icon: FileText },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-[#142b4a] text-white">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-600">{item.detail}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ai-tutor" className="mb-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.15em] text-slate-500">AI Tutor</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Concept guidance</h3>
              </div>
              <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Grounded in uploaded notes</div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {subjectOptions.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => setSelectedSubject(subject)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    selectedSubject === subject
                      ? "border-[#0d9488] bg-[#0d9488] text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300",
                  )}
                >
                  {subject}
                </button>
              ))}
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              {chatMessages.map((message, index) => (
                <div
                  key={`${message.from}-${index}`}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6",
                    message.from === "assistant"
                      ? "bg-white text-slate-700 shadow-sm"
                      : "ml-auto bg-[#142b4a] text-white",
                  )}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-0 transition focus:border-[#0d9488]"
                placeholder="Ask about concepts, questions, or revision plans"
              />
              <button
                type="button"
                onClick={handleSendPrompt}
                className="rounded-2xl bg-[#142b4a] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#0b1830]"
              >
                Ask
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => setChatInput(action)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Use cases</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">Study support</h3>
            </div>
            {[
              { title: "Quick notes", detail: "Summaries from recent lectures and uploaded material", icon: BookOpen },
              { title: "Practice quiz", detail: "Generate MCQs, 2-mark, and 5-mark questions", icon: MessageSquareText },
              { title: "Weak topic detection", detail: "Identify low-confidence performance areas", icon: ShieldCheck },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#142b4a] text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="documents" className="mb-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Document hub</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Academic materials</h3>
              </div>
              <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-[#0d9488] px-3 py-2 text-sm font-medium text-white hover:bg-[#0a7d74]">
                <Upload className="h-4 w-4" />
                Upload file
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Subject</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(documentData.length ? documentData : []).map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{doc.title}</td>
                      <td className="px-4 py-3">{doc.subject}</td>
                      <td className="px-4 py-3">{doc.category}</td>
                      <td className="px-4 py-3">{doc.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Study planner</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Timetable</h3>
              </div>
              <CalendarRange className="h-5 w-5 text-[#0d9488]" />
            </div>
            <div className="space-y-3">
              {(timetableData.length ? timetableData : []).map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{entry.title}</p>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">{entry.subject}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{entry.day}</p>
                  <p className="text-sm text-slate-600">{entry.time}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="progress" className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Progress analytics</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Subject performance</h3>
              </div>
              <BarChart3 className="h-5 w-5 text-[#142b4a]" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentData?.subject_performance ?? []}>
                  <CartesianGrid stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="subject" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#142b4a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Task flow</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Weekly momentum</h3>
              </div>
              <CheckCircle2 className="h-5 w-5 text-[#0d9488]" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={parentData?.weekly_progress ?? []}>
                  <CartesianGrid stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Tasks</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Academic to-do list</h3>
              </div>
              <BriefcaseBusiness className="h-5 w-5 text-[#142b4a]" />
            </div>
            <div className="space-y-3">
              {(taskData.length ? taskData : []).map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start gap-3">
                    <div className={cn("mt-0.5 flex h-6 w-6 items-center justify-center rounded-full", task.completed ? "bg-[#0d9488] text-white" : "bg-slate-200 text-slate-600")}>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <p className="text-sm text-slate-600">{task.subject} • {task.priority} priority</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{task.deadline}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Insights</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Signals to monitor</h3>
              </div>
              <Users className="h-5 w-5 text-[#0d9488]" />
            </div>
            <ul className="space-y-3">
              {(studentData?.weak_topics ?? ["System design review", "Math formula recap", "Database normalization"]).map((topic: string) => (
                <li key={topic} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#0d9488]" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {role === "student" && (
              <>
                <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Parent sharing</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Student-parent guidance</h3>
                <div className="mt-4 space-y-3">
                  {parentData?.guidance?.map((item: string) => (
                    <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </>
            )}

            {role === "parent" && (
              <>
                <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Parent dashboard</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Student overview</h3>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Student</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{parentData?.student}</p>
                  <p className="mt-2 text-sm text-slate-600">{parentData?.overall_status}</p>
                </div>
              </>
            )}

            {role === "admin" && (
              <>
                <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Admin overview</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Platform metrics</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(adminData?.stats ?? []).map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">{stat.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Notifications</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Updates</h3>
              </div>
              <Bell className="h-5 w-5 text-[#142b4a]" />
            </div>
            <div className="space-y-3">
              {(notifications.length ? notifications : []).map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-900">{item.title}</p>
                    {!item.read && <span className="h-2.5 w-2.5 rounded-full bg-[#0d9488]" />}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        </>}

        {activeTab === "tutor" && (
          <section id="ai-tutor" className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <p className="text-sm uppercase tracking-[0.15em] text-slate-500">AI Tutor</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">Learn with guided explanations</h2>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {subjectOptions.map((subject) => (
                  <button key={subject} type="button" onClick={() => setSelectedSubject(subject)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", selectedSubject === subject ? "border-[#0d9488] bg-[#0d9488] text-white" : "border-slate-200 bg-slate-50 text-slate-600")}>{subject}</button>
                ))}
              </div>
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {chatMessages.map((message, index) => <div key={`${message.from}-${index}`} className={cn("max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6", message.from === "assistant" ? "bg-white text-slate-700 shadow-sm" : "ml-auto bg-[#142b4a] text-white")}>{message.text}</div>)}
              </div>
              <form className="mt-4 flex gap-3" onSubmit={(event) => { event.preventDefault(); void handleSendPrompt(); }}>
                <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0d9488]" placeholder="Ask a study question" />
                <button type="submit" className="rounded-2xl bg-[#142b4a] px-4 py-3 text-sm font-medium text-white hover:bg-[#0b1830]">Ask</button>
              </form>
            </div>
          </section>
        )}

        {activeTab === "documents" && (
          <section id="documents" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Document hub</p>
            <h2 className="mb-5 mt-1 text-2xl font-semibold text-slate-900">Academic materials</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Subject</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Size</th></tr></thead>
                <tbody className="divide-y divide-slate-200">{documentData.map((doc) => <tr key={doc.id}><td className="px-4 py-3 font-medium text-slate-900">{doc.title}</td><td className="px-4 py-3">{doc.subject}</td><td className="px-4 py-3">{doc.category}</td><td className="px-4 py-3">{doc.size}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "planner" && (
          <section id="schedule" className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Study planner</p>
              <h2 className="mb-5 mt-1 text-2xl font-semibold text-slate-900">Timetable</h2>
              <div className="space-y-3">{timetableData.map((entry) => <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="font-medium text-slate-900">{entry.title}</p><p className="mt-1 text-sm text-slate-600">{entry.day} · {entry.time} · {entry.subject}</p></div>)}</div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Tasks</p>
              <h2 className="mb-5 mt-1 text-2xl font-semibold text-slate-900">Academic to-do list</h2>
              <div className="space-y-3">{taskData.map((task) => <div key={task.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="font-medium text-slate-900">{task.title}</p><p className="mt-1 text-sm text-slate-600">{task.subject} · {task.priority} priority · {task.deadline}</p></div>)}</div>
            </div>
          </section>
        )}

        {activeTab === "progress" && (
          <section id="progress" className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-semibold text-slate-900">Learning activity</h2>
              <div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={progressChart}><CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" vertical={false} /><XAxis dataKey="day" /><YAxis /><Tooltip /><Area type="monotone" dataKey="hours" stroke="#0d9488" fill="#ccfbf1" strokeWidth={3} /></AreaChart></ResponsiveContainer></div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-semibold text-slate-900">Subject performance</h2>
              <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={studentData?.subject_performance ?? []}><CartesianGrid stroke="#e2e8f0" vertical={false} /><XAxis dataKey="subject" /><YAxis /><Tooltip /><Bar dataKey="score" fill="#142b4a" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div>
              <p className="mt-4 text-sm text-slate-500">Demo data shown for illustration.</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
