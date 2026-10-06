import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Leaf,
  HeartPulse,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import doctorImage from "../assets/doctor.png";
import { useLanguage } from "../context/LanguageContext";

function AboutSection() {
  const { t } = useLanguage();

  const points = [
    {
      icon: Leaf,
      title: t("treatments.ayurvedaTitle", "Ayurvedic Care"),
      text: t("treatments.ayurvedaDesc", "A natural approach rooted in traditional Ayurvedic principles."),
    },
    {
      icon: Sparkles,
      title: t("treatments.panchakarmaTitle", "Panchakarma"),
      text: t("panchakarma.subtitle", "Dedicated focus on traditional Panchakarma care and wellness."),
    },
    {
      icon: HeartPulse,
      title: t("hero.badge", "Personalized Care"),
      text: t("hero.description", "Care and guidance designed around individual wellness needs."),
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#F7F3E8] py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#789B82]/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="absolute -left-4 -top-4 h-full w-full rounded-[32px] border border-[#789B82]/20" />

          <div className="relative overflow-hidden rounded-[32px] bg-white p-2 shadow-2xl shadow-[#123C2A]/10">
            <img
              src={doctorImage}
              alt="Dr. Jeevan Atole at Jeevanjyot Clinic"
              className="h-[430px] w-full rounded-[26px] object-cover object-center sm:h-[520px]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute -bottom-5 right-4 max-w-[260px] rounded-2xl border border-white bg-white p-4 shadow-xl sm:right-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#789B82]/15 text-[#123C2A]">
                <Leaf size={20} />
              </div>

              <div>
                <p className="text-xs text-[#66736B]">
                  {t("whyChoose.tag", "Our Approach")}
                </p>

                <p className="text-sm font-semibold text-[#123C2A]">
                  {t("hero.badge", "Natural & Holistic Wellness")}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#789B82]">
            {t("about.tag", "About Jeevanjyot")}
          </span>

          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[#0B291D] sm:text-4xl lg:text-5xl">
            {t("about.heading", "Dedicated to Natural Healing & Authentic Ayurveda")}
          </h2>

          <p className="mt-6 text-base leading-7 text-[#66736B]">
            {t("about.paragraph1", "Jeevanjyot Nature Cure Ayurvedic Clinic & Panchakarma Centre provides a space where traditional Ayurvedic care and personalized wellness guidance come together.")}
          </p>

          <p className="mt-4 text-base leading-7 text-[#66736B]">
            {t("about.paragraph2", "The clinic focuses on Ayurveda, Panchakarma, diabetes care, infertility care and personalized wellness support.")}
          </p>

          <div className="mt-8 space-y-5">
            {points.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#123C2A] shadow-sm">
                    <Icon size={19} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#123C2A]">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#66736B]">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            to="/treatments"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#123C2A] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#123C2A]/15 transition hover:-translate-y-0.5 hover:bg-[#0B291D]"
          >
            {t("treatments.viewDetails", "Discover Our Treatments")}
            <ArrowRight size={17} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

export default AboutSection;
