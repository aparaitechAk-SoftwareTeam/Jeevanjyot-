import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  MessageCircle,
  Stethoscope,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function PatientJourneySection() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      icon: CalendarCheck,
      title: t("journey.step1Title", "1. Consultation"),
      text: t("journey.step1Desc", "Detailed Nadi Pariksha & Health Evaluation"),
    },
    {
      number: "02",
      icon: MessageCircle,
      title: t("journey.step2Title", "2. Diagnosis"),
      text: t("journey.step2Desc", "Identifying Dosha imbalance & root cause"),
    },
    {
      number: "03",
      icon: Stethoscope,
      title: t("journey.step3Title", "3. Treatment Plan"),
      text: t("journey.step3Desc", "Custom Herbal Medicines & Panchakarma"),
    },
    {
      number: "04",
      icon: HeartHandshake,
      title: t("journey.step4Title", "4. Rejuvenation"),
      text: t("journey.step4Desc", "Follow-up, Diet & Lifestyle guidance"),
    },
  ];

  return (
    <section
      id="journey"
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#789B82]/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#C5A45D]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex rounded-full border border-[#123C2A]/10 bg-[#123C2A]/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#123C2A]">
            {t("journey.tag", "PATIENT JOURNEY")}
          </span>

          <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-[#123C2A] sm:text-4xl lg:text-5xl">
            {t("journey.heading", "Your Path to Natural Recovery")}
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#66736B] sm:text-base">
            {t("hero.description", "Starting your Ayurvedic care journey can be simple, clear and consultation-focused.")}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-[#123C2A]/10 lg:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="relative z-10 rounded-3xl border border-[#123C2A]/10 bg-[#F7F3E8]/55 p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#123C2A] text-[#C5A45D] shadow-lg">
                  <Icon size={25} strokeWidth={1.8} />
                </div>

                <span className="mt-5 block text-xs font-bold tracking-[0.2em] text-[#C5A45D]">
                  STEP {step.number}
                </span>

                <h3 className="mt-3 text-lg font-semibold text-[#123C2A]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#66736B]">
                  {step.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 overflow-hidden rounded-[2rem] bg-[#123C2A] px-6 py-10 shadow-[0_20px_60px_rgba(18,60,42,0.18)] sm:px-10 lg:px-14 lg:py-12"
        >
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[#C5A45D]">
                <CheckCircle2 size={19} />
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {t("journey.tag", "Begin Your Journey")}
                </span>
              </div>

              <h3 className="mt-4 font-serif text-2xl font-semibold leading-tight text-[#F7F3E8] sm:text-3xl">
                {t("journey.heading", "Ready to take the first step toward your wellness journey?")}
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/65 sm:text-base">
                {t("footer.brandSub", "Schedule a consultation with Jeevanjyot Nature Cure Ayurvedic Clinic & Panchakarma Centre.")}
              </p>
            </div>

            <Link
              to="/book-appointment"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#F7F3E8] px-7 py-3.5 text-sm font-semibold text-[#123C2A] transition-all duration-300 hover:bg-white hover:shadow-xl"
            >
              {t("nav.bookAppointment", "Book Appointment")}
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
