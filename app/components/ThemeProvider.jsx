"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {}, isDark: false });

export function useTheme() {
  return useContext(ThemeContext);
}

function getAutoTheme() {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [manualOverride, setManualOverride] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("aiforj-theme");
    const override = localStorage.getItem("aiforj-theme-manual");

    if (override === "true" && saved) {
      setTheme(saved);
      setManualOverride(true);
    } else {
      setTheme(getAutoTheme());
    }
  }, []);

  // Auto-update theme based on system preference (only if no manual override)
  useEffect(() => {
    if (manualOverride) return;
    if (!window.matchMedia) return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setTheme(query.matches ? "dark" : "light");
    updateTheme();
    query.addEventListener?.("change", updateTheme);
    return () => query.removeEventListener?.("change", updateTheme);
  }, [manualOverride]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("aiforj-theme", next);
      localStorage.setItem("aiforj-theme-manual", "true");
      setManualOverride(true);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}
