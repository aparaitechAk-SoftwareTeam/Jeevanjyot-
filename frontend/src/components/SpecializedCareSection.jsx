import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  HeartPulse,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function SpecializedCareSection() {
  const { t } = useLanguage();

  const careCards = [
    {
      number: "01",
      icon: Activity,
      label: t("treatments.diabetesTitle", "Diabetes Care"),
      title: t("specialized.diabetesCare", "Personalized Ayurvedic Wellness Support"),
      description: t("treatments.diabetesDesc", "Begin with a detailed consultation and a personalized care approach based on your individual needs and lifestyle."),
      points: [
        t("trust.item1", "Personalized consultation"),
        t("journey.step4Desc", "Lifestyle and wellness guidance"),
        t("trust.item2", "Ayurvedic care approach"),
      ],
    },
    {
      number: "02",
      icon: HeartPulse,
      label: t("treatments.infertilityTitle", "Infertility Care"),
      title: t("specialized.infertilityCare", "Compassionate, Individualized Care"),
      description: t("treatments.infertilityDesc", "A supportive Ayurvedic approach focused on understanding individual requirements and creating a personalized wellness journey."),
      points: [
        t("trust.item1", "Detailed consultation"),
        t("trust.item2", "Individualized Ayurvedic guidance"),
        t("trust.item3", "Supportive care journey"),
      ],
    },
  ];

  return (
    <section
      id="specialized-care"
      className="bg-[#F7F3E8] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#789B82]/30 bg-white px-4 py-2 text-sm font-semibold text-[#123C2A] shadow-sm">
            <Sparkles size={16} />
            {t("specialized.tag", "Specialized Ayurvedic Care")}
          </div>

          <h2 className="font-serif text-4xl font-medium leading-tight text-[#123C2A] sm:text-5xl lg:text-6xl">
            {t("specialized.heading", "Targeted Ayurvedic Therapies")}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#66736B] sm:text-lg">
            {t("specialized.subtitle", "Specialized health programs for chronic health conditions.")}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-14 grid gap-7 lg:grid-cols-2">

          {careCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.65, delay: index * 0.12 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-[2rem] border border-[#123C2A]/10 bg-white p-7 shadow-[0_15px_50px_rgba(18,60,42,0.08)] transition-shadow duration-300 hover:shadow-[0_22px_60px_rgba(18,60,42,0.13)] sm:p-9"
              >
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#789B82]/10 blur-3xl transition-transform duration-500 group-hover:scale-125" />

                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#123C2A] text-[#C5A45D]">
                      <Icon size={27} />
                    </div>

                    <span className="font-serif text-5xl text-[#123C2A]/10">
                      {card.number}
                    </span>
                  </div>

                  <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-[#789B82]">
                    {card.label}
                  </p>

                  <h3 className="mt-3 max-w-lg font-serif text-3xl leading-tight text-[#123C2A] sm:text-4xl">
                    {card.title}
                  </h3>

                  <p className="mt-5 max-w-xl leading-7 text-[#66736B]">
                    {card.description}
                  </p>

                  <div className="mt-7 space-y-3">
                    {card.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-3 text-sm font-medium text-[#17231C]"
                      >
                        <ShieldCheck
                          size={18}
                          className="shrink-0 text-[#789B82]"
                        />
                        {point}
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/book-appointment"
                    className="mt-8 inline-flex items-center gap-2 font-semibold text-[#123C2A] transition-colors hover:text-[#789B82]"
                  >
                    {t("hero.bookBtn", "Book a Consultation")}
                    <ArrowUpRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>
                </div>
              </motion.article>
            );
          })}

        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-10 flex max-w-4xl items-start gap-4 rounded-2xl border border-[#789B82]/20 bg-[#123C2A]/5 p-5 text-sm leading-6 text-[#66736B]"
        >
          <HeartPulse
            size={20}
            className="mt-0.5 shrink-0 text-[#123C2A]"
          />
          <p>
            {t("footer.disclaimer", "Care is personalized after consultation. Information on this website is intended for general awareness and does not replace professional medical consultation.")}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
