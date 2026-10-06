import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf,
  Sparkles,
  HeartPulse,
  Flower2,
  Activity,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function TreatmentSection() {
  const { t } = useLanguage();
  const [dbTreatments, setDbTreatments] = useState([]);

  useEffect(() => {
    const fetchPublicTreatments = async () => {
      try {
        const response = await fetch(`${API_URL}/treatments`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.treatments) && data.treatments.length > 0) {
            setDbTreatments(data.treatments);
          }
        }
      } catch (err) {
        // Fallback to defaultTreatments on network issue
      }
    };

    fetchPublicTreatments();
  }, []);

  const defaultTreatments = [
    {
      icon: Leaf,
      number: "01",
      title: t("treatments.ayurvedaTitle", "Ayurvedic Care"),
      description: t("treatments.ayurvedaDesc", "Personalized Ayurvedic guidance based on individual health and wellness needs."),
    },
    {
      icon: Sparkles,
      number: "02",
      title: t("treatments.panchakarmaTitle", "Panchakarma"),
      description: t("treatments.panchakarmaDesc", "Traditional Panchakarma care designed around a personalized treatment approach."),
    },
    {
      icon: Activity,
      number: "03",
      title: t("treatments.diabetesTitle", "Diabetes Care"),
      description: t("treatments.diabetesDesc", "Ayurvedic wellness support with personalized lifestyle and care guidance."),
    },
    {
      icon: HeartPulse,
      number: "04",
      title: t("treatments.infertilityTitle", "Infertility Care"),
      description: t("treatments.infertilityDesc", "Personalized Ayurvedic care focused on reproductive wellness and overall health."),
    },
    {
      icon: Flower2,
      number: "05",
      title: t("specialized.jointCare", "Joint & Spine Care"),
      description: t("treatments.ayurvedaDesc", "A natural approach combining traditional wellness principles with healthy living."),
    },
    {
      icon: Stethoscope,
      number: "06",
      title: t("specialized.skinCare", "Skin & Allergy Care"),
      description: t("hero.description", "Individual guidance focused on long-term wellness, lifestyle and follow-up care."),
    },
  ];

  const displayList =
    dbTreatments.length > 0
      ? dbTreatments.map((tItem, idx) => ({
          icon: tItem.category === "Panchakarma" ? Sparkles : Leaf,
          number: String(idx + 1).padStart(2, "0"),
          title: tItem.name,
          description: tItem.description,
        }))
      : defaultTreatments;

  return (
    <section
      id="treatments"
      className="relative overflow-hidden bg-[#F7F3E8] py-24 sm:py-28"
    >
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#789B82]/10 blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#C5A45D]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#789B82]">
            {t("treatments.tag", "Our Treatments")}
          </span>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#123C2A] sm:text-5xl">
            {t("treatments.heading", "Care Designed Around Your Wellness")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#66736B] sm:text-lg">
            {t("treatments.subtitle", "Explore our Ayurvedic and Panchakarma-focused care services, thoughtfully designed around individual wellness needs.")}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayList.map((treatment, index) => {
            const Icon = treatment.icon || Leaf;

            return (
              <motion.div
                key={treatment.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -7 }}
                className="group relative rounded-[28px] border border-[#123C2A]/10 bg-white p-7 shadow-[0_12px_35px_rgba(18,60,42,0.06)] transition-shadow duration-300 hover:shadow-[0_20px_45px_rgba(18,60,42,0.12)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#123C2A] text-white transition-transform duration-300 group-hover:scale-105">
                    <Icon size={25} strokeWidth={1.7} />
                  </div>

                  <span className="text-sm font-semibold text-[#C5A45D]">
                    {treatment.number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-semibold text-[#123C2A]">
                  {treatment.title}
                </h3>

                <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#66736B]">
                  {treatment.description}
                </p>

                <Link
                  to="/book-appointment"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#123C2A] transition-all group-hover:gap-3"
                >
                  {t("treatments.viewDetails", "Book Consultation")}
                  <ArrowRight size={16} />
                </Link>

                <div className="absolute bottom-0 left-7 right-7 h-px origin-left scale-x-0 bg-[#C5A45D] transition-transform duration-300 group-hover:scale-x-100" />
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12 text-center"
        >
          <Link
            to="/book-appointment"
            className="inline-flex items-center gap-2 rounded-full bg-[#123C2A] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#123C2A]/15 transition-all hover:bg-[#0B291D] hover:shadow-xl"
          >
            {t("hero.bookBtn", "Schedule Consultation")}
            <ArrowRight size={17} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
