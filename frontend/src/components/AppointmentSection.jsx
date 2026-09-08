import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Phone,
  Send,
  UserRound,
  AlertCircle,
  Clock,
  Stethoscope,
  MessageSquare,
  Leaf,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AppointmentSection() {
  const { t } = useLanguage();

  const careOptions = [
    t("treatments.ayurvedaTitle", "Ayurvedic Care"),
    t("treatments.panchakarmaTitle", "Panchakarma"),
    t("treatments.diabetesTitle", "Diabetes Care"),
    t("treatments.infertilityTitle", "Infertility Care"),
    t("specialized.jointCare", "Nature Cure"),
    t("hero.badge", "Personalized Wellness"),
  ];

  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    email: "",
    care: "",
    preferredDate: "",
    timeSlot: "10:00 AM - 10:30 AM",
    doctorId: "",
    message: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isHoliday, setIsHoliday] = useState(false);
  const [holidayReason, setHolidayReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch doctors list for appointment select
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_URL}/doctors`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.doctors)) {
            setDoctors(data.doctors);
          }
        }
      } catch (err) {
        // Soft fallback
      }
    };
    fetchDoctors();
  }, []);

  // Fetch available slots when preferredDate changes
  useEffect(() => {
    if (!form.preferredDate) {
      setAvailableSlots([]);
      setIsHoliday(false);
      return;
    }

    const fetchSlots = async () => {
      try {
        setSlotsLoading(true);
        const url = `${API_URL}/appointments/available-slots?date=${form.preferredDate}${
          form.doctorId ? `&doctorId=${form.doctorId}` : ""
        }`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data.isHoliday) {
            setIsHoliday(true);
            setHolidayReason(data.holidayReason);
            setAvailableSlots([]);
          } else {
            setIsHoliday(false);
            setHolidayReason("");
            setAvailableSlots(data.availableSlots || []);
          }
        }
      } catch (err) {
        // Ignore slot check error
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [form.preferredDate, form.doctorId]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isHoliday) {
      setError(`Clinic is closed on selected date (${holidayReason}). Please pick another date.`);
      return;
    }

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit appointment.");
      }

      setSuccess(
        `${t("appointment.successTitle", "Appointment Request Submitted Successfully!")} ${t("appointment.successMessage", "Booking ID:")} ${data.appointment.bookingId}.`
      );

      setForm({
        patientName: "",
        phone: "",
        email: "",
        care: "",
        preferredDate: "",
        timeSlot: "10:00 AM - 10:30 AM",
        doctorId: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please call the clinic directly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="book-appointment"
      className="relative scroll-mt-28 bg-[#F7F3E8] py-16 sm:py-24 overflow-hidden"
    >
      {/* Soft Background Accents */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#789B82]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#C5A45D]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Left Info Column */}
          <div className="lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#123C2A]/15 bg-[#123C2A]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#123C2A]">
              <Leaf size={13} className="text-[#C5A45D]" />
              <span>{t("appointment.tag", "BOOK APPOINTMENT")}</span>
            </div>

            <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#123C2A] sm:text-4xl lg:text-5xl">
              {t("appointment.heading", "Schedule Your Ayurvedic Consultation")}
            </h2>

            <p className="mt-4 text-base leading-relaxed text-[#66736B] sm:text-lg">
              {t("appointment.subtitle", "Fill in your details below to request a doctor appointment. Our medical team will verify and confirm your preferred slot.")}
            </p>

            {/* Trust Cards */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4 rounded-2xl border border-[#123C2A]/10 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition hover:border-[#123C2A]/20">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#123C2A]/10 text-[#123C2A]">
                  <UserRound size={20} />
                </div>
                <div>
                  <p className="font-semibold text-[#17231C]">
                    {t("trust.item1", "Personalized Consultation")}
                  </p>
                  <p className="mt-0.5 text-xs sm:text-sm text-[#66736B]">
                    {t("doctor.tag", "Consult with experienced Ayurvedic practitioners.")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-[#123C2A]/10 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition hover:border-[#123C2A]/20">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#123C2A]/10 text-[#123C2A]">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <p className="font-semibold text-[#17231C]">
                    {t("trust.item3", "Easy Appointment")}
                  </p>
                  <p className="mt-0.5 text-xs sm:text-sm text-[#66736B]">
                    {t("appointment.dateLabel", "Choose convenient date and time slots.")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-[#123C2A]/10 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition hover:border-[#123C2A]/20">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#123C2A]/10 text-[#123C2A]">
                  <Clock3 size={20} />
                </div>
                <div>
                  <p className="font-semibold text-[#17231C]">
                    {t("contact.hoursLabel", "Clinic Hours")}
                  </p>
                  <p className="mt-0.5 text-xs sm:text-sm text-[#66736B]">
                    {t("hero.timing", "Monday–Saturday · 10:00 AM–09:00 PM")}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Contact Badge */}
            <div className="mt-8 rounded-2xl border border-[#C5A45D]/30 bg-gradient-to-br from-[#123C2A] to-[#0B291D] p-5 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C5A45D]/20 text-[#C5A45D]">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#C5A45D]">Need Immediate Help?</p>
                  <a href="tel:9822510456" className="text-base font-bold text-white hover:underline">
                    +91 98225 10456
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Card Redesign */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2.5rem] border border-[#123C2A]/10 bg-[#FFFDF8] p-6 shadow-[0_20px_50px_rgba(11,41,29,0.08)] sm:p-10"
          >
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#123C2A] via-[#C5A45D] to-[#123C2A]" />

            {/* Form Header Inside Card */}
            <div className="mb-8 border-b border-[#123C2A]/10 pb-6">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#123C2A]/10 text-[#123C2A]">
                  <CalendarDays size={16} />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#123C2A]">
                  {t("appointment.tag", "BOOK YOUR VISIT")}
                </span>
              </div>
              <h3 className="mt-2 font-serif text-2xl font-bold text-[#123C2A] sm:text-3xl">
                {t("appointment.heading", "Schedule Your Consultation")}
              </h3>
              <p className="mt-1 text-sm text-[#66736B]">
                {t("appointment.subtitle", "Share your details and preferred date. Our clinic team will coordinate your appointment.")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name & Phone Number */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#17231C]">
                    <span>
                      {t("appointment.nameLabel", "Full Name")}{" "}
                      <span className="text-rose-500">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#66736B]">
                      <UserRound size={17} />
                    </div>
                    <input
                      type="text"
                      name="patientName"
                      value={form.patientName}
                      onChange={handleChange}
                      required
                      placeholder={t("appointment.namePlaceholder", "Enter your full name")}
                      className="w-full rounded-2xl border border-[#123C2A]/15 bg-[#F7F3E8]/40 pl-10 pr-4 py-3 text-sm text-[#17231C] outline-none placeholder:text-[#66736B]/60 transition-all duration-200 hover:border-[#123C2A]/30 focus:border-[#123C2A] focus:bg-white focus:ring-4 focus:ring-[#123C2A]/8"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#17231C]">
                    <span>
                      {t("appointment.phoneLabel", "Phone Number")}{" "}
                      <span className="text-rose-500">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#66736B]">
                      <Phone size={17} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      maxLength="10"
                      placeholder={t("appointment.phonePlaceholder", "Enter 10-digit mobile number")}
                      className="w-full rounded-2xl border border-[#123C2A]/15 bg-[#F7F3E8]/40 pl-10 pr-4 py-3 text-sm text-[#17231C] outline-none placeholder:text-[#66736B]/60 transition-all duration-200 hover:border-[#123C2A]/30 focus:border-[#123C2A] focus:bg-white focus:ring-4 focus:ring-[#123C2A]/8"
                    />
                  </div>
                </div>
              </div>

              {/* Treatment Category & Doctor */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div className={doctors.length > 0 ? "" : "sm:col-span-2"}>
                  <label className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#17231C]">
                    <span>
                      {t("appointment.treatmentLabel", "Treatment Category")}{" "}
                      <span className="text-rose-500">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#66736B]">
                      <Stethoscope size={17} />
                    </div>
                    <select
                      name="care"
                      value={form.care}
                      onChange={handleChange}
                      required
                      className="w-full cursor-pointer appearance-none rounded-2xl border border-[#123C2A]/15 bg-[#F7F3E8]/40 pl-10 pr-4 py-3 text-sm text-[#17231C] outline-none transition-all duration-200 hover:border-[#123C2A]/30 focus:border-[#123C2A] focus:bg-white focus:ring-4 focus:ring-[#123C2A]/8"
                    >
                      <option value="">{t("appointment.treatmentDefault", "Select care option")}</option>
                      {careOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#66736B]">
                      <ChevronRight size={16} className="rotate-90" />
                    </div>
                  </div>
                </div>

                {doctors.length > 0 && (
                  <div>
                    <label className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#17231C]">
                      <span>{t("doctor.tag", "Select Doctor")}</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#66736B]">
                        <UserRound size={17} />
                      </div>
                      <select
                        name="doctorId"
                        value={form.doctorId}
                        onChange={handleChange}
                        className="w-full cursor-pointer appearance-none rounded-2xl border border-[#123C2A]/15 bg-[#F7F3E8]/40 pl-10 pr-4 py-3 text-sm text-[#17231C] outline-none transition-all duration-200 hover:border-[#123C2A]/30 focus:border-[#123C2A] focus:bg-white focus:ring-4 focus:ring-[#123C2A]/8"
                      >
                        <option value="">Dr. Jeevan Atole</option>
                        {doctors.map((doc) => (
                          <option key={doc._id} value={doc._id}>
                            {doc.name} ({doc.specialization || "Ayurvedic Care"})
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#66736B]">
                        <ChevronRight size={16} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preferred Date & Slot */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div className={availableSlots.length > 0 && !isHoliday ? "" : "sm:col-span-2"}>
                  <label className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#17231C]">
                    <span>
                      {t("appointment.dateLabel", "Preferred Date")}{" "}
                      <span className="text-rose-500">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#66736B]">
                      <CalendarDays size={17} />
                    </div>
                    <input
                      type="date"
                      name="preferredDate"
                      value={form.preferredDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full rounded-2xl border border-[#123C2A]/15 bg-[#F7F3E8]/40 pl-10 pr-4 py-3 text-sm text-[#17231C] outline-none transition-all duration-200 hover:border-[#123C2A]/30 focus:border-[#123C2A] focus:bg-white focus:ring-4 focus:ring-[#123C2A]/8"
                    />
                  </div>
                </div>

                {availableSlots.length > 0 && !isHoliday && (
                  <div>
                    <label className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#17231C]">
                      <span>
                        {t("appointment.timeLabel", "Time Slot")}{" "}
                        <span className="text-rose-500">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#66736B]">
                        <Clock size={17} />
                      </div>
                      <select
                        name="timeSlot"
                        value={form.timeSlot}
                        onChange={handleChange}
                        required
                        className="w-full cursor-pointer appearance-none rounded-2xl border border-[#123C2A]/15 bg-[#F7F3E8]/40 pl-10 pr-4 py-3 text-sm text-[#17231C] outline-none transition-all duration-200 hover:border-[#123C2A]/30 focus:border-[#123C2A] focus:bg-white focus:ring-4 focus:ring-[#123C2A]/8"
                      >
                        {availableSlots.map((item) => (
                          <option
                            key={item.slot}
                            value={item.slot}
                            disabled={!item.isAvailable}
                          >
                            {item.slot} {!item.isAvailable ? "(Booked)" : ""}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#66736B]">
                        <ChevronRight size={16} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Holiday Notice */}
              {isHoliday && (
                <div className="flex items-center gap-3 rounded-2xl border border-amber-200/80 bg-amber-50 p-4 text-xs sm:text-sm text-amber-900 shadow-sm">
                  <AlertCircle size={20} className="shrink-0 text-amber-600" />
                  <span>
                    Clinic closed on selected date: <strong>{holidayReason}</strong>
                  </span>
                </div>
              )}

              {/* Health Concern / Message */}
              <div>
                <label className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#17231C]">
                  <span>{t("appointment.notesLabel", "Health Concern / Message")}</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute top-3.5 left-3.5 text-[#66736B]">
                    <MessageSquare size={17} />
                  </div>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="3"
                    placeholder={t("appointment.notesPlaceholder", "Describe your health symptoms or queries")}
                    className="w-full resize-none rounded-2xl border border-[#123C2A]/15 bg-[#F7F3E8]/40 pl-10 pr-4 py-3 text-sm text-[#17231C] outline-none placeholder:text-[#66736B]/60 transition-all duration-200 hover:border-[#123C2A]/30 focus:border-[#123C2A] focus:bg-white focus:ring-4 focus:ring-[#123C2A]/8"
                  />
                </div>
              </div>

              {/* Success Alert */}
              {success && (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900 shadow-sm">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} />
                  <div>
                    <p className="font-semibold">{t("appointment.successTitle", "Appointment Request Submitted Successfully!")}</p>
                    <p className="mt-0.5 text-xs text-emerald-800">{success}</p>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-sm leading-relaxed text-rose-900 shadow-sm">
                  <AlertCircle className="mt-0.5 shrink-0 text-rose-600" size={20} />
                  <p>{error}</p>
                </div>
              )}

              {/* CTA Buttons Group */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || isHoliday}
                  className="group relative flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#123C2A] via-[#1A4B36] to-[#123C2A] px-6 py-4 font-semibold text-white shadow-[0_10px_25px_rgba(18,60,42,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_rgba(18,60,42,0.35)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <Send size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                  <span>
                    {loading ? t("appointment.submittingBtn", "Booking Appointment...") : t("appointment.submitBtn", "Confirm & Book Appointment")}
                  </span>
                </button>

                <a
                  href="tel:9822510456"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#123C2A]/20 bg-white px-5 py-3.5 text-sm font-semibold text-[#123C2A] shadow-sm transition-all duration-200 hover:border-[#123C2A]/40 hover:bg-[#F7F3E8]/60"
                >
                  <Phone size={16} className="text-[#C5A45D]" />
                  <span>{t("hero.callBtn", "Call Clinic")} (9822510456)</span>
                </a>
              </div>

              {/* Trust Footer Notice */}
              <p className="pt-2 text-center text-xs text-[#66736B]">
                🔒 {t("trust.secure", "Your information is strictly confidential & secure.")}
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
