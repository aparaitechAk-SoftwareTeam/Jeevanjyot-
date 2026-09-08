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
} from "lucide-react";

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
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);

  const [activeTab, setActiveTab] = useState("appointments");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("jeevanjyot_patient_token");

  useEffect(() => {
    if (!token) {
      navigate("/patient/login", { replace: true });
      return;
    }

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

    fetchPatientData();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("jeevanjyot_patient_token");
    localStorage.removeItem("jeevanjyot_patient");
    navigate("/patient/login", { replace: true });
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
                appointments.map((a) => (
                  <div key={a._id} className="rounded-2xl border border-[#123C2A]/10 p-5 bg-[#F7F3E8]/30 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-[#123C2A] shadow-xs">
                          {a.bookingId}
                        </span>
                        <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-0.5 text-xs font-semibold capitalize border border-emerald-200">
                          {a.status}
                        </span>
                      </div>
                      <h3 className="mt-2 font-bold text-lg text-[#123C2A]">{a.care}</h3>
                      <p className="text-xs text-[#66736B] mt-0.5">Date: {a.preferredDate} • Slot: {a.timeSlot || "10:00 AM"}</p>
                    </div>
                  </div>
                ))
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
    </div>
  );
}
