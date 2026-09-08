import { useEffect, useState } from "react";
import {
  ClipboardList,
  Search,
  Plus,
  RefreshCw,
  X,
  Save,
  Printer,
  User,
  PlusCircle,
  Trash2,
  AlertCircle,
  Calendar,
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

export default function PrescriptionsManagement({ logout }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [generalInstructions, setGeneralInstructions] = useState("Follow prescribed diet and warm water routine.");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [medicines, setMedicines] = useState([
    {
      medicineName: "",
      dosage: "1 tablet",
      frequency: "Twice daily",
      timing: "After Meals",
      duration: "7 days",
      instructions: "",
    },
  ]);

  const token = () => localStorage.getItem("jeevanjyot_admin_token");

  const fetchData = async () => {
    const authToken = token();
    if (!authToken) return logout();

    try {
      setLoading(true);
      setError("");

      const headers = { Authorization: `Bearer ${authToken}` };

      const [resP, resPatients, resDocs, resAppts] = await Promise.all([
        fetch(`${API_URL}/admin/prescriptions`, { headers }),
        fetch(`${API_URL}/admin/patients`, { headers }),
        fetch(`${API_URL}/admin/doctors`, { headers }),
        fetch(`${API_URL}/admin/appointments`, { headers }),
      ]);

      const dataP = await resP.json();
      const dataPatients = await resPatients.json();
      const dataDocs = await resDocs.json();
      const dataAppts = await resAppts.json();

      if (dataP.success) setPrescriptions(dataP.prescriptions || []);
      
      let mergedPatients = dataPatients.success && Array.isArray(dataPatients.patients) ? [...dataPatients.patients] : [];
      
      if (dataAppts.success && Array.isArray(dataAppts.appointments)) {
        dataAppts.appointments.forEach((appt) => {
          if (
            appt.patientName &&
            !mergedPatients.some(
              (p) => (p.phone && appt.phone && p.phone === appt.phone) || p.name === appt.patientName
            )
          ) {
            mergedPatients.push({
              _id: appt._id,
              patientId: appt.bookingId,
              name: appt.patientName,
              phone: appt.phone || "N/A",
            });
          }
        });
      }

      setPatients(mergedPatients);
      if (dataDocs.success) setDoctors(dataDocs.doctors || []);
    } catch (err) {
      setError("Unable to load prescriptions data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addMedicineRow = () => {
    setMedicines((prev) => [
      ...prev,
      {
        medicineName: "",
        dosage: "1 tablet",
        frequency: "Twice daily",
        timing: "After Meals",
        duration: "7 days",
        instructions: "",
      },
    ]);
  };

  const removeMedicineRow = (index) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMedicine = (index, field, value) => {
    setMedicines((prev) =>
      prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    );
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    const authToken = token();
    if (!authToken) return logout();

    if (!selectedPatientId) {
      setError("Please select a patient.");
      return;
    }

    if (medicines.length === 0 || !medicines[0].medicineName.trim()) {
      setError("Please add at least one valid medicine.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const doc = doctors.find((d) => d._id === selectedDoctorId);

      const payload = {
        patientId: selectedPatientId,
        doctorId: selectedDoctorId || null,
        doctorName: doc ? doc.name : "Dr. Jeevan Atole",
        medicines: medicines.filter((m) => m.medicineName.trim()),
        generalInstructions,
        nextFollowUpDate: nextFollowUpDate || null,
      };

      const response = await fetch(`${API_URL}/admin/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create prescription.");

      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter((p) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      [p.prescriptionId, p.patientName, p.doctorName, p.phone]
        .filter(Boolean)
        .some((val) => String(val).toLowerCase().includes(q))
    );
  });

  return (
    <section>
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#789B82]">Clinic Management</p>
          <h1 className="mt-1 flex items-center gap-3 text-3xl font-bold tracking-tight text-[#123C2A] sm:text-4xl">
            <ClipboardList size={32} />
            Prescription Management
          </h1>
          <p className="mt-2 text-sm text-[#66736B]">
            Generate official Ayurvedic medical prescriptions and printable PDFs for patients.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 rounded-xl border border-[#123C2A]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#123C2A]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => {
              setSelectedPatientId("");
              setSelectedDoctorId("");
              setShowModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-[#123C2A] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            New Prescription
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* SEARCH */}
      <div className="mb-6">
        <div className="relative w-full max-w-sm">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#66736B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient name, Rx ID, doctor..."
            className="h-11 w-full rounded-xl border border-[#123C2A]/10 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#789B82]"
          />
        </div>
      </div>

      {/* LIST */}
      <div className="overflow-hidden rounded-2xl border border-[#123C2A]/8 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <RefreshCw size={25} className="animate-spin text-[#789B82]" />
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
            <ClipboardList size={32} className="text-[#789B82]" />
            <h3 className="mt-3 font-semibold text-[#123C2A]">No prescriptions generated yet</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-[#123C2A]/8 bg-[#F7F3E8]/45 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                  <th className="px-5 py-4">Rx ID</th>
                  <th className="px-5 py-4">Patient</th>
                  <th className="px-5 py-4">Doctor</th>
                  <th className="px-5 py-4">Medicines Count</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.map((p) => (
                  <tr key={p._id} className="border-b border-[#123C2A]/6 hover:bg-[#F7F3E8]/25">
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-[#F7F3E8] px-2.5 py-1 text-xs font-bold text-[#123C2A]">
                        {p.prescriptionId}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#123C2A]">{p.patientName}</p>
                      <p className="text-xs text-[#66736B]">{p.phone || "—"}</p>
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-[#17231C]">
                      {p.doctorName}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-[#789B82]">
                      {p.medicines?.length || 0} item(s)
                    </td>
                    <td className="px-5 py-4 text-xs text-[#66736B]">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`${API_URL}/admin/prescriptions/${p._id}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#123C2A]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#123C2A] hover:bg-[#123C2A] hover:text-white transition"
                      >
                        <Printer size={14} />
                        View / Print PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#789B82]">Rx Generator</p>
                <h3 className="font-bold text-xl text-[#123C2A]">Create New Prescription</h3>
              </div>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreatePrescription} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#66736B] mb-1">Select Patient *</label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    required
                    className="h-11 w-full rounded-xl border border-[#123C2A]/15 px-3 text-sm"
                  >
                    <option value="">Choose Patient</option>
                    {patients.map((pat) => (
                      <option key={pat._id} value={pat._id}>
                        {pat.name} ({pat.phone}) - {pat.patientId}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#66736B] mb-1">Attending Doctor</label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="h-11 w-full rounded-xl border border-[#123C2A]/15 px-3 text-sm"
                  >
                    <option value="">Dr. Jeevan Atole (Default)</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name} ({doc.specialization || "Ayurveda"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* MEDICINE LIST */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#123C2A]">Prescribed Medicines</h4>
                  <button
                    type="button"
                    onClick={addMedicineRow}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#789B82] hover:text-[#123C2A]"
                  >
                    <PlusCircle size={14} /> Add Medicine
                  </button>
                </div>

                <div className="space-y-3">
                  {medicines.map((med, idx) => (
                    <div key={idx} className="rounded-xl border border-[#123C2A]/10 p-3 bg-[#F7F3E8]/30 space-y-2">
                      <div className="flex gap-2">
                        <input
                          placeholder="Medicine Name (e.g. Ashwagandha Churna)"
                          value={med.medicineName}
                          onChange={(e) => updateMedicine(idx, "medicineName", e.target.value)}
                          required
                          className="h-10 flex-1 rounded-lg border px-3 text-sm"
                        />
                        {medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedicineRow(idx)}
                            className="text-red-500 p-2 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 text-xs">
                        <input
                          placeholder="Dosage (1 tab / 5ml)"
                          value={med.dosage}
                          onChange={(e) => updateMedicine(idx, "dosage", e.target.value)}
                          className="h-9 rounded-lg border px-2"
                        />
                        <input
                          placeholder="Frequency (Twice daily)"
                          value={med.frequency}
                          onChange={(e) => updateMedicine(idx, "frequency", e.target.value)}
                          className="h-9 rounded-lg border px-2"
                        />
                        <select
                          value={med.timing}
                          onChange={(e) => updateMedicine(idx, "timing", e.target.value)}
                          className="h-9 rounded-lg border px-2 bg-white"
                        >
                          <option value="After Meals">After Meals</option>
                          <option value="Before Meals">Before Meals</option>
                          <option value="With Meals">With Meals</option>
                          <option value="At Bedtime">At Bedtime</option>
                        </select>
                        <input
                          placeholder="Duration (7 days)"
                          value={med.duration}
                          onChange={(e) => updateMedicine(idx, "duration", e.target.value)}
                          className="h-9 rounded-lg border px-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#66736B] mb-1">General Instructions / Diet</label>
                <textarea
                  rows={2}
                  value={generalInstructions}
                  onChange={(e) => setGeneralInstructions(e.target.value)}
                  className="w-full rounded-xl border p-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#66736B] mb-1">Next Follow-up Date</label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  className="h-11 w-full rounded-xl border px-3 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border rounded-xl">Cancel</button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm bg-[#123C2A] text-white rounded-xl font-semibold disabled:opacity-60"
                >
                  {saving ? "Generating..." : "Generate Prescription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
