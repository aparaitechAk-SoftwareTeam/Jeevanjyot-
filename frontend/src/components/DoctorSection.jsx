import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  HeartPulse,
  Leaf,
  CalendarCheck,
  ArrowRight,
  Clock,
} from "lucide-react";

import doctorImageFallback from "../assets/doctor.png";
import { useLanguage } from "../context/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function DoctorSection() {
  const { t } = useLanguage();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicDoctors = async () => {
      try {
        const response = await fetch(`${API_URL}/doctors`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.doctors) && data.doctors.length > 0) {
            setDoctors(data.doctors);
          }
        }
      } catch (err) {
        // Fallback to default doctor view on network error
      } finally {
        setLoading(false);
      }
    };

    fetchPublicDoctors();
  }, []);

  const activeDoctor = doctors[0] || {
    name: "Dr. Jeevan Atole",
    specialization: t("doctor.qualification", "B.A.M.S. - Chief Ayurvedic Physician & Panchakarma Specialist"),
    qualifications: "B.A.M.S.",
    experience: t("doctor.experienceValue", "15+ Years Clinical Practice"),
    bio: t("doctor.description", "Dr. Jeevan Atole is a renowned Ayurvedic physician specializing in Panchakarma detoxification, diabetes management, joint care, and reproductive health."),
    imageUrl: doctorImageFallback,
    consultationStartTime: "10:00 AM",
    consultationEndTime: "09:00 PM",
    consultationDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  };

  return (
    <section
      id="doctor"
      className="relative overflow-hidden bg-[#F7F3E8] py-20 sm:py-24 lg:py-28"
    >
      <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-[#789B82]/10 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#C5A45D]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">

          {/* Doctor Image */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute -inset-3 rounded-[2rem] border border-[#C5A45D]/25" />

            <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_70px_rgba(18,60,42,0.16)]">
              <img
                src={activeDoctor.imageUrl || doctorImageFallback}
                alt={activeDoctor.name}
                className="h-[480px] w-full object-cover object-center sm:h-[540px]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = doctorImageFallback;
                }}
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0B291D] via-[#0B291D]/80 to-transparent px-6 pb-6 pt-20">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A45D]">
                  {t("doctor.tag", "OUR CHIEF DOCTOR")}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {activeDoctor.name}
                </h3>
                <p className="mt-1 text-sm text-white/70">
                  {activeDoctor.specialization || t("doctor.qualification", "Ayurveda & Panchakarma Care")}
                </p>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-3 hidden rounded-2xl border border-[#C5A45D]/25 bg-white px-5 py-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123C2A] text-[#C5A45D]">
                  <Leaf size={19} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#17231C]">
                    {t("trust.item2", "Ayurvedic Care")}
                  </p>
                  <p className="text-xs text-[#66736B]">
                    {t("trust.item1", "Traditional approach")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex rounded-full border border-[#123C2A]/10 bg-[#123C2A]/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#123C2A]">
              {t("doctor.tag", "Meet Your Doctor")}
            </span>

            <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-[#123C2A] sm:text-4xl lg:text-5xl">
              {t("doctor.heading", "Meet Dr. Jeevan Atole")}
            </h2>

            <p className="mt-6 text-base leading-8 text-[#66736B]">
              {t("doctor.description", activeDoctor.bio || "Dr. Jeevan Atole is a renowned Ayurvedic physician specializing in Panchakarma detoxification, diabetes management, joint care, and reproductive health.")}
            </p>

            <p className="mt-4 italic text-sm text-[#789B82] font-serif border-l-2 border-[#C5A45D] pl-3">
              "{t("doctor.quote", "Ayurveda is not merely a treatment; it is a way of living in harmony with nature.")}"
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: HeartPulse,
                  title: t("trust.item3", "Personalized"),
                  text: t("trust.item1", "Individual-focused care"),
                },
                {
                  icon: Leaf,
                  title: t("trust.item2", "Ayurvedic"),
                  text: t("trust.item2", "Traditional wellness approach"),
                },
                {
                  icon: Award,
                  title: t("trust.item1", "Guided Care"),
                  text: t("trust.item4", "Consultation-led journey"),
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[#123C2A]/10 bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123C2A]/5 text-[#123C2A]">
                      <Icon size={19} strokeWidth={1.8} />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-[#17231C]">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#66736B]">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/book-appointment"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#123C2A] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#0B291D] hover:shadow-lg"
              >
                <CalendarCheck size={17} />
                {t("hero.bookBtn", "Book Consultation")}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="tel:9822510456"
                className="inline-flex items-center justify-center rounded-full border border-[#123C2A]/15 bg-white px-6 py-3.5 text-sm font-semibold text-[#123C2A] transition-all duration-300 hover:border-[#123C2A]/30 hover:shadow-md"
              >
                {t("hero.callBtn", "Call Clinic")} (9822510456)
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
