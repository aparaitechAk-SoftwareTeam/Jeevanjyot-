import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HeartHandshake,
  Stethoscope,
  Sparkles,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function WhyChooseSection() {
  const { t } = useLanguage();

  const reasons = [
    {
      icon: HeartHandshake,
      title: t("whyChoose.item1Title", "Root-Cause Diagnosis"),
      text: t("whyChoose.item1Desc", "We diagnose the underlying Dosha imbalance rather than suppressing symptoms."),
    },
    {
      icon: Stethoscope,
      title: t("whyChoose.item2Title", "Experienced Doctors"),
      text: t("whyChoose.item2Desc", "Consultations with certified BAMS Ayurvedic physicians with deep experience."),
    },
    {
      icon: Sparkles,
      title: t("whyChoose.item3Title", "Authentic Medicines"),
      text: t("whyChoose.item3Desc", "100% pure, quality-tested Ayurvedic herbs and classical formulations."),
    },
    {
      icon: MapPin,
      title: t("whyChoose.item4Title", "Hygienic Therapy Rooms"),
      text: t("whyChoose.item4Desc", "Clean, sanitized Panchakarma suites designed for patient comfort."),
    },
  ];

  return (
    <section
      id="why-us"
      className="relative overflow-hidden bg-[#0B291D] py-20 sm:py-24 lg:py-28"
    >
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#789B82]/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#C5A45D]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex rounded-full border border-[#C5A45D]/30 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A45D]">
              {t("whyChoose.tag", "WHY CHOOSE US")}
            </span>

            <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-[#F7F3E8] sm:text-4xl lg:text-5xl">
              {t("whyChoose.heading", "Why Patients Trust Jeevanjyot")}
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/65 sm:text-base">
              {t("hero.description", "A calm and personalized environment where traditional Ayurvedic care meets a patient-focused wellness journey.")}
            </p>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -7 }}
                className="group rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#C5A45D]/30 hover:bg-white/[0.09]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F3E8] text-[#123C2A] shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <Icon size={25} strokeWidth={1.8} />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-[#F7F3E8]">
                  {reason.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/60">
                  {reason.text}
                </p>

                <Link
                  to="/treatments"
                  className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A45D] hover:text-[#F7F3E8] transition-colors"
                >
                  {t("treatments.viewDetails", "Learn more")}
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-12 max-w-4xl rounded-3xl border border-[#C5A45D]/20 bg-[#F7F3E8]/5 px-6 py-5 text-center"
        >
          <p className="text-sm leading-6 text-white/65">
            {t("footer.disclaimer", "Every wellness journey is individual. Treatment suitability and care decisions should always be discussed with the doctor during a consultation.")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
