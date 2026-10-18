"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DICTIONARY, Language, Translations } from "@/lib/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "EN",
  setLanguage: () => {},
  t: DICTIONARY.EN,
  isRTL: false,
  theme: "light",
  toggleTheme: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("lang") as Language | null;
        if (saved && DICTIONARY[saved]) return saved;
      } catch {}
    }
    return "EN";
  });
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        if (savedTheme === "dark") return "dark";
      } catch {}
    }
    return "light";
  });

  // Client hydration sync from localStorage
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem("lang") as Language | null;
        if (saved && DICTIONARY[saved]) {
          setLanguageState(saved);
        }
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        if (savedTheme === "dark" || savedTheme === "light") {
          setThemeState(savedTheme);
        }
      } catch {}
    });
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === "AR" ? "rtl" : "ltr";
    document.documentElement.lang = language.toLowerCase();
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }

    // Register Offline PWA Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, [language, theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("lang", lang);
    } catch {}
    document.documentElement.dir = lang === "AR" ? "rtl" : "ltr";
    document.documentElement.lang = lang.toLowerCase();
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setThemeState(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const t = DICTIONARY[language] || DICTIONARY.EN;
  const isRTL = language === "AR";

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, isRTL, theme, toggleTheme }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
