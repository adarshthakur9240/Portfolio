"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface TerminalContextType {
  isTerminalActive: boolean;
  setTerminalActive: (active: boolean) => void;
  toggleTerminal: () => void;
}

const TerminalContext = createContext<TerminalContextType>({
  isTerminalActive: false,
  setTerminalActive: () => {},
  toggleTerminal: () => {},
});

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [isTerminalActive, setTerminalActive] = useState(false);

  const toggleTerminal = useCallback(() => {
    setTerminalActive((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Listen for Ctrl + ` (backtick) or Ctrl + ~ (tilde)
      if (e.ctrlKey && (e.key === "`" || e.key === "~")) {
        e.preventDefault();
        toggleTerminal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleTerminal]);

  return (
    <TerminalContext.Provider
      value={{
        isTerminalActive,
        setTerminalActive,
        toggleTerminal,
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  return useContext(TerminalContext);
}
