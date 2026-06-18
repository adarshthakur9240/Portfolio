"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTerminal } from "@/context/TerminalContext";
import { useCyberSounds } from "@/hooks/useCyberSounds";

interface HistoryEntry {
  type: "input" | "output" | "error";
  text: string;
}

const COMMANDS: Record<string, string> = {
  help: `AVAILABLE COMMANDS:
  whoami             - Display raw system architect profile
  cat stats.txt      - Display competitive programming telemetry
  sudo run hire_me.sh- Initiate recruiter contact sequence
  clear              - Clear terminal display buffer
  exit               - Deactivate terminal override and restore UI`,

  whoami: `{
  "developer": "Adarsh Singh",
  "role": "Full-Stack Architect & System Architect",
  "education": "JSS Academy of Technical Education",
  "interests": [
    "High-Throughput Webapps",
    "Distributed Systems Infrastructure",
    "AI Integration Pipelines"
  ],
  "technical_core": {
    "languages": ["TypeScript", "C++", "Python", "SQL"],
    "frameworks": ["Next.js", "React", "Node.js"],
    "databases": ["PostgreSQL (PostGIS)", "Redis", "MongoDB"],
    "tools": ["Turborepo", "WebSockets", "GSAP", "Docker"]
  },
  "status": "ready_for_dispatch"
}`,

  "cat stats.txt": `[FILE READ]: stats.txt
--------------------------------------------------
COMPETITIVE PROGRAMMING TELEMETRY:
  Peak Rating        : 1637
  LeetCode Status    : Knight
  Problems Solved    : More than 600 Problems Solved
  Active Streak      : More than 300 Days
  Last Synced        : 2026-06-18
--------------------------------------------------`,
};

const BOOT_LINES = [
  "PORTFOLIO OS v3.0 // SYSTEM OVERRIDE ACTIVE",
  "KERNEL: NEXT14-RUNTIME // ARCH: ARM64",
  "DEVICES: SOUND=READY GRAPHICS=SUSPENDED WEBGL=HALTED",
  'Type "help" to list available commands.',
  "",
];

export function TerminalOverride() {
  const { isTerminalActive, setTerminalActive } = useTerminal();
  const { playClick, playWhoosh, playDataScan } = useCyberSounds();

  const [history, setHistory] = useState<HistoryEntry[]>(
    BOOT_LINES.map((t) => ({ type: "output", text: t }))
  );
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Play a sound when opening terminal
  useEffect(() => {
    if (isTerminalActive) {
      playDataScan();
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isTerminalActive, playDataScan]);

  // Keep terminal focused on click
  const handleTerminalClick = () => {
    if (!isExecuting) {
      inputRef.current?.focus();
    }
  };

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      const normalizedCmd = cmd.toLowerCase();
      if (!cmd) return;

      setCmdHistory((prev) => [raw, ...prev]);
      setHistIdx(-1);

      // Append command prompt line to history
      setHistory((h) => [...h, { type: "input", text: `guest@adarsh:~$ ${raw}` }]);

      if (normalizedCmd === "clear") {
        setHistory([]);
        return;
      }

      if (normalizedCmd === "exit") {
        setHistory((h) => [...h, { type: "output", text: "Restoring cinematic graphical shell..." }]);
        playWhoosh();
        setTimeout(() => setTerminalActive(false), 500);
        return;
      }

      if (normalizedCmd === "sudo run hire_me.sh") {
        setIsExecuting(true);
        playDataScan();

        setHistory((h) => [
          ...h,
          { type: "output", text: "INITIATING RECRUITER CONTACT PROTOCOL..." },
          { type: "output", text: "Downloading payload: hire_me.sh [░░░░░░░░░░░░░░░░░░░░] 0%" },
        ]);

        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress > 100) {
            clearInterval(interval);
            setHistory((h) => {
              const next = [...h];
              next[next.length - 1] = {
                type: "output",
                text: "Downloading payload: hire_me.sh [████████████████████] 100% (COMPLETE)",
              };
              next.push({ type: "output", text: "Connecting to singhadadarsh9240@gmail.com..." });
              return next;
            });
            playWhoosh();

            setTimeout(() => {
              window.location.href = "mailto:singhadadarsh9240@gmail.com";
              setIsExecuting(false);
            }, 600);
          } else {
            const totalBlocks = 20;
            const filledBlocks = Math.round((progress / 100) * totalBlocks);
            const emptyBlocks = totalBlocks - filledBlocks;
            const barStr = "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);

            setHistory((h) => {
              const next = [...h];
              next[next.length - 1] = {
                type: "output",
                text: `Downloading payload: hire_me.sh [${barStr}] ${progress}%`,
              };
              return next;
            });
          }
        }, 120);
        return;
      }

      const output = COMMANDS[normalizedCmd];
      if (output) {
        playDataScan();
        setHistory((h) => [...h, { type: "output", text: output }]);
      } else {
        setHistory((h) => [
          ...h,
          {
            type: "error",
            text: `Command not found: "${raw}". Type "help" for available commands.`,
          },
        ]);
      }
    },
    [playDataScan, playWhoosh, setTerminalActive]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    playClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Backspace" || e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === " ") {
      playClick();
    }

    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIdx = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(nextIdx);
      setInput(cmdHistory[nextIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIdx = Math.max(histIdx - 1, -1);
      setHistIdx(nextIdx);
      setInput(nextIdx === -1 ? "" : cmdHistory[nextIdx] ?? "");
    }
  };

  return (
    <>
      {/* Subtle override hint pill at bottom-left of screen when terminal is closed */}
      <AnimatePresence>
        {!isTerminalActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed left-8 bottom-8 z-[150] px-3 py-1.5 bg-[#050505]/90 border border-[#FAFAFA]/10 text-[10px] font-mono text-neutral-500 pointer-events-none select-none"
          >
            CTRL + ` FOR SYSTEM OVERRIDE
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Override Terminal */}
      <AnimatePresence>
        {isTerminalActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={handleTerminalClick}
            className="fixed inset-0 z-[9999] bg-[#050505] text-[#FAFAFA] font-mono p-6 md:p-12 overflow-y-auto flex flex-col rounded-none border-none shadow-none cursor-text select-text"
          >
            {/* Command History Buffer */}
            <div className="space-y-3 mb-6 pr-2 select-text">
              {history.map((entry, idx) => (
                <pre
                  key={idx}
                  className={`whitespace-pre-wrap break-words leading-relaxed text-xs md:text-sm font-mono border-none shadow-none rounded-none p-0 bg-transparent ${
                    entry.type === "input"
                      ? "text-[#FAFAFA] font-bold"
                      : entry.type === "error"
                      ? "text-neutral-500"
                      : "text-neutral-300"
                  }`}
                >
                  {entry.text}
                </pre>
              ))}
            </div>

            {/* Input CLI Row */}
            <div className="flex items-center text-xs md:text-sm font-mono relative shrink-0">
              <span className="text-neutral-500 mr-2 shrink-0 select-none">
                guest@adarsh:~$
              </span>
              
              {/* Fake displayed input text and blinking block cursor */}
              <div className="flex-1 flex items-center overflow-hidden">
                <span className="text-[#FAFAFA] whitespace-pre break-all">
                  {input}
                </span>
                
                {/* Blinking Block Cursor █ */}
                <span className="inline-block bg-[#FAFAFA] w-2 h-4 shrink-0 align-middle ml-0.5 terminal-cursor" />
              </div>

              {/* Hidden absolute input taking keyboard input */}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isExecuting}
                className="absolute inset-0 opacity-0 pointer-events-none w-0 h-0"
                autoComplete="off"
                spellCheck={false}
                autoFocus
              />
            </div>

            {/* Dummy div at the very end of the output list to scroll to */}
            <div ref={bottomRef} className="h-4 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
