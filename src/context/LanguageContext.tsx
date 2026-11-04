"use client";

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from "react";
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

// ---------------------------------------------------------------------------
// Theme: persisted in localStorage. The inline <head> script in layout.tsx
// applies the "dark" class before first paint; this store only mirrors it for
// UI state (icons) and handles toggling.
// ---------------------------------------------------------------------------

const THEME_EVENT = "iknowapdf:theme";

function subscribeTheme(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

function getThemeSnapshot(): "light" | "dark" {
  try {
    return localStorage.getItem("theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function getServerThemeSnapshot(): "light" | "dark" {
  return "light";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathLang = getLangFromPath(pathname);
  // A manual override only applies to the page it was chosen on; the URL
  // (/fr, /es, /ru, /ar prefixes) otherwise decides the language, so every URL
  // serves the same language to users and crawlers.
  const [override, setOverride] = useState<{ lang: Language; path: string | null } | null>(null);
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  const activeLanguage: Language =
    (override && override.path === pathname ? override.lang : null) || pathLang || "EN";

  useEffect(() => {
    document.documentElement.dir = activeLanguage === "AR" ? "rtl" : "ltr";
    document.documentElement.lang = activeLanguage.toLowerCase();
  }, [activeLanguage]);

  // Register the service worker only after the page has fully loaded so it
  // never competes with first-load resources.
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    };
    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  const setLanguage = (lang: Language) => {
    setOverride({ lang, path: pathname });
    document.documentElement.dir = lang === "AR" ? "rtl" : "ltr";
    document.documentElement.lang = lang.toLowerCase();
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    try {
      localStorage.setItem("theme", next);
    } catch {}
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.classList.toggle("light", next === "light");
    window.dispatchEvent(new Event(THEME_EVENT));
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
