import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquareQuote,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Star,
  UserCheck,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getTranslatedTreatmentName } from "../utils/treatmentTranslations";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function TestimonialsFAQSection() {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  const [dbFaqs, setDbFaqs] = useState([]);
  const [dbReviews, setDbReviews] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState("All");
  const [reviewSummary, setReviewSummary] = useState({
    averageRating: 0,
    totalApprovedReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [resFaq, resRev, resSum] = await Promise.all([
          fetch(`${API_URL}/faqs`),
          fetch(`${API_URL}/reviews`),
          fetch(`${API_URL}/reviews/summary`),
        ]);

        if (resFaq.ok) {
          const dataF = await resFaq.json();
          if (dataF.success && Array.isArray(dataF.faqs) && dataF.faqs.length > 0) {
            setDbFaqs(dataF.faqs);
          }
        }

        if (resRev.ok) {
          const dataR = await resRev.json();
          if (dataR.success && Array.isArray(dataR.reviews)) {
            setDbReviews(dataR.reviews);
          }
        }

        if (resSum.ok) {
          const dataS = await resSum.json();
          if (dataS.success && dataS.summary) {
            setReviewSummary(dataS.summary);
          }
        }
      } catch (err) {
        // Fallback on network issue
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
      patientName: "Verified Patient",
      treatmentCare: "Panchakarma Care",
      doctorName: "Dr. Jeevan Atole",
      rating: 5,
      reviewText: t("testimonials.item1", "Panchakarma treatment relieved my chronic joint pain significantly. Highly recommended!"),
      isVerified: true,
      adminReply: "Thank you for sharing your experience. Glad to see positive recovery!",
      repliedBy: "Dr. Jeevan Atole",
    },
    {
      patientName: "Verified Patient",
      treatmentCare: "Diabetes Management",
      doctorName: "Dr. Jeevan Atole",
      rating: 5,
      reviewText: t("testimonials.item2", "Excellent Ayurvedic care for diabetes. Dr. Atole's guidance helped stabilize my sugar levels naturally."),
      isVerified: true,
    },
    {
      patientName: "Verified Patient",
      treatmentCare: "Ayurvedic Consultation",
      doctorName: "Dr. Jeevan Atole",
      rating: 5,
      reviewText: t("testimonials.item3", "Very clean clinic and attentive staff. The soothing Panchakarma massage was truly rejuvenating."),
      isVerified: true,
    },
  ];

  const faqList = dbFaqs.length > 0 ? dbFaqs : defaultFaqs;
  const reviewList = dbReviews.length > 0 ? dbReviews : defaultExperiences;

  const treatmentCategories = useMemo(() => {
    const list = reviewList.map((r) => r.treatmentCare).filter(Boolean);
    return ["All", ...new Set(list)];
  }, [reviewList]);

  const filteredReviews = useMemo(() => {
    if (selectedTreatment === "All") return reviewList;
    return reviewList.filter((r) => r.treatmentCare === selectedTreatment);
  }, [reviewList, selectedTreatment]);

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
        <div className="mt-14 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">

          {/* Patient Reviews & Ratings Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] bg-[#123C2A] p-7 shadow-[0_20px_60px_rgba(18,60,42,0.16)] sm:p-9 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C5A45D]/15 text-[#C5A45D]">
                <MessageSquareQuote size={23} />
              </div>

              {reviewSummary.totalApprovedReviews > 0 && (
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star size={16} className="fill-[#C5A45D] text-[#C5A45D]" />
                    <span className="text-xl font-bold text-[#F7F3E8]">
                      {reviewSummary.averageRating}
                    </span>
                    <span className="text-xs text-white/60">/ 5</span>
                  </div>
                  <p className="text-[11px] text-white/60">
                    Based on {reviewSummary.totalApprovedReviews} verified {reviewSummary.totalApprovedReviews === 1 ? "review" : "reviews"}
                  </p>
                </div>
              )}
            </div>

            <h3 className="mt-6 font-serif text-2xl font-semibold text-[#F7F3E8] sm:text-3xl">
              {t("testimonials.heading", "Verified Patient Reviews")}
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/70">
              {t("testimonials.subtitle", "Authentic experiences shared by verified patients who completed care at Jeevanjyot.")}
            </p>

            {/* RATING BARS (If reviews exist) */}
            {reviewSummary.totalApprovedReviews > 0 && (
              <div className="mt-5 border-t border-b border-white/10 py-4 space-y-1.5 text-xs">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewSummary.ratingDistribution?.[star] || 0;
                  const pct =
                    reviewSummary.totalApprovedReviews > 0
                      ? Math.round((count / reviewSummary.totalApprovedReviews) * 100)
                      : 0;

                  return (
                    <div key={star} className="flex items-center gap-2 text-white/70">
                      <span className="w-5 text-right font-medium">{star}★</span>
                      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-[#C5A45D] transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-[11px] text-white/50">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TREATMENT FILTER TABS */}
            {treatmentCategories.length > 2 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {treatmentCategories.map((tName) => (
                  <button
                    key={tName}
                    onClick={() => setSelectedTreatment(tName)}
                    className={`rounded-xl px-3 py-1 text-[11px] font-semibold transition ${
                      selectedTreatment === tName
                        ? "bg-[#C5A45D] text-[#123C2A]"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {tName}
                  </button>
                ))}
              </div>
            )}

            {/* REVIEWS CARDS LIST */}
            <div className="mt-6 space-y-4 max-h-[440px] overflow-y-auto pr-1">
              {filteredReviews.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xs transition hover:bg-white/10"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {item.patientName || "Verified Patient"}
                      </h4>
                      <p className="text-[11px] font-medium text-[#789B82] flex items-center gap-1.5">
                        <span>{getTranslatedTreatmentName(item.treatmentCare, language) || "Ayurvedic Treatment"}</span>
                        <span className="text-white/30">•</span>
                        <span className="text-white/70 flex items-center gap-1">
                          <UserCheck size={11} className="text-[#C5A45D]" />
                          {item.doctorName || "Dr. Jeevan Atole"}
                        </span>
                      </p>
                    </div>

                    <div className="flex text-[#C5A45D]">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} size={13} fill="#C5A45D" />
                      ))}
                    </div>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-white/80">
                    "{item.reviewText || item.title}"
                  </p>

                  {/* Doctor / Admin Reply Box */}
                  {item.adminReply && (
                    <div className="mt-3 rounded-xl border border-[#C5A45D]/30 bg-[#C5A45D]/10 p-3 text-xs text-[#F7F3E8]">
                      <div className="flex items-center justify-between text-[#C5A45D] font-semibold text-[11px]">
                        <span className="flex items-center gap-1">
                          <MessageSquareQuote size={13} /> Response by {item.repliedBy || item.doctorName || "Dr. Jeevan Atole"}
                        </span>
                        {item.repliedAt && (
                          <span className="text-[10px] text-white/50">
                            {new Date(item.repliedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-white/90 italic">"{item.adminReply}"</p>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-white/50">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                      <ShieldCheck size={12} /> Verified Patient Review
                    </span>
                    {item.createdAt && <span>{new Date(item.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#C5A45D]/20 bg-[#C5A45D]/5 p-4">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-[#C5A45D]"
              />

              <p className="text-xs leading-5 text-white/70">
                {t("footer.disclaimer", "Reviews are submitted by verified patients following completed appointments and moderated for authentic clinic care feedback.")}
              </p>
            </div>
          </motion.div>

          {/* FAQ Accordion Column */}
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
