import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  MoreHorizontal,
  UserRound,
  Lock,
  CalendarCheck,
} from "lucide-react";

import logo from "../assets/logo.png";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setMoreMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMoreMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenu(false);
    setMoreMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { key: "home", label: t("nav.home", "Home"), path: "/" },
    { key: "about", label: t("nav.about", "About"), path: "/about" },
    { key: "treatments", label: t("nav.treatments", "Treatments"), path: "/treatments" },
    { key: "panchakarma", label: t("nav.panchakarma", "Panchakarma"), path: "/panchakarma" },
    { key: "doctor", label: t("nav.doctor", "Doctor"), path: "/doctor" },
    { key: "knowledgeCenter", label: t("nav.knowledgeCenter", "Knowledge Center"), path: "/knowledge-center" },
    { key: "gallery", label: t("nav.gallery", "Gallery"), path: "/gallery" },
    { key: "contact", label: t("nav.contact", "Contact"), path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#123C2A]/10 bg-[#F7F3E8]/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-[82px] max-w-[1440px] w-full items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src={logo}
            alt="Jeevanjyot Logo"
            className="h-12 w-12 sm:h-14 sm:w-14 object-contain shrink-0"
          />

          <div className="hidden sm:block shrink-0">
            <h1 className="text-lg font-bold tracking-tight text-[#123C2A] leading-tight">
              Jeevanjyot
            </h1>

            <p className="text-[10px] leading-tight text-[#66736B] whitespace-nowrap">
              {t("footer.brandSub", "Nature Cure Ayurvedic Clinic & Panchakarma Centre")}
            </p>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden lg:flex items-center gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 shrink-0">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `text-xs xl:text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? "text-[#123C2A] font-bold border-b-2 border-[#123C2A] pb-0.5"
                    : "text-[#66736B] hover:text-[#123C2A]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">

          {/* Language Selector */}
          <LanguageSelector />

          {/* Book Appointment CTA */}
          <Link
            to="/book-appointment"
            className="flex items-center gap-1.5 rounded-full bg-[#123C2A] px-4.5 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#123C2A]/15 transition hover:bg-[#0B291D] whitespace-nowrap shrink-0"
          >
            {t("nav.bookAppointment", "Book Appointment")}
            <ArrowRight size={15} />
          </Link>

          {/* 3-Dot More Menu (Last Item) */}
          <div className="relative shrink-0" ref={moreMenuRef}>
            <button
              type="button"
              onClick={() => setMoreMenuOpen((prev) => !prev)}
              aria-label={t("nav.moreOptions", "More Options")}
              aria-expanded={moreMenuOpen}
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#123C2A]/15 transition shrink-0 focus:outline-none focus:ring-2 focus:ring-[#789B82]/40 ${
                moreMenuOpen
                  ? "bg-[#123C2A] text-white"
                  : "bg-white/80 text-[#123C2A] hover:bg-[#123C2A] hover:text-white"
              }`}
            >
              <MoreHorizontal size={18} />
            </button>

            {moreMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2.5 w-48 rounded-2xl border border-[#123C2A]/12 bg-white p-1.5 shadow-xl shadow-[#123C2A]/10 z-[60]"
              >
                <Link
                  to="/patient/login"
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#123C2A] transition hover:bg-[#F7F3E8]"
                >
                  <UserRound size={15} className="text-[#789B82]" />
                  {t("nav.patientPortal", "Patient Portal")}
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#123C2A] transition hover:bg-[#F7F3E8]"
                >
                  <Lock size={15} className="text-[#789B82]" />
                  {t("nav.adminLogin", "Admin Login")}
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenu(!mobileMenu)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#123C2A]/15 text-[#123C2A] lg:hidden shrink-0"
        >
          {mobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-[#123C2A]/10 bg-[#F7F3E8] px-5 py-5 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            <LanguageSelector isMobile={true} />

            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setMobileMenu(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#123C2A] text-white font-semibold"
                      : "text-[#66736B] hover:bg-white hover:text-[#123C2A]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <Link
              to="/patient/login"
              onClick={() => setMobileMenu(false)}
              className="mt-2 flex items-center justify-center rounded-full border border-[#123C2A]/15 bg-[#123C2A]/5 px-5 py-3.5 font-semibold text-[#123C2A] transition hover:bg-[#123C2A] hover:text-white"
            >
              {t("nav.patientPortal", "Patient Portal")}
            </Link>

            <Link
              to="/admin/login"
              onClick={() => setMobileMenu(false)}
              className="mt-2 flex items-center justify-center rounded-full border border-[#123C2A]/15 bg-white px-5 py-3.5 font-semibold text-[#123C2A] transition hover:bg-[#123C2A] hover:text-white"
            >
              {t("nav.adminLogin", "Admin Login")}
            </Link>

            <Link
              to="/book-appointment"
              onClick={() => setMobileMenu(false)}
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#123C2A] px-5 py-3.5 font-semibold text-white"
            >
              <CalendarCheck size={18} />
              {t("nav.bookAppointment", "Book Appointment")}
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
