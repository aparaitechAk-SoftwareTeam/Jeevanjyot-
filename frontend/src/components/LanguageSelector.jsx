import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const LANGUAGES = [
  { code: "en", label: "English", display: "EN" },
  { code: "mr", label: "मराठी", display: "मराठी" },
  { code: "hi", label: "हिंदी", display: "हिंदी" },
];

export default function LanguageSelector({ isMobile = false }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  if (isMobile) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-white/60 p-2.5 border border-[#123C2A]/10 my-1">
        <span className="flex items-center gap-2 text-xs font-semibold text-[#123C2A]">
          <Globe size={16} className="text-[#789B82]" />
          Language / भाषा
        </span>
        <div className="flex gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                language === lang.code
                  ? "bg-[#123C2A] text-white shadow-xs"
                  : "bg-white text-[#66736B] border border-[#123C2A]/10 hover:bg-[#F7F3E8]"
              }`}
            >
              {lang.display}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Select language"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 rounded-full border border-[#123C2A]/15 bg-white/70 px-3 py-2 text-xs font-semibold text-[#123C2A] transition hover:bg-[#123C2A] hover:text-white shrink-0 focus:outline-none focus:ring-2 focus:ring-[#789B82]/40"
      >
        <Globe size={14} className="text-[#789B82]" />
        <span>{currentLangObj.display}</span>
        <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-36 rounded-2xl border border-[#123C2A]/12 bg-white p-1.5 shadow-xl shadow-[#123C2A]/10 z-[65]">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                language === lang.code
                  ? "bg-[#123C2A]/8 text-[#123C2A]"
                  : "text-[#66736B] hover:bg-[#F7F3E8] hover:text-[#123C2A]"
              }`}
            >
              <span>{lang.label}</span>
              {language === lang.code && <Check size={14} className="text-[#123C2A]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
