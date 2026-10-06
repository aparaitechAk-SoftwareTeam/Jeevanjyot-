import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  ShieldCheck,
  MessageSquareQuote,
  RefreshCw,
  AlertCircle,
  Filter,
  UserCheck,
  Award,
  Sparkles,
  Search,
  X,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import {
  getTranslatedTreatmentName,
  filterTreatmentsBySearch,
} from "../utils/treatmentTranslations";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ReviewsPage() {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [reviews, setReviews] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [treatmentSearch, setTreatmentSearch] = useState("");

  const rawTreatmentParam = searchParams.get("treatment") || "all";
  const selectedTreatment = rawTreatmentParam.trim();

  const fetchReviewsData = async () => {
    try {
      setLoading(true);
      setError("");

      const [resReviews, resTreatments, resSummary] = await Promise.all([
        fetch(`${API_URL}/reviews`),
        fetch(`${API_URL}/treatments`),
        fetch(`${API_URL}/reviews/summary`),
      ]);

      if (!resReviews.ok) {
        throw new Error("Unable to load reviews right now.");
      }

      const reviewsData = await resReviews.json();
      if (reviewsData.success && Array.isArray(reviewsData.reviews)) {
        setReviews(reviewsData.reviews);
      }

      if (resTreatments.ok) {
        const treatmentsData = await resTreatments.json();
        if (treatmentsData.success && Array.isArray(treatmentsData.treatments)) {
          setTreatments(treatmentsData.treatments);
        }
      }

      if (resSummary.ok) {
        const summaryData = await resSummary.json();
        if (summaryData.success && summaryData.summary) {
          setSummary(summaryData.summary);
        }
      }
    } catch (err) {
      console.error("Fetch public reviews error:", err);
      setError("Unable to load reviews right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Reviews & Ratings | Jeevanjyot Nature Cure Ayurvedic Clinic";
    fetchReviewsData();
  }, []);

  // Build dynamic list of available treatment categories
  const treatmentOptions = useMemo(() => {
    const namesSet = new Set();

    // Add names from treatments API
    treatments.forEach((tItem) => {
      if (tItem.name) namesSet.add(tItem.name);
      if (tItem.title) namesSet.add(tItem.title);
    });

    // Add treatmentCare names from reviews
    reviews.forEach((r) => {
      if (r.treatmentCare) namesSet.add(r.treatmentCare);
    });

    const list = Array.from(namesSet).sort((a, b) => a.localeCompare(b));
    return [
      { id: "all", label: t("reviewsPage.allTreatments", "All Treatments") },
      ...list.map((name) => ({ id: name, label: getTranslatedTreatmentName(name, language) })),
    ];
  }, [treatments, reviews, t, language]);

  // Filter treatment options by client-side search input (matching translated and canonical names)
  const filteredTreatmentOptions = useMemo(() => {
    return filterTreatmentsBySearch(treatmentOptions, treatmentSearch, language);
  }, [treatmentOptions, treatmentSearch, language]);

  // Filter approved reviews by selected treatment
  const filteredReviews = useMemo(() => {
    if (selectedTreatment.toLowerCase() === "all") return reviews;
    return reviews.filter(
      (r) =>
        r.treatmentCare?.toLowerCase() === selectedTreatment.toLowerCase() ||
        r.treatmentId === selectedTreatment
    );
  }, [reviews, selectedTreatment]);

  // Selected treatment display title
  const activeTreatmentObj = useMemo(() => {
    if (selectedTreatment.toLowerCase() === "all") {
      return { id: "all", label: "All Treatments" };
    }
    const match = treatmentOptions.find(
      (opt) => opt.id.toLowerCase() === selectedTreatment.toLowerCase()
    );
    return match || { id: selectedTreatment, label: selectedTreatment };
  }, [selectedTreatment, treatmentOptions]);

  // Compute summary for current selection
  const currentSummary = useMemo(() => {
    if (selectedTreatment.toLowerCase() === "all" && summary) {
      return summary;
    }

    const targetReviews = filteredReviews;
    const count = targetReviews.length;
    if (count === 0)
      return {
        averageRating: 0,
        totalApprovedReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };

    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    targetReviews.forEach((r) => {
      const star = Math.round(r.rating || 5);
      if (dist[star] !== undefined) dist[star]++;
      sum += r.rating || 5;
    });

    return {
      averageRating: Number((sum / count).toFixed(1)),
      totalApprovedReviews: count,
      ratingDistribution: dist,
    };
  }, [selectedTreatment, summary, filteredReviews]);

  const handleSelectTreatment = (id) => {
    const nextParams = new URLSearchParams(searchParams);
    if (id.toLowerCase() === "all") {
      nextParams.delete("treatment");
    } else {
      nextParams.set("treatment", id);
    }
    setSearchParams(nextParams);
  };

  return (
    <div className="min-h-screen bg-[#F7F3E8]/30 py-10 sm:py-14 lg:py-16 text-[#17231C] overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#123C2A]/15 bg-[#F7F3E8] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#123C2A] shadow-2xs mb-3">
            <Sparkles size={14} className="text-[#C5A45D]" />
            {t("reviewsPage.badge", "PATIENT EXPERIENCES")}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#123C2A]">
            {t("reviewsPage.heading", "Reviews & Ratings")}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#66736B] leading-relaxed">
            {t("reviewsPage.subheading", "Explore patient reviews and ratings by treatment.")}
          </p>
        </motion.div>

        {/* ERROR STATE */}
        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#123C2A]">
              {t("reviewsPage.errorTitle", "Unable to load reviews right now.")}
            </h3>
            <p className="mt-2 text-sm text-[#66736B]">
              {t("reviewsPage.errorDesc", "Please check your network connection and try again.")}
            </p>
            <button
              onClick={fetchReviewsData}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#123C2A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B291D]"
            >
              <RefreshCw size={16} />
              {t("reviewsPage.retry", "Retry")}
            </button>
          </motion.div>
        ) : (
          <div>
            
            {/* MOBILE & TABLET SELECTOR (<1024px) */}
            <div className="block lg:hidden mb-6 bg-white p-4.5 rounded-2xl border border-[#123C2A]/10 shadow-xs">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#123C2A] mb-2 flex items-center gap-1.5">
                <Filter size={14} className="text-[#789B82]" />
                {t("reviewsPage.selectTreatment", "Filter by Treatment:")}
              </label>

              {/* Mobile Search Field */}
              <div className="relative w-full mb-2.5">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#789B82] pointer-events-none"
                />
                <input
                  type="text"
                  value={treatmentSearch}
                  onChange={(e) => setTreatmentSearch(e.target.value)}
                  placeholder="Search treatments..."
                  className="w-full h-11 rounded-xl border border-[#123C2A]/15 bg-white pl-10 pr-10 text-xs font-medium text-[#123C2A] placeholder-[#66736B] leading-normal outline-none transition-all duration-200 focus:border-[#789B82] focus:bg-white focus:ring-2 focus:ring-[#789B82]/20 shadow-2xs"
                />
                {treatmentSearch && (
                  <button
                    type="button"
                    onClick={() => setTreatmentSearch("")}
                    title="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-[#123C2A]/10 text-[#123C2A] hover:bg-[#123C2A] hover:text-white transition-colors duration-150"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <select
                value={activeTreatmentObj.id}
                onChange={(e) => handleSelectTreatment(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#123C2A]/15 bg-[#F7F3E8]/50 px-3.5 text-xs sm:text-sm font-semibold text-[#123C2A] outline-none shadow-2xs focus:border-[#789B82] focus:ring-2 focus:ring-[#789B82]/20"
              >
                {filteredTreatmentOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* MAIN STRUCTURAL TWO-COLUMN LAYOUT (DESKTOP & UP) */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* LEFT SIDEBAR (FIXED 280px ON DESKTOP) */}
              <aside className="hidden lg:block w-[280px] shrink-0 sticky top-28 rounded-2xl border border-[#123C2A]/10 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#123C2A]/8 pb-3 mb-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#123C2A] flex items-center gap-2">
                    <Filter size={14} className="text-[#789B82]" />
                    {t("reviewsPage.treatmentsTitle", "Treatments")}
                  </h2>
                  <span className="rounded-full bg-[#F7F3E8] px-2 py-0.5 text-[10px] font-bold text-[#66736B]">
                    {treatmentOptions.length - 1}
                  </span>
                </div>

                {/* Search Input Field */}
                <div className="relative w-full mb-3.5">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#789B82] pointer-events-none"
                  />
                  <input
                    type="text"
                    value={treatmentSearch}
                    onChange={(e) => setTreatmentSearch(e.target.value)}
                    placeholder="Search treatments..."
                    className="w-full h-11 rounded-xl border border-[#123C2A]/15 bg-white pl-10 pr-10 text-xs font-medium text-[#123C2A] placeholder-[#66736B] leading-normal outline-none transition-all duration-200 focus:border-[#789B82] focus:bg-white focus:ring-2 focus:ring-[#789B82]/20 shadow-2xs"
                  />
                  {treatmentSearch && (
                    <button
                      type="button"
                      onClick={() => setTreatmentSearch("")}
                      title="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-[#123C2A]/10 text-[#123C2A] hover:bg-[#123C2A] hover:text-white transition-colors duration-150"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <nav className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
                  {filteredTreatmentOptions.length <= 1 && treatmentSearch.trim() !== "" ? (
                    <div className="py-6 px-2 text-center">
                      <p className="text-xs font-semibold text-[#66736B]">No treatments found</p>
                      <p className="text-[10px] text-[#66736B]/70 mt-1">Try a different search term</p>
                    </div>
                  ) : (
                    filteredTreatmentOptions.map((opt) => {
                      const isActive =
                        selectedTreatment.toLowerCase() === opt.id.toLowerCase();

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectTreatment(opt.id)}
                          className={`w-full text-left rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 flex items-center justify-between gap-2 ${
                            isActive
                              ? "bg-[#123C2A] text-white shadow-sm"
                              : "bg-[#F7F3E8]/40 text-[#123C2A] hover:bg-[#F7F3E8] hover:text-[#123C2A]"
                          }`}
                        >
                          <span className="truncate">{opt.label}</span>
                          {isActive && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C5A45D]" />
                          )}
                        </button>
                      );
                    })
                  )}
                </nav>
              </aside>

              {/* RIGHT REVIEW CONTENT AREA */}
              <main className="flex-1 w-full min-w-0 space-y-6">
                
                {/* SELECTED TREATMENT BANNER HEADER */}
                <div className="rounded-2xl border border-[#123C2A]/10 bg-white p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#789B82]">
                      Reviews for Treatment:
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#123C2A] mt-0.5">
                      {activeTreatmentObj.label}
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#F7F3E8] border border-[#123C2A]/10 px-3.5 py-1.5 text-xs font-bold text-[#123C2A]">
                    {filteredReviews.length} {filteredReviews.length === 1 ? "Approved Review" : "Approved Reviews"}
                  </span>
                </div>

                {/* OVERALL RATING SUMMARY CARD */}
                {currentSummary && currentSummary.totalApprovedReviews > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-[#123C2A]/10 bg-white p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4.5">
                      <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#123C2A] text-white shadow-inner">
                        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F3E8]">
                          {currentSummary.averageRating}
                        </span>
                        <div className="flex text-[#C5A45D] mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              fill={
                                i < Math.round(currentSummary.averageRating)
                                  ? "#C5A45D"
                                  : "transparent"
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-[#123C2A]">
                          {t("reviewsPage.overallRating", "Average Rating")}
                        </h4>
                        <p className="text-xs text-[#66736B] mt-1">
                          Based on {currentSummary.totalApprovedReviews} verified patient{" "}
                          {currentSummary.totalApprovedReviews === 1 ? "review" : "reviews"}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-[#F7F3E8] px-2.5 py-1 text-[11px] font-semibold text-[#123C2A]">
                          <Award size={13} className="text-[#C5A45D]" />
                          Verified Patient Feedback
                        </div>
                      </div>
                    </div>

                    {/* STAR DISTRIBUTION BARS */}
                    <div className="w-full sm:w-52 space-y-1 text-xs border-t sm:border-t-0 sm:border-l border-[#123C2A]/8 pt-4 sm:pt-0 sm:pl-5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = currentSummary.ratingDistribution?.[star] || 0;
                        const pct =
                          currentSummary.totalApprovedReviews > 0
                            ? Math.round(
                                (count / currentSummary.totalApprovedReviews) * 100
                              )
                            : 0;

                        return (
                          <div key={star} className="flex items-center gap-2 text-[#66736B]">
                            <span className="w-4 text-right font-medium">{star}★</span>
                            <div className="flex-1 h-2 rounded-full bg-[#F7F3E8] overflow-hidden">
                              <div
                                className="h-full bg-[#C5A45D] transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-5 text-right text-[10px] font-semibold">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* LOADING SKELETON */}
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse rounded-2xl border border-[#123C2A]/8 bg-white p-6 space-y-3"
                      >
                        <div className="h-4 w-1/4 rounded-md bg-[#F7F3E8]" />
                        <div className="h-4 w-1/3 rounded-md bg-[#F7F3E8]" />
                        <div className="h-16 w-full rounded-md bg-[#F7F3E8]/60" />
                      </div>
                    ))}
                  </div>
                ) : filteredReviews.length === 0 ? (
                  
                  /* EMPTY STATE */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-[#123C2A]/10 bg-white p-10 text-center shadow-xs"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F3E8] text-[#789B82] mb-3">
                      <Star size={26} />
                    </div>
                    <h3 className="text-xl font-bold text-[#123C2A]">
                      No reviews yet
                    </h3>
                    <p className="mt-2 text-sm text-[#66736B] max-w-md mx-auto leading-relaxed">
                      Patient reviews for this treatment will appear here once approved.
                    </p>
                  </motion.div>
                ) : (
                  
                  /* REVIEW CARDS LIST */
                  <div className="space-y-5">
                    {filteredReviews.map((review, index) => (
                      <motion.article
                        key={review._id || index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.04 }}
                        className="rounded-2xl border border-[#123C2A]/10 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300"
                      >
                        {/* 1. TREATMENT NAME */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#123C2A]/6 pb-3 mb-3">
                          <span className="rounded-lg bg-[#F7F3E8] px-3 py-1 text-xs font-bold text-[#123C2A]">
                            {getTranslatedTreatmentName(review.treatmentCare, language) || "Ayurvedic Treatment"}
                          </span>

                          {/* 6. REVIEW DATE */}
                          {formatDate(review.createdAt) && (
                            <span className="text-xs text-[#66736B]">
                              {formatDate(review.createdAt)}
                            </span>
                          )}
                        </div>

                        {/* 2. DOCTOR NAME */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#123C2A] mb-2.5">
                          <UserCheck size={14} className="text-[#C5A45D]" />
                          <span>Attending Doctor:</span>
                          <span className="font-bold text-[#0B291D]">
                            {review.doctorName || "Dr. Jeevan Atole"}
                          </span>
                        </div>

                        {/* 3. RATING */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex text-[#C5A45D]">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={15}
                                fill={
                                  i < Math.round(review.rating || 5)
                                    ? "#C5A45D"
                                    : "transparent"
                                }
                                className={
                                  i < Math.round(review.rating || 5)
                                    ? "text-[#C5A45D]"
                                    : "text-slate-200"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-[#123C2A]">
                            {(review.rating || 5).toFixed(1)}
                          </span>
                        </div>

                        {/* 4. REVIEW TEXT */}
                        <p className="text-sm leading-relaxed text-[#17231C] bg-[#F7F3E8]/35 p-3.5 sm:p-4 rounded-xl border border-[#123C2A]/6 italic">
                          "{review.reviewText}"
                        </p>

                        {/* 5. VERIFIED BADGE */}
                        {review.isVerified && (
                          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                            <ShieldCheck size={15} className="text-emerald-600" />
                            <span>✓ Verified Patient</span>
                          </div>
                        )}

                        {/* 7. ADMIN / DOCTOR REPLY */}
                        {review.adminReply && (
                          <div className="mt-3.5 rounded-xl border border-[#C5A45D]/30 bg-[#F7F3E8]/70 p-3.5 sm:p-4 text-xs">
                            <div className="flex items-center justify-between text-[#123C2A] font-bold">
                              <span className="flex items-center gap-1.5 text-[#0B291D]">
                                <MessageSquareQuote size={15} className="text-[#C5A45D]" />
                                Clinic Response ({review.repliedBy || review.doctorName || "Dr. Jeevan Atole"}):
                              </span>
                              {formatDate(review.repliedAt) && (
                                <span className="text-[10px] text-[#66736B] font-normal">
                                  {formatDate(review.repliedAt)}
                                </span>
                              )}
                            </div>
                            <p className="mt-1.5 text-xs leading-relaxed text-[#17231C] italic">
                              "{review.adminReply}"
                            </p>
                          </div>
                        )}
                      </motion.article>
                    ))}
                  </div>
                )}
              </main>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
