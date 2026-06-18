"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

// ── Knowledge Base ────────────────────────────────────────────────────────────
// Keyword → response mapping. Keys are lowercase for case-insensitive matching.
const KB: Record<string, string> = {
  "q-ecosystem":
    "I architected **Q-Ecosystem** using Next.js 14 + Turborepo — a B2B SaaS with 4 micro-apps in a monorepo. It enforces strict Row Level Security (RLS) + RBAC via Supabase, achieves sub-80ms p99 API latency, and sub-200ms FCP. Live at qrento.in 🚀",

  "qrento":
    "Q-Ecosystem (qrento.in) is a multi-tenant SaaS platform I built solo — Turborepo monorepo, 4 micro-apps, Supabase RLS, Redis caching, sub-80ms p99 latency.",

  "pawalert":
    "**PawAlert** is a Gov-Tech SaaS for real-time animal alerts. I built it with PostGIS for spatial queries, Redis + WebSockets for live syncing, handling 5,000+ concurrent connections with 99.9% webhook delivery rate. Live at pawalert.in 🐾",

  "resume builder":
    "The **AI Resume Builder** uses streaming LLMs (Gemini + OpenAI) to achieve sub-second first-token latency. It hits 92% ATS keyword extraction accuracy and reduced PDF rendering memory by 40%. Live at ai-resume-builder-theta-azure.vercel.app ✨",

  "ai resume":
    "The **AI Resume Builder** uses streaming LLMs (Gemini + OpenAI) to achieve sub-second first-token latency. It hits 92% ATS keyword extraction accuracy and reduced PDF rendering memory by 40%.",

  "leetcode":
    "Adarsh is a **LeetCode Knight** 🏅 — Peak Rating: 1867, 600+ problems solved, 300+ day streak! He specialises in Dynamic Programming, Graphs, and System Design.",

  "knight":
    "Adarsh earned the **LeetCode Knight** badge with a peak contest rating of 1867. He's solved 600+ problems and holds a 300+ day streak.",

  "rating":
    "Adarsh's peak LeetCode contest rating is **1867** (Knight tier). He competes regularly and maintains a 300+ day streak.",

  "skills":
    "Adarsh's core stack: **TypeScript, C++, Python** · **Next.js 14, React, Tailwind, Framer Motion, GSAP** · **Node.js, Express, PostgreSQL, Redis, MongoDB, WebSockets** · **Turborepo, Vercel, Oracle Cloud, LLMs (OpenAI, Gemini)**",

  "stack":
    "Full-stack: Next.js 14, TypeScript, PostgreSQL, Redis, Supabase, WebSockets, Turborepo, Vercel. Also experienced with Python, C++, and LLM APIs.",

  "experience":
    "Adarsh is a 4th-year B.Tech IT student at JSS Institute (2022–2027). He has built 3 production SaaS products (Q-Ecosystem, PawAlert, AI Resume Builder) and led the GDSC Core Web team — onboarding 500+ students.",

  "gdsc":
    "As **GDSC Core Web Lead**, Adarsh onboarded 500+ students into the developer ecosystem and led technical workshops for 200+ attendees.",

  "hire":
    "Adarsh is **actively open** to Full-Stack and Full-time SWE roles! 📧 singhadadarsh9240@gmail.com · 🔗 linkedin.com/in/adarsh-thakur-7683612a4",

  "contact":
    "Reach Adarsh at 📧 singhadadarsh9240@gmail.com or on LinkedIn: linkedin.com/in/adarsh-thakur-7683612a4. He's open to full-time & internship roles.",

  "available":
    "Yes! Adarsh is currently open to **Full-Stack** and **Backend** engineering roles — full-time or internship. Drop him an email: singhadadarsh9240@gmail.com",

  "github":
    "GitHub: github.com/adarshthakur9240 — 450+ commits, 212+ PRs, 32+ repositories. Mostly TypeScript, Next.js, and full-stack SaaS projects.",

  "project":
    "Top projects: **Q-Ecosystem** (B2B SaaS monorepo), **PawAlert** (Gov-Tech WebSockets), **AI Resume Builder** (streaming LLMs). All are live in production!",

  "certif":
    "Certifications: Oracle Cloud Infrastructure 2025 AI Foundations Associate · DeepLearning.AI: Building AI Voice Agents · Google Cloud: Intro to Generative AI",

  "oracle":
    "Adarsh holds the **Oracle Cloud Infrastructure 2025 AI Foundations Associate** certification.",

  "cgpa":
    "Adarsh's current CGPA is **7.54** at JSS Institute of Information Technology (B.Tech IT, 2022–2027).",

  "education":
    "B.Tech in Information Technology from JSS Institute of Information Technology (2022–2027). CGPA: 7.54.",
};

const DEFAULT_RESPONSE =
  "I'm Adarsh's pre-trained assistant 🤖. Try asking about **Q-Ecosystem**, **PawAlert**, **LeetCode**, **Skills**, or if he's available to **Hire**!";

// ── Keyword matcher ───────────────────────────────────────────────────────────
function getResponse(query: string): string {
  const q = query.toLowerCase();
  for (const [key, response] of Object.entries(KB)) {
    if (q.includes(key)) return response;
  }
  return DEFAULT_RESPONSE;
}

// ── Simple bold markdown renderer (handles **text**) ─────────────────────────
function RenderText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="text-white font-bold">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// ── Typing dots ───────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-green-400"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.55, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

// ── Suggestion pills ──────────────────────────────────────────────────────────
const PILLS = [
  "Tell me about Q-Ecosystem",
  "LeetCode Stats",
  "Hire Adarsh",
  "PawAlert Project",
  "Skills & Stack",
  "GitHub Activity",
];

// ── Widget ────────────────────────────────────────────────────────────────────
export function AdarshAIWidget() {
  const [isOpen, setIsOpen]     = useState(false);
  const [input, setInput]       = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "primer",
      role: "assistant",
      text: "Hi! I'm Adarsh's AI assistant 👋 Ask me anything about his experience, projects, or skills — I'm pre-trained on his resume.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 120);
  }, [isOpen]);

  // ── Core send logic ───────────────────────────────────────────────────────
  const sendQuery = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Fake 600ms "network" delay, then append hardcoded response
    setTimeout(() => {
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: getResponse(trimmed),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  }, [isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(input);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuery(input);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[250] flex flex-col items-end gap-3 select-none">

      {/* ── Chat panel ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-[360px] rounded-md border border-white/15 overflow-hidden bg-[#0a0a0a]/95 backdrop-blur-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.02] shrink-0">
              <div className="relative">
                <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 border border-black" />
              </div>
              <div>
                <p className="text-sm font-black text-white font-mono">Adarsh AI</p>
                <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-[0.2em]">
                  Static · Always Online ✓
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto text-neutral-500 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message list */}
            <div
              className="flex-1 h-64 overflow-y-auto px-4 py-4 space-y-3"
              style={{ scrollbarWidth: "none" }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[84%] rounded-md px-3.5 py-2.5 text-[12px] font-mono leading-relaxed border ${
                      msg.role === "user"
                        ? "bg-white/10 border-white/15 text-gray-300"
                        : "bg-white/5 border-white/5 text-[#FAFAFA]"
                    }`}
                  >
                    <RenderText text={msg.text} />
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-1"
                >
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/5 rounded-md">
                      <TypingDots />
                    </div>
                  </div>
                  <p className="text-[10px] text-green-400 font-mono pl-1 animate-pulse">
                    Adarsh AI is typing…
                  </p>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion pills */}
            <div
              className="px-3 pb-2 flex gap-1.5 overflow-x-auto shrink-0"
              style={{ scrollbarWidth: "none" }}
            >
              {PILLS.map((pill) => (
                <button
                  key={pill}
                  onClick={() => sendQuery(pill)}
                  disabled={isTyping}
                  className="whitespace-nowrap text-[9px] px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all font-mono shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-3 border-t border-white/10 shrink-0"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about Adarsh…"
                className="flex-1 bg-transparent text-xs text-white placeholder-neutral-700 outline-none font-mono"
                disabled={isTyping}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB toggle ────────────────────────────────────────────────────── */}
      <motion.button
        id="ai-chat-fab"
        onClick={() => setIsOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative w-14 h-14 rounded-md flex items-center justify-center bg-neutral-900 border border-white/10 text-white hover:bg-neutral-800 transition-colors duration-200 shadow-none"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        <motion.span
          className="absolute inset-0 rounded-md border border-white/20"
          animate={{ scale: [1, 1.35], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.button>

    </div>
  );
}
