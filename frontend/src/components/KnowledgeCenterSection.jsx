import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Leaf,
  HeartPulse,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function KnowledgeCenterSection() {
  const { t } = useLanguage();

  const articles = [
    {
      icon: Leaf,
      tag: t("treatments.ayurvedaTitle", "Ayurveda"),
      title: t("about.heading", "Understanding Ayurveda"),
      description: t("about.paragraph1", "Learn about the traditional Ayurvedic approach and how personalized care begins with understanding your individual needs."),
    },
    {
      icon: HeartPulse,
      tag: t("trust.item3", "Wellness"),
      title: t("whyChoose.heading", "Healthy Living with Ayurveda"),
      description: t("about.paragraph2", "Explore simple wellness principles related to balanced routines, mindful living and supportive Ayurvedic care."),
    },
    {
      icon: BookOpen,
      tag: t("treatments.panchakarmaTitle", "Panchakarma"),
      title: t("faq.q1", "What is Panchakarma?"),
      description: t("faq.a1", "Understand the basics of Panchakarma and why consultation and personalized guidance are important before treatment."),
    },
  ];

  return (
    <section
      id="knowledge-center"
      className="scroll-mt-28 bg-[#F7F3E8] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-[#C5A45D]/40 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#123C2A]">
            {t("knowledge.tag", "Knowledge Center")}
          </span>

          <h2 className="mt-5 font-serif text-4xl font-medium tracking-tight text-[#123C2A] sm:text-5xl">
            {t("knowledge.heading", "Ayurvedic Health Insights & Articles")}
          </h2>

          <p className="mt-5 text-base leading-7 text-[#66736B] sm:text-lg">
            {t("knowledge.subtitle", "Simple, helpful information to help you understand Ayurveda, Panchakarma and wellness before your consultation.")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {articles.map((article, index) => {
            const Icon = article.icon;

            return (
              <motion.article
                key={article.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group rounded-[28px] border border-[#123C2A]/10 bg-white p-7 shadow-[0_18px_50px_rgba(18,60,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(18,60,42,0.12)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#123C2A] text-[#C5A45D]">
                  <Icon size={21} />
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#789B82]">
                  {article.tag}
                </p>

                <h3 className="mt-3 font-serif text-2xl font-medium text-[#123C2A]">
                  {article.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#66736B]">
                  {article.description}
                </p>

                <Link
                  to="/contact"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#123C2A] transition group-hover:text-[#789B82]"
                >
                  {t("knowledge.readMore", "Discuss with the clinic")}
                  <ArrowRight size={16} />
                </Link>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl border border-[#123C2A]/10 bg-[#123C2A] p-6 text-center sm:p-8">
          <p className="text-sm leading-6 text-white/75">
            {t("footer.disclaimer", "Information provided here is for general awareness only and does not replace professional medical consultation.")}
          </p>
        </div>
      </div>
    </section>
  );
}
