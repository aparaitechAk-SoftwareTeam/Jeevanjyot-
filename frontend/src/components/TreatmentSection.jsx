import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Sparkles,
  HeartPulse,
  Flower2,
  Activity,
  Stethoscope,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Layers,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import {
  getTranslatedTreatmentName,
  filterTreatmentsBySearch,
} from "../utils/treatmentTranslations";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BASE_CATEGORIES = [
  "Treatment",
  "Massage",
  "Management",
  "Skin Care",
  "Therapy",
  "Services",
  "Body Care",
  "Surgery",
  "Gender",
  "Amenities",
];

const CATEGORY_ICONS = {
  Treatment: Leaf,
  Massage: Sparkles,
  Management: Activity,
  "Skin Care": Stethoscope,
  Therapy: HeartPulse,
  Services: Flower2,
  "Body Care": ShieldCheck,
  Surgery: Activity,
  Gender: HeartPulse,
  Amenities: Layers,
};

export default function TreatmentSection() {
  const { t, language } = useLanguage();
  const [dbTreatments, setDbTreatments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Treatment");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicTreatments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/treatments`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.treatments)) {
            setDbTreatments(data.treatments);
          }
        }
      } catch (err) {
        console.error("Failed to fetch public treatments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicTreatments();
  }, []);

  // Dynamically derive categories (BASE_CATEGORIES + any new ones added via Admin)
  const categoriesList = useMemo(() => {
    const set = new Set(BASE_CATEGORIES);
    dbTreatments.forEach((item) => {
      if (item.category) {
        set.add(item.category);
      }
    });
    return Array.from(set);
  }, [dbTreatments]);

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts = {};
    categoriesList.forEach((cat) => {
      counts[cat] = 0;
    });
    dbTreatments.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      } else {
        counts[item.category] = 1;
      }
    });
    return counts;
  }, [dbTreatments, categoriesList]);

  // Filtered treatments by selected category & optional multi-language search
  const filteredTreatments = useMemo(() => {
    const categoryTreatments = dbTreatments.filter(
      (item) => item.category === selectedCategory
    );
    return filterTreatmentsBySearch(categoryTreatments, search, language);
  }, [dbTreatments, selectedCategory, search, language]);

  return (
    <section
      id="treatments"
      className="relative overflow-hidden bg-[#F7F3E8] py-16 sm:py-24 lg:py-28"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#789B82]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#C5A45D]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#789B82]">
            {t("treatments.tag", "Clinical Services & Specialties")}
          </span>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#123C2A] sm:text-4xl lg:text-5xl">
            {t("treatments.heading", "Care Designed Around Your Wellness")}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#66736B] sm:text-base sm:leading-7">
            {t(
              "treatments.subtitle",
              "Explore our comprehensive range of verified Ayurvedic therapies, Panchakarma care, and clinical services."
            )}
          </p>
        </motion.div>

        {/* MOBILE & TABLET CATEGORY SELECTOR (Horizontal Scroll) */}
        <div className="mt-8 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
            {categoriesList.map((category) => {
              const Icon = CATEGORY_ICONS[category] || Leaf;
              const isSelected = selectedCategory === category;
              const count = categoryCounts[category] || 0;

              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearch("");
                  }}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-[#123C2A] text-white shadow-md shadow-[#123C2A]/15"
                      : "border border-[#123C2A]/10 bg-white text-[#66736B] hover:bg-[#F7F3E8] hover:text-[#123C2A]"
                  }`}
                >
                  <Icon size={14} className={isSelected ? "text-[#C5A45D]" : "text-[#789B82]"} />
                  <span>{category}</span>
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[#F7F3E8] text-[#123C2A]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar on Mobile */}
          <div className="relative mt-3">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66736B]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search within ${selectedCategory}...`}
              className="h-10 w-full rounded-xl border border-[#123C2A]/12 bg-white pl-10 pr-4 text-xs text-[#17231C] shadow-sm outline-none transition focus:border-[#789B82] focus:ring-2 focus:ring-[#789B82]/15"
            />
          </div>
        </div>

        {/* MAIN LAYOUT: DESKTOP STICKY SIDEBAR + CONTENT GRID */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* DESKTOP STICKY SIDEBAR */}
          <aside className="hidden lg:sticky lg:top-24 lg:col-span-4 lg:block xl:col-span-3">
            <div className="rounded-3xl border border-[#123C2A]/10 bg-white p-5 shadow-[0_12px_35px_rgba(18,60,42,0.06)]">
              {/* Sidebar Header */}
              <div className="mb-4 pb-4 border-b border-[#123C2A]/8">
                <h3 className="flex items-center gap-2 text-base font-bold text-[#123C2A]">
                  <Layers size={18} className="text-[#789B82]" />
                  Categories
                </h3>
                <p className="mt-1 text-xs text-[#66736B]">
                  Select a category to view specialized treatments.
                </p>

                {/* In-category Search Input */}
                <div className="relative mt-4">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#66736B]"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`Search in ${selectedCategory}...`}
                    className="h-10 w-full rounded-xl border border-[#123C2A]/10 bg-[#F7F3E8]/50 pl-9 pr-3 text-xs text-[#17231C] outline-none transition focus:border-[#789B82] focus:bg-white focus:ring-2 focus:ring-[#789B82]/15"
                  />
                </div>
              </div>

              {/* Category Navigation Items */}
              <nav className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {categoriesList.map((category) => {
                  const Icon = CATEGORY_ICONS[category] || Leaf;
                  const isSelected = selectedCategory === category;
                  const count = categoryCounts[category] || 0;

                  return (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setSearch("");
                      }}
                      className={`group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                        isSelected
                          ? "bg-[#123C2A] text-white shadow-md shadow-[#123C2A]/15 translate-x-1"
                          : "text-[#123C2A] hover:bg-[#F7F3E8] hover:translate-x-0.5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                            isSelected
                              ? "bg-white/15 text-[#C5A45D]"
                              : "bg-[#789B82]/12 text-[#123C2A] group-hover:bg-[#123C2A] group-hover:text-white"
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <span className="truncate">{category}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-[#F7F3E8] text-[#66736B] group-hover:bg-[#123C2A]/10 group-hover:text-[#123C2A]"
                          }`}
                        >
                          {count}
                        </span>
                        <ChevronRight
                          size={14}
                          className={`transition-transform ${
                            isSelected
                              ? "text-[#C5A45D] translate-x-0.5"
                              : "opacity-0 group-hover:opacity-100 text-[#66736B]"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* RIGHT CONTENT GRID */}
          <main className="lg:col-span-8 xl:col-span-9">
            {/* Category Header Bar */}
            <div className="mb-6 flex flex-col gap-2 border-b border-[#123C2A]/8 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#789B82]">
                  Category Selected
                </span>
                <h3 className="text-2xl font-bold text-[#123C2A]">
                  {selectedCategory}
                </h3>
              </div>

              <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#123C2A]/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#123C2A] shadow-sm sm:self-auto">
                <CheckCircle2 size={14} className="text-[#789B82]" />
                {filteredTreatments.length} {filteredTreatments.length === 1 ? "Service Available" : "Services Available"}
              </span>
            </div>

            {/* Loading Indicator */}
            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-[#123C2A]/8 bg-white p-12 text-center">
                <div>
                  <Leaf size={32} className="mx-auto animate-spin text-[#789B82]" />
                  <p className="mt-3 text-sm text-[#66736B]">Loading treatments...</p>
                </div>
              </div>
            ) : filteredTreatments.length === 0 ? (
              /* Empty State */
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-[#123C2A]/8 bg-white p-8 text-center shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#789B82]/15 text-[#123C2A]">
                  <Leaf size={28} />
                </div>
                <h4 className="mt-4 text-lg font-bold text-[#123C2A]">
                  No treatments found in {selectedCategory}
                </h4>
                <p className="mt-1 max-w-sm text-xs leading-5 text-[#66736B]">
                  {search
                    ? `No matching treatments found for "${search}". Try clearing your search.`
                    : "No procedures listed under this category currently."}
                </p>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="mt-4 rounded-xl bg-[#123C2A] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0B291D]"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              /* Treatments Cards Grid */
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filteredTreatments.map((treatment, index) => {
                    const CategoryIcon = CATEGORY_ICONS[treatment.category] || Leaf;

                    return (
                      <motion.div
                        key={treatment._id || treatment.treatmentId || treatment.name}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                        whileHover={{ y: -5 }}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#123C2A]/10 bg-white p-6 shadow-[0_10px_30px_rgba(18,60,42,0.05)] transition-all duration-300 hover:border-[#789B82]/40 hover:shadow-[0_18px_40px_rgba(18,60,42,0.12)]"
                      >
                        <div>
                          {/* Card Header: Icon + Category Badge */}
                          <div className="flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#123C2A] text-white shadow-md shadow-[#123C2A]/15 transition-transform duration-300 group-hover:scale-105">
                              <CategoryIcon size={22} strokeWidth={1.8} />
                            </div>
                            <span className="rounded-full border border-[#123C2A]/10 bg-[#F7F3E8] px-3 py-1 text-[11px] font-semibold text-[#123C2A]">
                              {treatment.category}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="mt-5 text-lg font-bold leading-snug text-[#123C2A] group-hover:text-[#0B291D]">
                            {getTranslatedTreatmentName(treatment.name, language)}
                          </h4>

                          {/* Description */}
                          <p className="mt-2.5 text-xs leading-relaxed text-[#66736B] line-clamp-3">
                            {treatment.description || "Ayurvedic clinical service available at Jeevanjyot Centre."}
                          </p>
                        </div>

                        {/* Card Footer: Metadata + CTA */}
                        <div className="mt-6 pt-4 border-t border-[#123C2A]/8">
                          {treatment.duration && (
                            <p className="mb-3 flex items-center gap-1.5 text-[11px] font-medium text-[#66736B]">
                              <Clock size={13} className="text-[#789B82]" />
                              <span>{treatment.duration}</span>
                            </p>
                          )}

                          <Link
                            to="/book-appointment"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#123C2A]/15 bg-[#F7F3E8]/60 px-4 py-2.5 text-xs font-bold text-[#123C2A] transition-all hover:bg-[#123C2A] hover:text-white group-hover:border-[#123C2A]"
                          >
                            <span>Book Consultation</span>
                            <ArrowRight size={14} />
                          </Link>
                        </div>

                        {/* Gold Hover Accent Bar */}
                        <div className="absolute bottom-0 left-6 right-6 h-0.5 origin-left scale-x-0 bg-[#C5A45D] transition-transform duration-300 group-hover:scale-x-100" />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 text-center"
        >
          <Link
            to="/book-appointment"
            className="inline-flex items-center gap-2.5 rounded-full bg-[#123C2A] px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-[#123C2A]/15 transition-all hover:bg-[#0B291D] hover:shadow-2xl"
          >
            {t("hero.bookBtn", "Schedule Consultation")}
            <ArrowRight size={17} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
