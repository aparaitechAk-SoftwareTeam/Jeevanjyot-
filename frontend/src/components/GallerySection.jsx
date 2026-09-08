import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Expand, Leaf } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const galleryItems = [
  {
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    title: "Ayurvedic Wellness",
    category: "Wellness",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
    title: "Natural Care",
    category: "Ayurveda",
  },
  {
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    title: "Panchakarma Care",
    category: "Panchakarma",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80",
    title: "Calm & Relaxing Environment",
    category: "Care",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=80",
    title: "Traditional Wellness",
    category: "Ayurveda",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    title: "Mind & Body Wellness",
    category: "Wellness",
  },
];

export default function GallerySection() {
  const { t } = useLanguage();

  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-[#F7F3E8] py-20 sm:py-24 lg:py-28"
    >
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#789B82]/10 blur-3xl" />
      <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#C5A45D]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#123C2A]/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#123C2A]">
            <Leaf size={14} />
            {t("gallery.tag", "GALLERY")}
          </div>

          <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-[#123C2A] sm:text-4xl lg:text-5xl">
            {t("gallery.heading", "Explore Our Clinic & Panchakarma Facilities")}
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#66736B] sm:text-base">
            {t("gallery.subtitle", "Take a glimpse into our modern, hygienic Ayurvedic wellness centre.")}
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              className="group relative overflow-hidden rounded-[1.75rem] bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0B291D]/80 via-transparent to-transparent opacity-80" />

                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#123C2A] opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:opacity-100">
                  <Expand size={17} />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C5A45D]">
                    {item.category}
                  </span>

                  <h3 className="mt-1 text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            to="/book-appointment"
            className="group inline-flex items-center gap-2 rounded-full bg-[#123C2A] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#0B291D] hover:shadow-xl"
          >
            {t("hero.bookBtn", "Visit Jeevanjyot")}
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
