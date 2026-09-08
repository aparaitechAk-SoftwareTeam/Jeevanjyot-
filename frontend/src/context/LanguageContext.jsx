import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import mr from "../locales/mr.json";
import hi from "../locales/hi.json";

const translations = { en, mr, hi };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem("jeevanjyot_language");
    return ["en", "mr", "hi"].includes(saved) ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem("jeevanjyot_language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang) => {
    if (["en", "mr", "hi"].includes(lang)) {
      setLanguageState(lang);
    }
  };

  const t = (keyPath, defaultText = "") => {
    if (!keyPath) return defaultText;

    const keys = keyPath.split(".");
    
    // 1. Try selected language
    let current = translations[language];
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        current = null;
        break;
      }
    }

    if (current && typeof current === "string") {
      return current;
    }

    // 2. Fallback to English
    current = translations["en"];
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        current = null;
        break;
      }
    }

    if (current && typeof current === "string") {
      return current;
    }

    // 3. Fallback to defaultText or key
    return defaultText || keys[keys.length - 1] || keyPath;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
