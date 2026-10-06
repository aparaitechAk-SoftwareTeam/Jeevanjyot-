import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  User,
  LogOut,
  Leaf,
  Clock,
  Printer,
  ShieldCheck,
  RefreshCw,
  Phone,
  Star,
  X,
  CheckCircle2,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";
import { getTranslatedTreatmentName } from "../utils/treatmentTranslations";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function formatDate(date) {
  if (!date) return "—";
  const val = new Date(date);
  if (Number.isNaN(val.getTime())) return date;
  return val.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PatientPortal() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);

  const [activeTab, setActiveTab] = useState("appointments");
  const [loading, setLoading] = useState(true);

  // Review Modal state
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const token = localStorage.getItem("jeevanjyot_patient_token");

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const [resP, resA, resRx, resDoc] = await Promise.all([
        fetch(`${API_URL}/patient/profile`, { headers }),
        fetch(`${API_URL}/patient/appointments`, { headers }),
        fetch(`${API_URL}/patient/prescriptions`, { headers }),
        fetch(`${API_URL}/patient/reports`, { headers }),
      ]);

      if (resP.status === 401) {
        logout();
        return;
      }

      const dataP = await resP.json();
      const dataA = await resA.json();
      const dataRx = await resRx.json();
      const dataDoc = await resDoc.json();

      if (dataP.success) setPatient(dataP.patient);
      if (dataA.success) setAppointments(dataA.appointments || []);
      if (dataRx.success) setPrescriptions(dataRx.prescriptions || []);
      if (dataDoc.success) setReports(dataDoc.documents || []);
    } catch (err) {
      // Handle token issue
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/patient/login", { replace: true });
      return;
    }

    fetchPatientData();
  }, [navigate, token]);

  const logout = () => {
    localStorage.removeItem("jeevanjyot_patient_token");
    localStorage.removeItem("jeevanjyot_patient");
    navigate("/patient/login", { replace: true });
  };

  const openReviewModal = (appointment) => {
    setSelectedAppointmentForReview(appointment);
    setRating(5);
    setReviewText("");
    setReviewError("");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointmentForReview) return;

    if (!reviewText.trim()) {
      setReviewError("Please write a few words about your experience.");
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError("");

      const response = await fetch(`${API_URL}/patient/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId: selectedAppointmentForReview._id,
          rating,
          reviewText: reviewText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review.");
      }

      setSelectedAppointmentForReview(null);
      setReviewText("");
      setToastMessage("Thank you. Your review has been submitted and is awaiting approval.");
      setTimeout(() => setToastMessage(""), 5000);

      // Refresh appointments to reflect submitted review
      await fetchPatientData();
    } catch (err) {
      setReviewError(err.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3E8] text-[#17231C]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0B291D] px-6 py-4 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#789B82]/20 text-[#C5A45D]">
              <Leaf size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] text-[#C5A45D]">JEEVANJYOT</p>
              <h1 className="text-base font-semibold">Patient Wellness Portal</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-white/70 sm:inline">
              Welcome, {patient?.name || "Patient"}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm">
            <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
            <p className="flex-1 font-medium">{toastMessage}</p>
            <button onClick={() => setToastMessage("")} className="text-xs font-bold underline">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* PATIENT INFO BANNER */}
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm border border-[#123C2A]/8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="rounded-lg bg-[#F7F3E8] px-3 py-1 text-xs font-bold text-[#123C2A]">
              Patient ID: {patient?.patientId || "—"}
            </span>
            <h2 className="mt-2 text-2xl font-bold text-[#123C2A]">{patient?.name}</h2>
            <p className="text-xs text-[#66736B] mt-1">Mobile: {patient?.phone || "—"}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="/#book-appointment"
              className="rounded-xl bg-[#123C2A] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0B291D]"
            >
              Book New Appointment
            </a>
          </div>
        </div>

        {/* TABS */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-[#123C2A]/10 pb-4">
          {[
            { id: "appointments", label: "My Appointments", icon: CalendarDays, count: appointments.length },
            { id: "prescriptions", label: "My Prescriptions (Rx)", icon: ClipboardList, count: prescriptions.length },
            { id: "reports", label: "My Medical Documents", icon: FileText, count: reports.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                  isSelected
                    ? "bg-[#123C2A] text-white shadow-sm"
                    : "bg-white text-[#66736B] hover:bg-[#F7F3E8] border border-[#123C2A]/10"
                }`}
              >
                <Icon size={17} />
                <span>{tab.label}</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{tab.count}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT */}
        <div className="rounded-3xl border border-[#123C2A]/8 bg-white p-6 shadow-sm">
          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <RefreshCw size={25} className="animate-spin text-[#789B82]" />
            </div>
          ) : activeTab === "appointments" ? (
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <div className="text-center py-10">
                  <CalendarDays size={32} className="mx-auto text-[#789B82]" />
                  <p className="mt-2 text-sm text-[#66736B]">No appointment records found.</p>
                </div>
              ) : (
                appointments.map((a) => {
                  const isCompleted = a.status === "completed";
                  const hasReview = a.hasReview || Boolean(a.review);

                  return (
                    <div
                      key={a._id}
                      className="rounded-2xl border border-[#123C2A]/10 p-5 bg-[#F7F3E8]/30 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-[#123C2A] shadow-xs">
                            {a.bookingId}
                          </span>
                          <span
                            className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize border ${
                              isCompleted
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : a.status === "confirmed"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : a.status === "cancelled" || a.status === "rejected"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {a.status}
                          </span>
                        </div>
                        <h3 className="mt-2 font-bold text-lg text-[#123C2A]">
                          {getTranslatedTreatmentName(a.care, language)}
                        </h3>
                        <p className="text-xs text-[#66736B] mt-0.5">
                          Date: {a.preferredDate} • Slot: {a.timeSlot || "10:00 AM"}
                        </p>
                      </div>

                      {/* REVIEW BUTTON FOR COMPLETED APPOINTMENTS */}
                      {isCompleted && (
                        <div>
                          {hasReview ? (
                            <div className="flex flex-col items-start sm:items-end gap-1">
                              <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-800 border border-amber-200">
                                <Star size={14} className="fill-amber-400 text-amber-500" />
                                Review Submitted ({a.review?.rating || 5}★)
                              </span>
                              <span className="text-[10px] text-[#66736B] capitalize font-medium">
                                Status: {a.review?.status || "pending"}
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => openReviewModal(a)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#123C2A] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0B291D] shadow-sm"
                            >
                              <Star size={14} className="text-[#C5A45D]" />
                              Give Review
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : activeTab === "prescriptions" ? (
            <div className="space-y-4">
              {prescriptions.length === 0 ? (
                <div className="text-center py-10">
                  <ClipboardList size={32} className="mx-auto text-[#789B82]" />
                  <p className="mt-2 text-sm text-[#66736B]">No prescription records found.</p>
                </div>
              ) : (
                prescriptions.map((p) => (
                  <div key={p._id} className="rounded-2xl border border-[#123C2A]/10 p-5 bg-white space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-[#789B82]">Rx ID: {p.prescriptionId}</span>
                        <h4 className="font-bold text-[#123C2A] text-lg mt-0.5">Doctor: {p.doctorName}</h4>
                        <p className="text-xs text-[#66736B]">Date: {formatDate(p.createdAt)}</p>
                      </div>
                      <a
                        href={`${API_URL}/admin/prescriptions/${p._id}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#123C2A] px-4 py-2 text-xs font-semibold text-white"
                      >
                        <Printer size={14} /> View / Print PDF
                      </a>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#66736B]">Prescribed Medicines ({p.medicines?.length}):</p>
                      <ul className="mt-2 text-xs space-y-1 text-[#17231C]">
                        {p.medicines?.map((m, i) => (
                          <li key={i}>• <strong>{m.medicineName}</strong> — {m.dosage}, {m.frequency} ({m.timing})</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {reports.length === 0 ? (
                <div className="text-center py-10">
                  <FileText size={32} className="mx-auto text-[#789B82]" />
                  <p className="mt-2 text-sm text-[#66736B]">No medical documents uploaded yet.</p>
                </div>
              ) : (
                reports.map((doc) => (
                  <div key={doc._id} className="rounded-2xl border border-[#123C2A]/10 p-4 bg-white flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-[#123C2A]">{doc.title}</h4>
                      <p className="text-xs text-[#66736B]">{doc.documentType} • Uploaded: {formatDate(doc.createdAt)}</p>
                    </div>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-[#123C2A]/15 px-4 py-2 text-xs font-semibold text-[#123C2A] hover:bg-[#123C2A] hover:text-white"
                    >
                      Download Document
                    </a>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* REVIEW SUBMISSION MODAL */}
      {selectedAppointmentForReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#789B82]">
                  Share Experience
                </span>
                <h3 className="text-lg font-bold text-[#123C2A]">How was your experience?</h3>
              </div>
              <button
                onClick={() => setSelectedAppointmentForReview(null)}
                className="rounded-full bg-[#F7F3E8] p-2 text-[#123C2A] hover:bg-[#123C2A] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="rounded-2xl border border-[#123C2A]/10 bg-[#F7F3E8]/40 p-4 text-xs text-[#123C2A]">
              <p className="font-bold text-sm">{selectedAppointmentForReview.care}</p>
              <p className="text-[#66736B] mt-0.5">
                Booking ID: {selectedAppointmentForReview.bookingId} • Date: {selectedAppointmentForReview.preferredDate}
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#66736B] mb-2">
                  Overall Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={
                          star <= rating
                            ? "fill-[#C5A45D] text-[#C5A45D]"
                            : "text-slate-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#66736B] mb-2">
                  Your Review *
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  placeholder="Describe your treatment experience, staff care, or results..."
                  className="w-full rounded-xl border border-[#123C2A]/10 p-3 text-xs outline-none focus:border-[#789B82] focus:ring-2 focus:ring-[#789B82]/15"
                  required
                />
              </div>

              {reviewError && (
                <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                  {reviewError}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedAppointmentForReview(null)}
                  className="rounded-xl border border-[#123C2A]/10 px-4 py-2 text-xs font-semibold text-[#123C2A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="rounded-xl bg-[#123C2A] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0B291D] disabled:opacity-60"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
