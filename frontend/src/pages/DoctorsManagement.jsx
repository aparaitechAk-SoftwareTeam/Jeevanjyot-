import { useEffect, useMemo, useState } from "react";
import {
  Stethoscope,
  Search,
  RefreshCw,
  UserPlus,
  Edit3,
  Eye,
  Phone,
  Mail,
  X,
  Save,
  UserRound,
  Calendar,
  Clock,
  Award,
  BookOpen,
  AlertCircle,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  specialization: "",
  qualifications: "",
  experience: "",
  bio: "",
  consultationDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  consultationStartTime: "09:00 AM",
  consultationEndTime: "07:00 PM",
  imageUrl: "",
};

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#66736B]">
        {Icon && <Icon size={14} />}
        {label}
      </span>
      {children}
    </label>
  );
}

function inputClass() {
  return "h-11 w-full rounded-xl border border-[#123C2A]/10 bg-[#F7F3E8]/45 px-3 text-sm text-[#17231C] outline-none transition focus:border-[#789B82] focus:ring-2 focus:ring-[#789B82]/15";
}

export default function DoctorsManagement({ logout }) {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [viewingDoctor, setViewingDoctor] = useState(null);

  const token = () => localStorage.getItem("jeevanjyot_admin_token");

  const fetchDoctors = async (manualRefresh = false) => {
    const authToken = token();

    if (!authToken) {
      logout();
      return;
    }

    try {
      setError("");

      if (manualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_URL}/admin/doctors`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to load doctors.");
      }

      setDoctors(data.doctors || []);
    } catch (err) {
      setError(err.message || "Unable to load doctor data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return doctors;
    }

    return doctors.filter((doctor) =>
      [
        doctor.doctorId,
        doctor.name,
        doctor.specialization,
        doctor.qualifications,
        doctor.phone,
        doctor.email,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [doctors, search]);

  const openAdd = () => {
    setEditingDoctor(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (doctor) => {
    setEditingDoctor(doctor);
    setForm({
      name: doctor.name || "",
      phone: doctor.phone || "",
      email: doctor.email || "",
      specialization: doctor.specialization || "",
      qualifications: doctor.qualifications || "",
      experience: doctor.experience || "",
      bio: doctor.bio || "",
      consultationDays: doctor.consultationDays || [],
      consultationStartTime: doctor.consultationStartTime || "",
      consultationEndTime: doctor.consultationEndTime || "",
      imageUrl: doctor.imageUrl || "",
    });
    setError("");
    setShowForm(true);
  };

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleDay = (day) => {
    setForm((current) => {
      const days = current.consultationDays || [];
      const updated = days.includes(day)
        ? days.filter((d) => d !== day)
        : [...days, day];
      return { ...current, consultationDays: updated };
    });
  };

  const saveDoctor = async (event) => {
    event.preventDefault();

    const authToken = token();

    if (!authToken) {
      logout();
      return;
    }

    if (!form.name.trim()) {
      setError("Doctor name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const isEdit = Boolean(editingDoctor);

      const response = await fetch(
        isEdit
          ? `${API_URL}/admin/doctors/${editingDoctor._id}`
          : `${API_URL}/admin/doctors`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Unable to ${isEdit ? "update" : "create"} doctor.`
        );
      }

      setShowForm(false);
      setEditingDoctor(null);
      setForm(emptyForm);

      await fetchDoctors(true);
    } catch (err) {
      setError(err.message || "Unable to save doctor.");
    } finally {
      setSaving(false);
    }
  };

  const deactivateDoctor = async (doctor) => {
    const confirmed = window.confirm(
      `Deactivate doctor "${doctor.name}"?\n\nThe doctor will be removed from the active doctor list.`
    );

    if (!confirmed) {
      return;
    }

    const authToken = token();

    if (!authToken) {
      logout();
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/admin/doctors/${doctor._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to deactivate doctor.");
      }

      setDoctors((current) =>
        current.filter((item) => item._id !== doctor._id)
      );
    } catch (err) {
      setError(err.message || "Unable to deactivate doctor.");
    }
  };

  return (
    <section>
      {/* HEADER */}
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#789B82]">
            Clinic Management
          </p>

          <h1 className="mt-1 flex items-center gap-3 text-3xl font-bold tracking-tight text-[#123C2A] sm:text-4xl">
            <Stethoscope size={32} />
            Doctors Management
          </h1>

          <p className="mt-2 text-sm text-[#66736B]">
            Manage doctor profiles, qualifications, and consultation availability.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fetchDoctors(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#123C2A]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#123C2A] shadow-sm transition hover:bg-[#123C2A] hover:text-white disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#123C2A] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B291D]"
          >
            <UserPlus size={17} />
            Add Doctor
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="text-xs font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SUMMARY STATS */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#123C2A]/8 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#66736B]">
            Active Doctors
          </p>
          <p className="mt-2 text-3xl font-bold text-[#123C2A]">
            {doctors.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#123C2A]/8 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#66736B]">
            Search Results
          </p>
          <p className="mt-2 text-3xl font-bold text-[#123C2A]">
            {filteredDoctors.length}
          </p>
        </div>

        <div className="hidden rounded-2xl border border-[#123C2A]/8 bg-[#0B291D] p-5 text-white shadow-sm md:block">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#C5A45D]">
            Doctor Scheduling
          </p>
          <p className="mt-2 text-sm leading-5 text-white/65">
            Active doctors appear in clinic booking forms and consultation engine.
          </p>
        </div>
      </div>

      {/* TABLE */}
      <section className="overflow-hidden rounded-2xl border border-[#123C2A]/8 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#123C2A]/8 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Stethoscope size={20} className="text-[#789B82]" />
              <h2 className="text-lg font-bold text-[#123C2A]">
                Doctor Roster
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#66736B]">
              {filteredDoctors.length} doctor{filteredDoctors.length === 1 ? "" : "s"} shown
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#66736B]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor, specialization..."
              className="h-11 w-full rounded-xl border border-[#123C2A]/10 bg-[#F7F3E8]/45 pl-10 pr-4 text-sm outline-none transition focus:border-[#789B82] focus:ring-2 focus:ring-[#789B82]/15"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={25}
                className="mx-auto animate-spin text-[#789B82]"
              />
              <p className="mt-3 text-sm text-[#66736B]">Loading doctors...</p>
            </div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#789B82]/10 text-[#789B82]">
              <Stethoscope size={25} />
            </div>

            <h3 className="mt-4 font-semibold text-[#123C2A]">
              No doctors found
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-[#66736B]">
              Add a doctor profile to make them available for appointment scheduling.
            </p>

            <button
              onClick={openAdd}
              className="mt-5 flex items-center gap-2 rounded-xl bg-[#123C2A] px-4 py-2.5 text-xs font-semibold text-white"
            >
              <UserPlus size={15} />
              Add First Doctor
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead>
                <tr className="border-b border-[#123C2A]/8 bg-[#F7F3E8]/45">
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Doctor
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Doctor ID
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Specialization & Qualification
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Consultation Days & Hours
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Contact
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor._id}
                    className="border-b border-[#123C2A]/6 last:border-0 hover:bg-[#F7F3E8]/25"
                  >
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        {doctor.imageUrl ? (
                          <img
                            src={doctor.imageUrl}
                            alt={doctor.name}
                            className="h-10 w-10 rounded-full object-cover border border-[#123C2A]/10"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#789B82]/12 text-[#123C2A]">
                            <UserRound size={17} />
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-[#123C2A]">
                            {doctor.name}
                          </p>
                          {doctor.experience && (
                            <p className="mt-0.5 text-xs text-[#66736B]">
                              {doctor.experience} Exp.
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <span className="rounded-lg bg-[#F7F3E8] px-2.5 py-1.5 text-[11px] font-semibold text-[#123C2A]">
                        {doctor.doctorId || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <p className="text-sm font-semibold text-[#17231C]">
                        {doctor.specialization || "Ayurvedic Practitioner"}
                      </p>
                      <p className="mt-0.5 text-xs text-[#66736B]">
                        {doctor.qualifications || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <div className="text-xs text-[#17231C]">
                        <p className="font-medium">
                          {doctor.consultationDays && doctor.consultationDays.length > 0
                            ? doctor.consultationDays.join(", ")
                            : "All Days"}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-[#66736B]">
                          <Clock size={12} />
                          {doctor.consultationStartTime && doctor.consultationEndTime
                            ? `${doctor.consultationStartTime} - ${doctor.consultationEndTime}`
                            : "Standard Clinic Hours"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <p className="text-sm font-medium text-[#17231C]">
                        {doctor.phone || "—"}
                      </p>
                      {doctor.email && (
                        <p className="mt-0.5 text-xs text-[#66736B]">
                          {doctor.email}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewingDoctor(doctor)}
                          title="View doctor details"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#123C2A]/10 bg-white text-[#123C2A] transition hover:bg-[#123C2A] hover:text-white"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => openEdit(doctor)}
                          title="Edit doctor"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#123C2A]/10 bg-white text-[#123C2A] transition hover:bg-[#123C2A] hover:text-white"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          onClick={() => deactivateDoctor(doctor)}
                          title="Deactivate doctor"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* VIEW MODAL */}
      {viewingDoctor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#123C2A]/8 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#789B82]">
                  Doctor Profile
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#123C2A]">
                  {viewingDoctor.name}
                </h2>
              </div>
              <button
                onClick={() => setViewingDoctor(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F3E8] text-[#123C2A]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                {viewingDoctor.imageUrl ? (
                  <img
                    src={viewingDoctor.imageUrl}
                    alt={viewingDoctor.name}
                    className="h-20 w-20 rounded-2xl object-cover border border-[#123C2A]/10"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#789B82]/15 text-[#123C2A]">
                    <UserRound size={36} />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-[#123C2A]">{viewingDoctor.name}</h3>
                  <p className="text-sm font-semibold text-[#789B82]">{viewingDoctor.specialization}</p>
                  <p className="text-xs text-[#66736B] mt-1">{viewingDoctor.qualifications}</p>
                  <p className="text-xs font-medium text-[#123C2A] mt-1">Experience: {viewingDoctor.experience || "N/A"}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#123C2A]/10 bg-[#F7F3E8]/50 p-4 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-[#123C2A]">
                  <Phone size={16} className="text-[#789B82]" />
                  <span>Phone: {viewingDoctor.phone || "Not provided"}</span>
                </p>
                <p className="flex items-center gap-2 text-[#123C2A]">
                  <Mail size={16} className="text-[#789B82]" />
                  <span>Email: {viewingDoctor.email || "Not provided"}</span>
                </p>
                <p className="flex items-center gap-2 text-[#123C2A]">
                  <Clock size={16} className="text-[#789B82]" />
                  <span>Timings: {viewingDoctor.consultationStartTime} - {viewingDoctor.consultationEndTime}</span>
                </p>
                <p className="flex items-center gap-2 text-[#123C2A]">
                  <Calendar size={16} className="text-[#789B82]" />
                  <span>Available Days: {viewingDoctor.consultationDays?.join(", ") || "All Days"}</span>
                </p>
              </div>

              {viewingDoctor.bio && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#66736B] mb-2">Biography</h4>
                  <p className="text-sm leading-relaxed text-[#17231C] bg-white p-4 rounded-xl border border-[#123C2A]/8">
                    {viewingDoctor.bio}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setViewingDoctor(null)}
                  className="rounded-xl bg-[#123C2A] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#123C2A]/8 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#789B82]">
                  Doctor Management
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#123C2A]">
                  {editingDoctor ? "Edit Doctor Profile" : "Add New Doctor"}
                </h2>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F3E8] text-[#123C2A]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveDoctor} className="space-y-5 p-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Doctor Full Name *" icon={UserRound}>
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={inputClass()}
                    placeholder="e.g. Dr. Jeevan Atole"
                    required
                  />
                </Field>

                <Field label="Specialization" icon={Stethoscope}>
                  <input
                    value={form.specialization}
                    onChange={(e) => updateField("specialization", e.target.value)}
                    className={inputClass()}
                    placeholder="e.g. Ayurvedic & Panchakarma Specialist"
                  />
                </Field>

                <Field label="Qualifications" icon={Award}>
                  <input
                    value={form.qualifications}
                    onChange={(e) => updateField("qualifications", e.target.value)}
                    className={inputClass()}
                    placeholder="e.g. BAMS, MD (Ayurveda)"
                  />
                </Field>

                <Field label="Years of Experience" icon={BookOpen}>
                  <input
                    value={form.experience}
                    onChange={(e) => updateField("experience", e.target.value)}
                    className={inputClass()}
                    placeholder="e.g. 15+ Years"
                  />
                </Field>

                <Field label="Mobile Number" icon={Phone}>
                  <input
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={inputClass()}
                    placeholder="e.g. 9822510456"
                  />
                </Field>

                <Field label="Email Address" icon={Mail}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={inputClass()}
                    placeholder="doctor@jeevanjyot.com"
                  />
                </Field>

                <Field label="Consultation Start Time" icon={Clock}>
                  <input
                    value={form.consultationStartTime}
                    onChange={(e) => updateField("consultationStartTime", e.target.value)}
                    className={inputClass()}
                    placeholder="e.g. 09:00 AM"
                  />
                </Field>

                <Field label="Consultation End Time" icon={Clock}>
                  <input
                    value={form.consultationEndTime}
                    onChange={(e) => updateField("consultationEndTime", e.target.value)}
                    className={inputClass()}
                    placeholder="e.g. 07:00 PM"
                  />
                </Field>
              </div>

              <Field label="Doctor Image URL" icon={ImageIcon}>
                <input
                  value={form.imageUrl}
                  onChange={(e) => updateField("imageUrl", e.target.value)}
                  className={inputClass()}
                  placeholder="https://example.com/doctor-photo.jpg"
                />
              </Field>

              {/* CONSULTATION DAYS CHECKBOXES */}
              <div>
                <span className="mb-2 block text-xs font-semibold text-[#66736B]">
                  Consultation Days
                </span>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = form.consultationDays?.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                          isSelected
                            ? "bg-[#123C2A] text-white"
                            : "border border-[#123C2A]/15 bg-[#F7F3E8]/50 text-[#66736B] hover:border-[#123C2A]"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Field label="Doctor Bio / Notes" icon={BookOpen}>
                <textarea
                  value={form.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-[#123C2A]/10 bg-[#F7F3E8]/45 px-3 py-3 text-sm outline-none transition focus:border-[#789B82] focus:ring-2 focus:ring-[#789B82]/15"
                  placeholder="Short professional biography..."
                />
              </Field>

              <div className="flex justify-end gap-3 border-t border-[#123C2A]/8 pt-5">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-[#123C2A]/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#123C2A]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#123C2A] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
