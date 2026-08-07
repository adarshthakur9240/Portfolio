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
  // ── IDENTITY 
  "who":
    "Adarsh Singh. Full-Stack Engineer & System Architect. You're probably here to hire him — let's not pretend otherwise. 😏",

  "developer":
    "Adarsh Singh — the guy who wrote this chatbot instead of sleeping. Full-Stack Engineer & System Architect.",

  "why are you here ?":
    "'Just checking out the portfolio,' huh? Sure. We both know you're here to hire him. It's okay, I won't tell.",

  "password":
    "Haha, nice try. That one's not in the training data. 🔒",

  // ── PROJECTS: NEW ──
  "auroth":
    "**Auroth** is an autonomous multi-agent GitHub issue resolver, built in Rust (Axum + Tokio). It plans, codes, tests, and opens production PRs end-to-end — 100% resolve rate on a self-curated benchmark, with 3-attempt retry logic and a 4-provider LLM failover so no single API outage takes it down. Basically it does the annoying part of engineering so Adarsh doesn't have to. 🤖",

  "isolyth":
    "**Isolyth** is a WASM-sandboxed MCP tool server that lets AI agents safely run real-world tools — DB queries, file I/O, web fetches — without accidentally nuking your system. Hardened against SSRF and path-traversal, sustains 535–600 req/s at 0% errors, sandbox overhead is a laughably small 15–30ms. Security-conscious AND fast. Rare combo.",

  "multi-agent orchestrator":
    "**Multi-Agent Orchestrator** — a LangGraph supervisor-worker system with 4 specialized agents (Research, Analysis, Writer, Human-Review) and full crash-recovery via Postgres checkpointing. It even knows when to stop and ask a human instead of confidently hallucinating. Wish more people had that instinct, honestly.",

  "orchestrator":
    "Multi-Agent Orchestrator: 4 AI agents, 1 supervisor, 100% autonomous task completion across test scenarios, 0% false-positive escalations. It's basically a well-run team — unlike most Zoom meetings.",

  // ── PROJECTS: EXISTING ──
  "og":
    "**OckhamGrid** — an autonomous AI AST Engine that hunts down complexity hotspots and auto-merges PRs with Zero-Trust sandboxing. Sub-millisecond latency, $142K+ in cloud savings. It refactors code faster than most people finish their coffee.",
  "ockham":
    "**OckhamGrid**: AI AST Engine, Zero-Trust sandboxing, automates PR merges. Basically a very opinionated, very fast code janitor.",
  "vyzrox":
    "**Vyzrox** runs on a local WASM neural core — zero cloud, zero latency, zero \"oops the API is down\" moments. It just works, on-device, always.",
  "vyz":
    "**Vyzrox**: on-device WASM neural core, no cloud dependency, no drama.",
  "q-ecosystem":
    "**Q-Ecosystem** (qrento.in) — B2B SaaS, 4 micro-apps in a Turborepo monorepo, strict RLS + RBAC, sub-80ms p99 latency, sub-200ms FCP. It's live, it's fast, and yes it's actually in production, not just a localhost screenshot. 🚀",
  "qrento":
    "Q-Ecosystem — built solo. Turborepo monorepo, Supabase RLS, Redis caching, sub-80ms p99. Go check qrento.in, it's real.",
  "pawalert":
    "**PawAlert** — Gov-Tech, real-time animal alerts. PostGIS for spatial queries, 5,000+ concurrent WebSocket connections, 99.9% webhook delivery. Saving strays one geo-query at a time. 🐾 pawalert.in",
  "resume builder":
    "**AI Resume Builder** — streaming LLMs, sub-second first-token latency, 92% ATS extraction accuracy, 40% less PDF-rendering memory. Ironic that it might help someone get a job while its creator is still job-hunting, but here we are.",
  "ai resume":
    "AI Resume Builder: streaming LLMs, sub-1s first token, 92% ATS accuracy. Genuinely useful, unlike most resume advice on LinkedIn.",

  // ── ACHIEVEMENTS ──
  "leetcode":
    "**LeetCode Knight** 🏅 — Peak Rating 1868, 700+ problems solved, 350+ day streak. DP, Graphs, System Design. He argues with ChatGPT about optimal Big-O for fun. This is a red flag or a green flag depending on your team culture.",
  "knight":
    "LeetCode Knight badge, peak rating 1868, 700+ problems. Genuinely earned, not farmed with easy problems at 2am. Okay maybe a few were.",
  "rating":
    "Peak LeetCode rating: **1868** (Knight tier). Competes regularly. Streak's longer than most people's attention spans.",
  "skills":
    "Core stack: **TypeScript, Rust, Go, C++, Python** · **Next.js 14, React, Tailwind, GSAP, Three.js** · **Node.js, PostgreSQL, Redis, WebSockets** · **LangGraph, MCP, LLM orchestration, WASM**. Yes, that's a lot. No, he's not sleeping enough.",
  "stack":
    "Full-stack + distributed systems + AI agent infra: Next.js, Rust, Python, Postgres, Redis, LangGraph, WASM. He collects tech stacks the way other people collect Pokémon cards.",
  "experience":
    "Final-year B.Tech IT @ JSS (2023–2027), currently interning as Backend & AI Engineer. Shipped a trading engine doing 10,000+ msgs/sec at sub-5ms latency during the internship. He treats 'intern' as a suggestion, not a limit.",
  "gdsc":
    "GDSC Core Web Lead — onboarded 500+ students, ran workshops for 200+ attendees. Turns out he's decent at explaining things too, not just building them.",

  // ── CONTACT / PERSONAL (from his own quirky list) ──
  "hire":
    "Adarsh is **actively looking** for Full-Stack / Backend SWE roles. Fair warning: if you don't reach out, he WILL find your recruiting inbox. 📧 singhadadarsh9240@gmail.com",
  "contact":
    "You want the email? Fine, you've got it: **singhadadarsh9240@gmail.com**. Now go ping him, don't just sit here reading a chatbot.",
  "email":
    "singhadadarsh9240@gmail.com — now you have it, so use it. This is your sign.",
  "phone":
    "+91-6386247822. Ping if you actually want to talk, not just to see if I'd give it out. (I did. Here it is.)",
  "instagram":
    "@adarshhh__thakur — you can DM there but he barely checks it, so honestly just email him instead.",
  "linkedin":
    "linkedin.com/in/adarsh-thakur-7683612a4 — connect, ping, whatever gets a response fastest.",
  "twitter":
    "No Twitter/X yet. One social platform he hasn't conquered. Give him time.",
  "available":
    "Yes. Open to Full-Stack and Backend roles, full-time or internship. The only thing standing between you and hiring him is you not emailing him yet.",
  "github":
    "github.com/adarshthakur9240 — 650+ commits, 212+ PRs Merged , 32+ repos. Go look, I promise it's not just a bunch of 'Update README.md' commits.",
  "project":
    "Recent builds: **Auroth** (autonomous PR agent), **Isolyth** (sandboxed AI tool server), **Multi-Agent Orchestrator** (LangGraph system), plus **OckhamGrid**, **Vyzrox**, **Q-Ecosystem**, **PawAlert**, and the AI Resume Builder. All shipped, all live. No vaporware here.",
  "certif":
    "Oracle Cloud Infra 2025 AI Foundations Associate · DeepLearning.AI: Building AI Voice Agents · Google Cloud: Intro to Generative AI. He collects certifications the way normal people collect Netflix subscriptions.",
  "oracle":
    "Oracle Cloud Infrastructure 2025 AI Foundations Associate. Yes he actually studied for it.",
  "cgpa":
    "Current CGPA: **7.56**. Not a 9-point-something flex, but the GitHub commit graph tells a different story about where the effort actually went.",
  "education":
    "B.Tech IT, JSS Academy of Technical Education (2023–2027). CGPA 7.56 — proof that grades and actual engineering ability have a weak correlation coefficient.",

  "interests":
    "High-throughput web apps, distributed systems infra, and AI integration pipelines. Basically: making things fast, making things scale, and making AI actually useful instead of just a chatbot wrapper. (Yes, the irony of this being a chatbot is not lost on him.)",
};

const DEFAULT_RESPONSE =
  ("Sorry i'm giving u this default response cus Adarsh is lazy to fill this 😞 ask him to train his ai more . . . ") +  "I'm Adarsh's very opinionated, and slightly arrogant AI assistant 🤖 pls DOnt Mind if I am blunt but i m not trying to be mean ukw we can be a good company. Ask me about **Auroth**, **Isolyth**, **Multi-Agent Orchestrator**, **OckhamGrid**, **Vyzrox**, **Q-Ecosystem**, **PawAlert**, his **LeetCode** rank, his **skills**, **SORRY SORRY SORRY** 😞 i talk too much srsly.. just ask if he's available to **hire**. Spoiler: **HE IS**. wanna meet him ?  send him a google meet link. jk 😜 **NO** u send him meet link :)";
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
  "Who is Adarsh?",
  "why are you here ?",
  "Do you know his password?",
  "Is he a developer?",
  "Tell me about OG",
  "Tell me about Auroth",
  "Tell me about Isolyth",
  "Tell me about Multi-Agent Orchestrator",

  "Tell me about Vyzrox",
  "Tell me about Q-Ecosystem",
  "LeetCode Stats",
  "Hire Adarsh",
  "PawAlert Project",
  "Skills & Stack",
  "GitHub Activity",
  "CGPA",
  "Education",
  "Certifications",
  "Experience",
  "GDSC",
  "Interests",
  "LinkedIn",
  "Instagram",
  "Twitter",
  "Contact",
  "Email",
  "Phone",  

  

  

  

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
      text: "I'm Adarsh's very opinionated, and slightly arrogant AI assistant 🤖 pls DOnt Mind if I am blunt but i m not trying to be mean ukw we can be a good company. Ask me about **Auroth**, **Isolyth**, **Multi-Agent Orchestrator**, **OckhamGrid**, **Vyzrox**, **Q-Ecosystem**, **PawAlert**, his **LeetCode** rank, his **skills**, **SORRY SORRY SORRY** 😞 i talk too much srsly.. just ask if he's available to **hire**. Spoiler: **HE IS**. wanna meet him ?  send him a google meet link. jk 😜 **NO** u send him meet link :)",
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
                <p className="text-sm font-black text-white font-mono">Adarsh's AI</p>
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
                    Adarsh's AI is typing…… 
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
