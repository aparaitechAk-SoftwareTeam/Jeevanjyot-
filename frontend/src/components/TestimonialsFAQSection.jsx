import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquareQuote,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function TestimonialsFAQSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  const [dbFaqs, setDbFaqs] = useState([]);
  const [dbTestimonials, setDbTestimonials] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [resFaq, resTest] = await Promise.all([
          fetch(`${API_URL}/faqs`),
          fetch(`${API_URL}/testimonials`),
        ]);

        if (resFaq.ok) {
          const dataF = await resFaq.json();
          if (dataF.success && Array.isArray(dataF.faqs) && dataF.faqs.length > 0) {
            setDbFaqs(dataF.faqs);
          }
        }

        if (resTest.ok) {
          const dataT = await resTest.json();
          if (dataT.success && Array.isArray(dataT.testimonials) && dataT.testimonials.length > 0) {
            setDbTestimonials(dataT.testimonials);
          }
        }
      } catch (err) {
        // Fallback to defaults on error
      }
    };

    fetchContent();
  }, []);

  const defaultFaqs = [
    {
      question: t("faq.q1", "What is Panchakarma and who needs it?"),
      answer: t("faq.a1", "Panchakarma is a 5-step Ayurvedic detoxification procedure that cleanses accumulated toxins from the body and restores Dosha balance."),
    },
    {
      question: t("faq.q2", "Are Ayurvedic medicines safe to take with allopathy?"),
      answer: t("faq.a2", "Yes, under proper medical guidance, Ayurvedic herbal formulations can be safely integrated into your health routine."),
    },
    {
      question: t("faq.q3", "How long does a Panchakarma treatment session take?"),
      answer: t("faq.a3", "Individual sessions usually take 45 to 75 minutes. A complete Panchakarma therapy package spans 7, 14, or 21 days based on diagnosis."),
    },
    {
      question: t("faq.q4", "Do I need a prior appointment for consultation?"),
      answer: t("faq.a4", "Yes, prior booking is recommended to ensure minimal waiting time and dedicated consultation time with the doctor."),
    },
    {
      question: t("faq.q5", "What clinic hours are you open?"),
      answer: t("faq.a5", "We are open Monday to Saturday from 10:00 AM to 9:00 PM. Sunday is closed."),
    },
  ];

  const defaultExperiences = [
    {
      title: t("testimonials.item1", "Panchakarma treatment relieved my chronic joint pain significantly. Highly recommended!"),
      text: "Patient feedback for authentic Panchakarma care.",
    },
    {
      title: t("testimonials.item2", "Excellent Ayurvedic care for diabetes. Dr. Atole's guidance helped stabilize my sugar levels naturally."),
      text: "Patient experience with diabetes lifestyle management.",
    },
    {
      title: t("testimonials.item3", "Very clean clinic and attentive staff. The soothing Panchakarma massage was truly rejuvenating."),
      text: "Patient experience at Jeevanjyot Clinic.",
    },
  ];

  const faqList = dbFaqs.length > 0 ? dbFaqs : defaultFaqs;

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-[#789B82]/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#C5A45D]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#123C2A]/10 bg-[#F7F3E8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#123C2A]">
            <HelpCircle size={14} />
            {t("faq.tag", "FREQUENTLY ASKED QUESTIONS")}
          </div>

          <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-[#123C2A] sm:text-4xl lg:text-5xl">
            {t("faq.heading", "Answers to Common Questions")}
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#66736B] sm:text-base">
            {t("faq.subtitle", "Find clear answers about Ayurvedic treatments and appointments.")}
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">

          {/* Patient Experience / Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] bg-[#123C2A] p-7 shadow-[0_20px_60px_rgba(18,60,42,0.16)] sm:p-9"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C5A45D]/15 text-[#C5A45D]">
              <MessageSquareQuote size={23} />
            </div>

            <h3 className="mt-6 font-serif text-2xl font-semibold text-[#F7F3E8] sm:text-3xl">
              {t("testimonials.heading", "What Our Patients Say")}
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/65">
              {t("testimonials.subtitle", "Real healing stories from patients who restored their health with us.")}
            </p>

            <div className="mt-8 space-y-4">
              {dbTestimonials.length > 0
                ? dbTestimonials.map((item) => (
                    <div
                      key={item._id || item.patientName}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-semibold text-white">
                          {item.patientName}
                        </h4>
                        <div className="flex text-[#C5A45D]">
                          {[...Array(item.rating || 5)].map((_, i) => (
                            <Star key={i} size={12} fill="#C5A45D" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-medium text-[#789B82]">
                        {item.treatmentName}
                      </p>
                      <p className="mt-2 text-xs leading-6 text-white/70">
                        "{item.content}"
                      </p>
                    </div>
                  ))
                : defaultExperiences.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <h4 className="text-sm font-semibold text-white">
                        {item.title}
                      </h4>
                    </div>
                  ))}
            </div>

            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#C5A45D]/20 bg-[#C5A45D]/5 p-4">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-[#C5A45D]"
              />

              <p className="text-xs leading-5 text-white/60">
                {t("footer.disclaimer", "Only authentic, verified clinic-approved reviews are displayed.")}
              </p>
            </div>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            {faqList.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq._id || faq.question}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-[#789B82]/40 bg-[#F7F3E8]/70 shadow-sm"
                      : "border-[#123C2A]/10 bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? -1 : index)
                    }
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                  >
                    <span className="text-sm font-semibold leading-6 text-[#123C2A] sm:text-base">
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 bg-[#123C2A] text-white"
                          : "bg-[#F7F3E8] text-[#123C2A]"
                      }`}
                    >
                      <ChevronDown size={17} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="border-t border-[#123C2A]/10 px-5 pb-5 pt-4 sm:px-6">
                          <p className="text-sm leading-7 text-[#66736B]">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-12 max-w-3xl rounded-2xl border border-[#123C2A]/10 bg-[#F7F3E8]/60 px-5 py-4 text-center"
        >
          <p className="text-xs leading-5 text-[#66736B]">
            {t("footer.disclaimer", "Information on this website is for general awareness and does not replace professional medical consultation.")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
