"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DICTIONARY, Language, Translations } from "@/lib/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "EN",
  setLanguage: () => {},
  t: DICTIONARY.EN,
  isRTL: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("EN");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language | null;
    if (saved && DICTIONARY[saved]) {
      setLanguageState(saved);
      document.documentElement.dir = saved === "AR" ? "rtl" : "ltr";
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lang", lang);
    document.documentElement.dir = lang === "AR" ? "rtl" : "ltr";
  };

  const t = DICTIONARY[language] || DICTIONARY.EN;
  const isRTL = language === "AR";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}