import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Clock3,
  MessageCircle,
  Navigation,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const clinicAddress =
  "Flat No. 5, Survey No. 24, A Wing, Vishrantinagar Society, near HDFC Bank, in front of Ranka Jewellers lane, Sinhagad Road, Vithalwadi, Pune - 411051";

const mapUrl =
  "https://share.google/yVo3rhuwFaeuZn3pP";

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#123C2A] py-20 sm:py-24 lg:py-28"
    >
      <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#789B82]/15 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#C5A45D]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A45D]">
            {t("contact.tag", "CONTACT & LOCATION")}
          </span>

          <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-[#F7F3E8] sm:text-4xl lg:text-5xl">
            {t("contact.heading", "Visit Our Pune Clinic")}
          </h2>

          <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">
            {t("hero.description", "Have a question or want to schedule a consultation? Get in touch with the clinic directly.")}
          </p>
        </motion.div>

        {/* Contact Grid */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8"
          >
            <h3 className="font-serif text-2xl font-semibold text-[#F7F3E8]">
              Jeevanjyot Nature Cure Ayurvedic Clinic
            </h3>

            <p className="mt-2 text-sm text-white/50">
              {t("footer.brandSub", "& Panchakarma Centre")}
            </p>

            <div className="mt-8 space-y-5">

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C5A45D]/10 text-[#C5A45D]">
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    {t("contact.addressLabel", "Clinic Address")}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-white/75">
                    {t("contact.addressVal", clinicAddress)}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C5A45D]/10 text-[#C5A45D]">
                  <Phone size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    {t("contact.phoneLabel", "Call the Clinic")}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    <a
                      href="tel:9822510456"
                      className="text-sm font-medium text-white transition-colors hover:text-[#C5A45D]"
                    >
                      9822510456
                    </a>

                    <span className="text-white/20">|</span>

                    <a
                      href="tel:9035051086"
                      className="text-sm font-medium text-white transition-colors hover:text-[#C5A45D]"
                    >
                      9035051086
                    </a>
                  </div>
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C5A45D]/10 text-[#C5A45D]">
                  <Clock3 size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    {t("contact.hoursLabel", "Clinic Hours")}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-white/75">
                    {t("contact.hoursVal", "Monday – Saturday: 10:00 AM – 9:00 PM (Sunday Closed)")}
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">

              <a
                href="tel:9822510456"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F7F3E8] px-5 py-3 text-sm font-semibold text-[#123C2A] transition-all duration-300 hover:-translate-y-1 hover:bg-white"
              >
                <Phone size={17} />
                {t("hero.callBtn", "Call Clinic")}
              </a>

              <a
                href="https://wa.me/919822510456"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                <MessageCircle size={17} />
                {t("footer.whatsappUs", "WhatsApp")}
              </a>
            </div>
          </motion.div>

          {/* Map / Visit Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#F7F3E8] p-2 shadow-2xl"
          >
            <div className="relative flex min-h-[430px] flex-col justify-between overflow-hidden rounded-[1.5rem] bg-[#E9E5D9]">

              {/* Map-style Background */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-[12%] top-[18%] h-px w-[75%] rotate-[18deg] bg-[#123C2A]" />
                <div className="absolute left-[5%] top-[48%] h-px w-[90%] -rotate-[12deg] bg-[#123C2A]" />
                <div className="absolute left-[20%] top-[70%] h-px w-[65%] rotate-[8deg] bg-[#123C2A]" />
                <div className="absolute left-[35%] top-0 h-full w-px rotate-[8deg] bg-[#123C2A]" />
                <div className="absolute left-[70%] top-0 h-full w-px -rotate-[15deg] bg-[#123C2A]" />
              </div>

              <div className="relative p-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold text-[#123C2A] shadow-sm backdrop-blur">
                  <CheckCircle2 size={14} />
                  {t("trust.item4", "Pune Location")}
                </div>
              </div>

              {/* Location Pin */}
              <div className="relative flex flex-1 items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#123C2A]/10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#123C2A] text-[#C5A45D] shadow-xl">
                    <MapPin size={30} />
                  </div>
                </div>
              </div>

              {/* Bottom Card */}
              <div className="relative m-5 rounded-2xl bg-white/90 p-5 shadow-xl backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C5A45D]">
                  {t("contact.tag", "Find Us")}
                </p>

                <p className="mt-2 text-sm font-medium leading-6 text-[#123C2A]">
                  Sinhagad Road, Vithalwadi, Pune - 411051
                </p>

                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#123C2A] transition-colors hover:text-[#789B82]"
                >
                  <Navigation size={16} />
                  {t("contact.getDirections", "Open in Google Maps")}
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Final Appointment CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 flex flex-col items-center justify-between gap-5 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-7 text-center sm:px-8 lg:flex-row lg:text-left"
        >
          <div>
            <div className="flex items-center justify-center gap-2 lg:justify-start">
              <CalendarCheck size={18} className="text-[#C5A45D]" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C5A45D]">
                {t("appointment.tag", "APPOINTMENTS")}
              </span>
            </div>

            <h3 className="mt-2 font-serif text-xl font-semibold text-[#F7F3E8] sm:text-2xl">
              {t("appointment.heading", "Schedule Your Ayurvedic Consultation")}
            </h3>
          </div>

          <a
            href="tel:9822510456"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#C5A45D] px-7 py-3.5 text-sm font-semibold text-[#0B291D] transition-all duration-300 hover:-translate-y-1 hover:bg-[#d4b66f] hover:shadow-xl"
          >
            <CalendarCheck size={17} />
            {t("hero.callBtn", "Book by Phone")}
          </a>
        </motion.div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-white/35">
          {t("footer.disclaimer", "Please confirm appointment availability with the clinic before visiting.")}
        </p>
      </div>
    </section>
  );
}
