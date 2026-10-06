import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Leaf,
  Sparkles,
  Activity,
  HeartPulse,
  Flower2,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function TreatmentsSection() {
  const { t } = useLanguage();

  const treatments = [
    {
      number: "01",
      icon: Leaf,
      title: t("treatments.ayurvedaTitle", "Ayurvedic Care"),
      description: t("treatments.ayurvedaDesc", "Personalized care based on traditional Ayurvedic principles and individual wellness needs."),
      tag: t("treatments.ayurvedaTitle", "Traditional Ayurveda"),
    },
    {
      number: "02",
      icon: Sparkles,
      title: t("treatments.panchakarmaTitle", "Panchakarma"),
      description: t("treatments.panchakarmaDesc", "Traditional Panchakarma-focused care designed around consultation, assessment and guided wellness."),
      tag: t("treatments.panchakarmaTitle", "Panchakarma Care"),
    },
    {
      number: "03",
      icon: Activity,
      title: t("treatments.diabetesTitle", "Diabetes Care"),
      description: t("treatments.diabetesDesc", "Personalized Ayurvedic and lifestyle guidance to support better health and long-term wellness."),
      tag: t("specialized.diabetesCare", "Specialized Care"),
    },
    {
      number: "04",
      icon: HeartPulse,
      title: t("treatments.infertilityTitle", "Infertility Care"),
      description: t("treatments.infertilityDesc", "Individualized consultation and wellness support for couples seeking personalized care."),
      tag: t("specialized.infertilityCare", "Personalized Support"),
    },
    {
      number: "05",
      icon: Flower2,
      title: t("specialized.jointCare", "Nature Cure"),
      description: t("hero.description", "A natural wellness approach combining healthy routines, lifestyle guidance and holistic care."),
      tag: t("hero.badge", "Natural Wellness"),
    },
    {
      number: "06",
      icon: ShieldCheck,
      title: t("specialized.skinCare", "Personalized Wellness"),
      description: t("trust.item3", "Thoughtful guidance based on your individual needs, lifestyle and wellness journey."),
      tag: t("hero.badge", "Holistic Approach"),
    },
  ];

  return (
    <section
      id="treatments"
      className="relative overflow-hidden bg-[#f7f3e8] px-6 py-24 md:px-10 lg:px-16"
    >
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#789b82]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#c5a45d]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#789b82]">
            {t("treatments.tag", "Our Treatments")}
          </p>

          <h2 className="text-4xl font-semibold leading-tight text-[#0b291d] md:text-5xl">
            {t("treatments.heading", "Care Designed Around Your Wellness")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#66736b] md:text-lg">
            {t("treatments.subtitle", "Explore Ayurvedic, Panchakarma and personalized wellness services available at Jeevanjyot Nature Cure Ayurvedic Clinic & Panchakarma Centre.")}
          </p>
        </motion.div>

        {/* Treatment Cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {treatments.map((treatment, index) => {
            const Icon = treatment.icon;

            return (
              <motion.article
                key={treatment.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -7 }}
                className="group relative rounded-[28px] border border-[#dfe3d8] bg-white p-7 shadow-[0_10px_35px_rgba(11,41,29,0.05)] transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(11,41,29,0.10)]"
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#123c2a] text-white transition-transform duration-300 group-hover:scale-110">
                    <Icon size={25} strokeWidth={1.7} />
                  </div>

                  <span className="text-sm font-semibold text-[#c5a45d]">
                    {treatment.number}
                  </span>
                </div>

                <span className="inline-flex rounded-full bg-[#eef3ed] px-3 py-1 text-xs font-medium text-[#527361]">
                  {treatment.tag}
                </span>

                <h3 className="mt-5 text-2xl font-semibold text-[#123c2a]">
                  {treatment.title}
                </h3>

                <p className="mt-3 min-h-[84px] text-sm leading-6 text-[#66736b]">
                  {treatment.description}
                </p>

                <Link
                  to="/book-appointment"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#123c2a] transition-all group-hover:gap-3"
                >
                  {t("treatments.viewDetails", "Learn More")}
                  <ArrowRight size={17} />
                </Link>

                <div className="absolute bottom-0 left-7 right-7 h-[2px] origin-left scale-x-0 rounded-full bg-[#c5a45d] transition-transform duration-300 group-hover:scale-x-100" />
              </motion.article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 flex flex-col items-center justify-between gap-5 rounded-[28px] bg-[#123c2a] px-7 py-7 text-white md:flex-row md:px-10"
        >
          <div>
            <p className="text-xl font-semibold">
              {t("journey.heading", "Looking for the right care for you?")}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {t("appointment.subtitle", "Book a consultation and discuss your wellness needs.")}
            </p>
          </div>

          <Link
            to="/book-appointment"
            className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#123c2a] transition-transform hover:scale-105"
          >
            {t("hero.bookBtn", "Book Appointment")}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
