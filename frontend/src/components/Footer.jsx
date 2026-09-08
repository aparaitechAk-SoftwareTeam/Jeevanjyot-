import { Link } from "react-router-dom";
import { Phone, MessageCircle, CalendarCheck, MapPin, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <>
      {/* Footer */}
      <footer className="bg-[#0B291D] pb-28 text-white lg:pb-10">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">

          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C5A45D]/30 bg-[#C5A45D]/10 text-[#C5A45D]">
                  <span className="font-serif text-xl font-bold">J</span>
                </div>

                <div>
                  <p className="font-serif text-xl font-semibold text-[#F7F3E8]">
                    Jeevanjyot
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                    {t("footer.brandSub", "Nature Cure & Panchakarma")}
                  </p>
                </div>
              </div>

              <p className="mt-6 max-w-sm text-sm leading-7 text-white/50">
                {t("hero.description", "Ayurveda and Panchakarma care with a personalized, doctor-guided approach in Pune.")}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
                <MapPin size={14} className="text-[#C5A45D]" />
                {t("trust.item4", "Vithalwadi, Pune")}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#C5A45D]">
                {t("footer.quickLinks", "Quick Links")}
              </h3>

              <div className="mt-5 space-y-3">
                <Link to="/" className="block text-sm text-white/55 transition hover:text-white">
                  {t("nav.home", "Home")}
                </Link>
                <Link to="/about" className="block text-sm text-white/55 transition hover:text-white">
                  {t("nav.about", "About Clinic")}
                </Link>
                <Link to="/treatments" className="block text-sm text-white/55 transition hover:text-white">
                  {t("nav.treatments", "Treatments")}
                </Link>
                <Link to="/doctor" className="block text-sm text-white/55 transition hover:text-white">
                  {t("nav.doctor", "Doctor")}
                </Link>
                <Link to="/about" className="block text-sm text-white/55 transition hover:text-white">
                  {t("faq.tag", "FAQ")}
                </Link>
                <Link to="/contact" className="block text-sm text-white/55 transition hover:text-white">
                  {t("nav.contact", "Contact")}
                </Link>
              </div>
            </div>

            {/* Treatments */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#C5A45D]">
                {t("footer.careTitle", "Ayurvedic Care")}
              </h3>

              <div className="mt-5 space-y-3">
                <Link to="/treatments" className="block text-sm text-white/55 transition hover:text-white">
                  {t("treatments.ayurvedaTitle", "Ayurveda")}
                </Link>
                <Link to="/panchakarma" className="block text-sm text-white/55 transition hover:text-white">
                  {t("treatments.panchakarmaTitle", "Panchakarma")}
                </Link>
                <Link to="/treatments" className="block text-sm text-white/55 transition hover:text-white">
                  {t("treatments.diabetesTitle", "Diabetes Care")}
                </Link>
                <Link to="/treatments" className="block text-sm text-white/55 transition hover:text-white">
                  {t("treatments.infertilityTitle", "Infertility Care")}
                </Link>
                <Link to="/about" className="block text-sm text-white/55 transition hover:text-white">
                  {t("journey.tag", "Patient Journey")}
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#C5A45D]">
                {t("footer.contactTitle", "Get in Touch")}
              </h3>

              <div className="mt-5 space-y-3">
                <a
                  href="tel:9822510456"
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm font-medium text-white/80 transition hover:border-[#C5A45D]/40 hover:bg-white/10 hover:text-white"
                >
                  <Phone size={16} className="text-[#C5A45D] shrink-0" />
                  <span>{t("footer.callUs", "Call: 9822510456")}</span>
                </a>

                <a
                  href="tel:9035051086"
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm font-medium text-white/80 transition hover:border-[#C5A45D]/40 hover:bg-white/10 hover:text-white"
                >
                  <Phone size={16} className="text-[#C5A45D] shrink-0" />
                  <span>{t("footer.altCall", "Alt: 9035051086")}</span>
                </a>

                <a
                  href="https://wa.me/919822510456"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-sm font-semibold text-emerald-400 transition hover:border-emerald-500/40 hover:bg-emerald-500/20 hover:text-emerald-300"
                >
                  <MessageCircle size={16} className="text-emerald-400 shrink-0" />
                  <span>{t("footer.whatsappUs", "WhatsApp Us")}</span>
                </a>

                <p className="text-xs leading-5 text-white/45 pt-1">
                  {t("footer.hours", "Monday – Saturday: 10:00 AM – 9:00 PM")}
                </p>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#C5A45D] transition hover:text-[#F7F3E8]"
                >
                  {t("footer.directions", "Get Directions")}
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {t("footer.copyright", `© ${year} Jeevanjyot Nature Cure Ayurvedic Clinic & Panchakarma Centre. All rights reserved.`)}
            </p>

            <p>
              {t("footer.disclaimer", "Website information is for general awareness and does not replace professional medical consultation.")}
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#123C2A]/10 bg-[#F7F3E8]/95 p-2 shadow-[0_-8px_30px_rgba(11,41,29,0.12)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">

          <a
            href="tel:9822510456"
            className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#123C2A] py-2.5 text-[#F7F3E8] transition active:scale-95"
          >
            <Phone size={18} />
            <span className="text-[10px] font-semibold">{t("mobileBar.call", "Call")}</span>
          </a>

          <a
            href="https://wa.me/919822510456"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#789B82] py-2.5 text-white transition active:scale-95"
          >
            <MessageCircle size={18} />
            <span className="text-[10px] font-semibold">{t("mobileBar.whatsapp", "WhatsApp")}</span>
          </a>

          <Link
            to="/book-appointment"
            className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#C5A45D] py-2.5 text-[#0B291D] transition active:scale-95"
          >
            <CalendarCheck size={18} />
            <span className="text-[10px] font-semibold">{t("mobileBar.book", "Book")}</span>
          </Link>

        </div>
      </div>
    </>
  );
}
