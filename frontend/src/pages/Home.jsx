import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  CalendarCheck,
  ArrowRight,
  Phone,
  HeartPulse,
  Leaf,
} from "lucide-react";

import TrustHighlights from "../components/TrustHighlights";
import AboutSection from "../components/AboutSection";
import PanchakarmaSection from "../components/PanchakarmaSection";
import SpecializedCareSection from "../components/SpecializedCareSection";
import WhyChooseSection from "../components/WhyChooseSection";
import DoctorSection from "../components/DoctorSection";
import PatientJourneySection from "../components/PatientJourneySection";

import doctorImage from "../assets/doctor.png";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = "Jeevanjyot Nature Cure Ayurvedic Clinic & Panchakarma Centre";
  }, []);

  return (
    <div id="home">

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden">

        {/* Decorative background */}
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#789B82]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#C5A45D]/10 blur-3xl" />

        <div className="mx-auto grid min-h-[calc(100vh-110px)] max-w-7xl items-center gap-12 px-5 py-14 lg:grid-cols-2 lg:px-8 lg:py-20">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >

            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#789B82]/30 bg-white/70 px-4 py-2 text-sm font-medium text-[#123C2A] shadow-sm backdrop-blur">
              <Sparkles size={16} />
              {t("hero.badge", "Authentic Ayurveda & Panchakarma Care")}
            </div>

            {/* Heading */}
            <h2 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#0B291D] sm:text-5xl lg:text-6xl">
              {t("hero.titleLine1", "Restore Your Health,")}
              <span className="mt-2 block font-serif italic text-[#789B82]">
                {t("hero.titleLine2", "Naturally with Ayurveda")}
              </span>
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-7 text-[#66736B] sm:text-lg">
              {t("hero.description", "Personalized Ayurvedic and Panchakarma care focused on supporting your journey towards better health and natural wellness.")}
            </p>

            {/* Specialty chips */}
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                t("treatments.ayurvedaTitle", "Ayurveda"),
                t("treatments.panchakarmaTitle", "Panchakarma"),
                t("treatments.diabetesTitle", "Diabetes Care"),
                t("treatments.infertilityTitle", "Infertility Care"),
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#123C2A]/10 bg-white px-4 py-2 text-xs font-medium text-[#123C2A] shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/book-appointment"
                className="flex items-center justify-center gap-2 rounded-full bg-[#123C2A] px-7 py-4 font-semibold text-white shadow-xl shadow-[#123C2A]/15 transition hover:-translate-y-0.5 hover:bg-[#0B291D]"
              >
                <CalendarCheck size={18} />
                {t("hero.bookBtn", "Book Appointment")}
                <ArrowRight size={17} />
              </Link>

              <a
                href="tel:9822510456"
                className="flex items-center justify-center gap-2 rounded-full border border-[#123C2A]/15 bg-white px-7 py-4 font-semibold text-[#123C2A] transition hover:bg-[#123C2A] hover:text-white"
              >
                <Phone size={18} />
                {t("hero.callBtn", "Call Clinic")}
              </a>

            </div>

            {/* Trust line */}
            <div className="mt-9 flex items-center gap-3 text-sm text-[#66736B]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#789B82]/15 text-[#123C2A]">
                <HeartPulse size={18} />
              </div>

              <span>
                {t("hero.timing", "Mon - Sat: 10:00 AM - 9:00 PM")}
              </span>
            </div>

          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 1, y: 0, x: 0, scale: 1 }
                : { opacity: 0, y: 20, x: 20, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            transition={{
              duration: 0.85,
              ease: [0.25, 0.1, 0.25, 1.0],
            }}
            className="relative"
          >
            {/* Outer Card with Floating Motion & Hover Interaction */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? { y: 0 }
                  : { y: [0, -6, 0] }
              }
              transition={
                shouldReduceMotion
                  ? {}
                  : {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
              whileHover={
                shouldReduceMotion
                  ? {}
                  : { scale: 1.015, y: -2 }
              }
              className="group relative overflow-hidden rounded-[2.5rem] border border-[#123C2A]/10 bg-gradient-to-tr from-[#123C2A] via-[#0B291D] to-[#789B82] p-3 shadow-2xl transition-shadow duration-500 hover:shadow-[0_25px_60px_rgba(11,41,29,0.25)]"
            >
              {/* Image Container with Depth Hover Zoom */}
              <div className="overflow-hidden rounded-[2rem]">
                <img
                  src={doctorImage}
                  alt="Doctor at Jeevanjyot Clinic"
                  className="h-[430px] w-full rounded-[2rem] object-cover sm:h-[500px] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>

              {/* Bottom Overlay Card with Layered Entrance */}
              <motion.div
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 15 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.25,
                  ease: "easeOut",
                }}
                className="absolute inset-x-7 bottom-7 rounded-2xl border border-white/20 bg-[#0B291D]/85 p-5 text-white shadow-xl backdrop-blur-md"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A45D]">
                  Jeevanjyot
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  Nature Cure Ayurvedic Clinic
                </h3>

                <p className="mt-1 text-sm text-white/70">
                  Panchakarma &bull; Diabetes &bull; Infertility Care
                </p>

              </motion.div>
            </motion.div>

            {/* Floating Experience Badge */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 15 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 1, y: [0, -6, 0] }
              }
              transition={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: { duration: 0.7, delay: 0.35 },
                      y: {
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.8,
                      },
                    }
              }
              className="absolute -bottom-10 -left-6 hidden rounded-2xl border border-white bg-white p-4 shadow-xl sm:block sm:-left-8 lg:-left-12 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#789B82]/15 text-[#123C2A]">
                  <Leaf size={21} />
                </div>

                <div>
                  <p className="text-xs text-[#66736B]">
                    {t("about.stat3Label", "Expert Doctors")}
                  </p>

                  <p className="text-sm font-bold text-[#123C2A]">
                    {t("about.stat3Value", "15+ Yrs")} Practice
                  </p>
                </div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* Structured Home Sections */}
      <TrustHighlights />
      <AboutSection />
      <SpecializedCareSection />
      <PanchakarmaSection />
      <WhyChooseSection />
      <DoctorSection />
      <PatientJourneySection />

      {/* Home Final Call to Action */}
      <section className="bg-[#123C2A] py-16 text-center text-white">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            {t("journey.heading", "Ready to Start Your Ayurvedic Wellness Journey?")}
          </h2>
          <p className="mt-4 text-sm text-white/70 sm:text-base">
            {t("appointment.subtitle", "Book a consultation with Dr. Jeevan Atole today.")}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/book-appointment"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C5A45D] px-7 py-3.5 text-sm font-semibold text-[#0B291D] shadow-lg transition hover:bg-[#d4b66f]"
            >
              <CalendarCheck size={18} />
              {t("hero.bookBtn", "Book Appointment")}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              {t("nav.contact", "Contact Clinic")}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
