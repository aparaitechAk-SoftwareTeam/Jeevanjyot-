import { motion } from "framer-motion";
import {
  HeartHandshake,
  Leaf,
  CalendarCheck,
  MapPin,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function TrustHighlights() {
  const { t } = useLanguage();

  const highlights = [
    {
      number: "01",
      icon: HeartHandshake,
      title: t("trust.item1", "Personalized Consultation"),
      description: t("about.paragraph1", "Individual attention focused on your wellness needs and health journey."),
    },
    {
      number: "02",
      icon: Leaf,
      title: t("trust.item2", "Ayurveda & Panchakarma"),
      description: t("about.paragraph2", "Traditional Ayurvedic principles with a dedicated focus on Panchakarma care."),
    },
    {
      number: "03",
      icon: CalendarCheck,
      title: t("trust.item3", "Easy Appointment"),
      description: t("hero.description", "A simple and convenient way to connect with the clinic and schedule your visit."),
    },
    {
      number: "04",
      icon: MapPin,
      title: t("trust.item4", "Pune Location"),
      description: t("contact.addressVal", "Conveniently located at Sinhagad Road, Vithalwadi, Pune."),
    },
  ];

  return (
    <section className="relative bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#789B82]">
            {t("about.tag", "Why Jeevanjyot")}
          </span>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B291D] sm:text-4xl">
            {t("about.heading", "Dedicated to Natural Healing & Authentic Ayurveda")}
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#66736B] sm:text-base">
            {t("hero.description", "A thoughtful approach to Ayurveda, focused on personalized consultation, traditional care and long-term wellness guidance.")}
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="group rounded-3xl border border-[#123C2A]/10 bg-[#F7F3E8]/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-[#123C2A]/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#123C2A] text-white transition-transform duration-300 group-hover:scale-105">
                    <Icon size={21} />
                  </div>

                  <span className="text-xs font-semibold text-[#C5A45D]">
                    {item.number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-semibold text-[#123C2A]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#66736B]">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default TrustHighlights;
