import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Leaf,
  HeartPulse,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function PanchakarmaSection() {
  const { t } = useLanguage();

  const benefits = [
    t("panchakarma.vamana", "Vamana (Emesis)"),
    t("panchakarma.virechana", "Virechana (Purgation)"),
    t("panchakarma.basti", "Basti (Enema Therapy)"),
    t("panchakarma.nasya", "Nasya (Nasal Detox)"),
    t("panchakarma.raktamokshana", "Raktamokshana (Bloodletting)"),
  ];

  return (
    <section id="panchakarma" className="relative scroll-mt-28 overflow-hidden bg-[#123C2A] py-20 sm:py-24">
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#789B82]/20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#C5A45D]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C5A45D]/40 bg-white/5 px-4 py-2 text-sm font-medium text-[#E8D9B5]">
              <Sparkles size={16} />
              {t("panchakarma.tag", "PANCHAKARMA THERAPIES")}
            </div>

            <h2 className="max-w-2xl font-serif text-4xl font-medium leading-tight text-white sm:text-5xl lg:text-6xl">
              {t("panchakarma.heading", "5-Fold Rejuvenation & Purification")}
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
              {t("panchakarma.subtitle", "Traditional Panchakarma procedures performed under medical supervision.")}
            </p>

            <div className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 text-white/85"
                >
                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-[#C5A45D]"
                  />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <Link
              to="/book-appointment"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#C5A45D] px-6 py-3.5 font-semibold text-[#123C2A] shadow-lg transition hover:bg-[#D6BA78]"
            >
              {t("panchakarma.learnMore", "Explore Panchakarma")}
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-3xl bg-[#F7F3E8] p-6 text-[#123C2A]">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#789B82]/20">
                    <Leaf size={25} />
                  </div>

                  <h3 className="font-serif text-2xl">
                    {t("trust.item2", "Ayurveda & Panchakarma")}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#66736B]">
                    {t("hero.description", "Rooted in Ayurvedic principles and personalized wellness guidance.")}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#F7F3E8] p-6 text-[#123C2A]">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C5A45D]/20">
                    <HeartPulse size={25} />
                  </div>

                  <h3 className="font-serif text-2xl">
                    {t("trust.item3", "Personalized Therapies")}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#66736B]">
                    {t("treatments.subtitle", "Care designed around consultation, observation and individual requirements.")}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#F7F3E8] p-6 text-[#123C2A] sm:col-span-2">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#789B82]">
                        {t("journey.tag", "PATIENT JOURNEY")}
                      </p>

                      <h3 className="mt-2 font-serif text-2xl sm:text-3xl">
                        {t("journey.heading", "Consultation → Diagnosis → Treatment → Rejuvenation")}
                      </h3>
                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#123C2A] text-[#C5A45D]">
                      <Sparkles size={24} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
