"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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

function getLangFromPath(pathname: string | null): Language | null {
  if (!pathname) return null;
  const seg = pathname.split("/")[1]?.toUpperCase();
  if (seg && seg in DICTIONARY) return seg as Language;
  return null;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathLang = getLangFromPath(pathname);
  const [userLang, setUserLang] = useState<Language>("EN");
  const [overrideLang, setOverrideLang] = useState<Language | null>(null);
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  // Reset explicit override when user navigates to a new route
  useEffect(() => {
    setOverrideLang(null);
  }, [pathname]);

  // Read saved language/theme from localStorage on client
  useEffect(() => {
    try {
      if (!pathLang) {
        const saved = localStorage.getItem("lang") as Language | null;
        if (saved && DICTIONARY[saved]) {
          setUserLang(saved);
        }
      }
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      if (savedTheme === "dark" || savedTheme === "light") {
        setThemeState(savedTheme);
      }
    } catch {}
  }, [pathLang]);

  // Synchronously determine active language during SSG/build and client render
  const activeLanguage: Language = overrideLang || pathLang || userLang;

  useEffect(() => {
    document.documentElement.dir = activeLanguage === "AR" ? "rtl" : "ltr";
    document.documentElement.lang = activeLanguage.toLowerCase();
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, [activeLanguage, theme]);

  const setLanguage = (lang: Language) => {
    setOverrideLang(lang);
    setUserLang(lang);
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

  const t = DICTIONARY[activeLanguage] || DICTIONARY.EN;
  const isRTL = activeLanguage === "AR";

  return (
    <LanguageContext.Provider
      value={{ language: activeLanguage, setLanguage, t, isRTL, theme, toggleTheme }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
