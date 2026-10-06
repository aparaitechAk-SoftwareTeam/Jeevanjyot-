import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  UserPlus,
  Edit3,
  Eye,
  Phone,
  MessageCircle,
  X,
  Save,
  UserRound,
  CalendarDays,
  MapPin,
  Mail,
  VenusAndMars,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function formatDate(date) {
  if (!date) return "—";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "—";
  }

  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  notes: "",
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

export default function PatientsManagement({ logout }) {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [viewingPatient, setViewingPatient] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const token = () =>
    localStorage.getItem("jeevanjyot_admin_token");

  const fetchPatients = async (manualRefresh = false) => {
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

      const response = await fetch(
        `${API_URL}/admin/patients`,
        {
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
        throw new Error(
          data.message || "Unable to load patients."
        );
      }

      setPatients(data.patients || []);
    } catch (err) {
      setError(
        err.message || "Unable to load patient data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) =>
      [
        patient.patientId,
        patient.name,
        patient.phone,
        patient.email,
        patient.gender,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [patients, search]);

  const openAdd = () => {
    setEditingPatient(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (patient) => {
    setEditingPatient(patient);

    setForm({
      name: patient.name || "",
      phone: patient.phone || "",
      email: patient.email || "",
      dateOfBirth: patient.dateOfBirth
        ? String(patient.dateOfBirth).slice(0, 10)
        : "",
      gender: patient.gender || "",
      address: patient.address || "",
      notes: patient.notes || "",
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

  const savePatient = async (event) => {
    event.preventDefault();

    const authToken = token();

    if (!authToken) {
      logout();
      return;
    }

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Patient name and mobile number are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const isEdit = Boolean(editingPatient);

      const response = await fetch(
        isEdit
          ? `${API_URL}/admin/patients/${editingPatient._id}`
          : `${API_URL}/admin/patients`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            ...form,
            dateOfBirth: form.dateOfBirth || null,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Unable to ${isEdit ? "update" : "create"} patient.`
        );
      }

      setShowForm(false);
      setEditingPatient(null);
      setForm(emptyForm);

      await fetchPatients(true);
    } catch (err) {
      setError(
        err.message || "Unable to save patient."
      );
    } finally {
      setSaving(false);
    }
  };

  const viewPatient = async (patientId) => {
    const authToken = token();

    if (!authToken) {
      logout();
      return;
    }

    try {
      setViewLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/patients/${patientId}`,
        {
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
        throw new Error(
          data.message || "Unable to load patient details."
        );
      }

      setViewingPatient(data);
    } catch (err) {
      setError(
        err.message || "Unable to load patient details."
      );
    } finally {
      setViewLoading(false);
    }
  };

  const deactivatePatient = async (patient) => {
    const confirmed = window.confirm(
      `Deactivate patient "${patient.name}"?\n\nThe patient will be removed from the active patient list.`
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
        `${API_URL}/admin/patients/${patient._id}`,
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
        throw new Error(
          data.message || "Unable to deactivate patient."
        );
      }

      setPatients((current) =>
        current.filter(
          (item) => item._id !== patient._id
        )
      );
    } catch (err) {
      setError(
        err.message || "Unable to deactivate patient."
      );
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
            <Users size={32} />
            Patients
          </h1>

          <p className="mt-2 text-sm text-[#66736B]">
            Manage active patient profiles and access appointment history.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fetchPatients(true)}
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
            Add Patient
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />

          <div className="flex-1">
            <p className="font-semibold">
              Something went wrong
            </p>

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

      {/* SUMMARY */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#123C2A]/8 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#66736B]">
            Active Patients
          </p>
          <p className="mt-2 text-3xl font-bold text-[#123C2A]">
            {patients.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#123C2A]/8 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#66736B]">
            Search Results
          </p>
          <p className="mt-2 text-3xl font-bold text-[#123C2A]">
            {filteredPatients.length}
          </p>
        </div>

        <div className="hidden rounded-2xl border border-[#123C2A]/8 bg-[#0B291D] p-5 text-white shadow-sm md:block">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#C5A45D]">
            Patient Records
          </p>
          <p className="mt-2 text-sm leading-5 text-white/65">
            Patient information is available only inside the protected admin portal.
          </p>
        </div>
      </div>

      {/* TABLE */}
      <section className="overflow-hidden rounded-2xl border border-[#123C2A]/8 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#123C2A]/8 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users
                size={20}
                className="text-[#789B82]"
              />

              <h2 className="text-lg font-bold text-[#123C2A]">
                Patient Directory
              </h2>
            </div>

            <p className="mt-1 text-xs text-[#66736B]">
              {filteredPatients.length} patient
              {filteredPatients.length === 1 ? "" : "s"} shown
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
              placeholder="Search name, phone, patient ID..."
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
              <p className="mt-3 text-sm text-[#66736B]">
                Loading patients...
              </p>
            </div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#789B82]/10 text-[#789B82]">
              <Users size={25} />
            </div>

            <h3 className="mt-4 font-semibold text-[#123C2A]">
              No patients found
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-[#66736B]">
              Add a patient or change your search to view records.
            </p>

            <button
              onClick={openAdd}
              className="mt-5 flex items-center gap-2 rounded-xl bg-[#123C2A] px-4 py-2.5 text-xs font-semibold text-white"
            >
              <UserPlus size={15} />
              Add First Patient
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead>
                <tr className="border-b border-[#123C2A]/8 bg-[#F7F3E8]/45">
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Patient
                  </th>

                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Patient ID
                  </th>

                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Gender
                  </th>

                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Added
                  </th>

                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="border-b border-[#123C2A]/6 last:border-0 hover:bg-[#F7F3E8]/25"
                  >
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#789B82]/12 text-[#123C2A]">
                          <UserRound size={17} />
                        </div>

                        <div>
                          <p className="font-semibold text-[#123C2A]">
                            {patient.name}
                          </p>

                          <p className="mt-0.5 text-xs text-[#66736B]">
                            {patient.email || "No email added"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <span className="rounded-lg bg-[#F7F3E8] px-2.5 py-1.5 text-[11px] font-semibold text-[#123C2A]">
                        {patient.patientId || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <p className="text-sm font-medium text-[#17231C]">
                        {patient.phone}
                      </p>

                      <div className="mt-2 flex gap-2">
                        <a
                          href={`tel:${patient.phone}`}
                          title="Call patient"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B291D] text-white transition hover:bg-[#123C2A]"
                        >
                          <Phone size={14} />
                        </a>

                        <a
                          href={`https://wa.me/91${String(
                            patient.phone
                          ).replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          title="WhatsApp patient"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#789B82] text-white transition hover:bg-[#123C2A]"
                        >
                          <MessageCircle size={14} />
                        </a>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <span className="rounded-full bg-[#789B82]/10 px-3 py-1.5 text-xs font-semibold capitalize text-[#123C2A]">
                        {patient.gender || "Not added"}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <span className="text-sm text-[#17231C]">
                        {formatDate(patient.createdAt)}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewPatient(patient._id)}
                          title="View patient"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#123C2A]/10 bg-white text-[#123C2A] transition hover:bg-[#123C2A] hover:text-white"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => openEdit(patient)}
                          title="Edit patient"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#123C2A]/10 bg-white text-[#123C2A] transition hover:bg-[#123C2A] hover:text-white"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          onClick={() => deactivatePatient(patient)}
                          title="Deactivate patient"
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

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#123C2A]/8 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#789B82]">
                  Patient Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#123C2A]">
                  {editingPatient
                    ? "Edit Patient"
                    : "Add New Patient"}
                </h2>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F3E8] text-[#123C2A]"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={savePatient}
              className="space-y-5 p-5"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Patient Name *" icon={UserRound}>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                    className={inputClass()}
                    placeholder="Enter patient name"
                    required
                  />
                </Field>

                <Field label="Mobile Number *" icon={Phone}>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      updateField("phone", e.target.value)
                    }
                    className={inputClass()}
                    placeholder="Enter mobile number"
                    required
                  />
                </Field>

                <Field label="Email" icon={Mail}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateField("email", e.target.value)
                    }
                    className={inputClass()}
                    placeholder="patient@example.com"
                  />
                </Field>

                <Field label="Date of Birth" icon={CalendarDays}>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) =>
                      updateField(
                        "dateOfBirth",
                        e.target.value
                      )
                    }
                    className={inputClass()}
                  />
                </Field>

                <Field label="Gender" icon={VenusAndMars}>
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      updateField("gender", e.target.value)
                    }
                    className={inputClass()}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </Field>

                <Field label="Address" icon={MapPin}>
                  <input
                    value={form.address}
                    onChange={(e) =>
                      updateField("address", e.target.value)
                    }
                    className={inputClass()}
                    placeholder="Pune"
                  />
                </Field>
              </div>

              <Field label="Notes" icon={FileText}>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    updateField("notes", e.target.value)
                  }
                  rows={4}
                  className="w-full rounded-xl border border-[#123C2A]/10 bg-[#F7F3E8]/45 px-3 py-3 text-sm outline-none transition focus:border-[#789B82] focus:ring-2 focus:ring-[#789B82]/15"
                  placeholder="Administrative notes..."
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
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={16} />
                  )}

                  {saving
                    ? "Saving..."
                    : editingPatient
                    ? "Update Patient"
                    : "Save Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PATIENT MODAL */}
      {(viewLoading || viewingPatient) && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {viewLoading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                  <RefreshCw
                    size={26}
                    className="mx-auto animate-spin text-[#789B82]"
                  />
                  <p className="mt-3 text-sm text-[#66736B]">
                    Loading patient details...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-[#123C2A]/8 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#789B82]/12 text-[#123C2A]">
                      <UserRound size={21} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#789B82]">
                        Patient Profile
                      </p>

                      <h2 className="text-xl font-bold text-[#123C2A]">
                        {viewingPatient.patient?.name ||
                          viewingPatient.name}
                      </h2>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setViewingPatient(null)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F3E8] text-[#123C2A]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid gap-5 p-5 md:grid-cols-2">
                  <div className="rounded-2xl bg-[#F7F3E8]/65 p-5">
                    <h3 className="font-semibold text-[#123C2A]">
                      Patient Information
                    </h3>

                    <div className="mt-4 space-y-3 text-sm">
                      <p>
                        <span className="text-[#66736B]">
                          Patient ID:
                        </span>{" "}
                        <strong>
                          {viewingPatient.patient
                            ?.patientId ||
                            viewingPatient.patientId ||
                            "—"}
                        </strong>
                      </p>

                      <p>
                        <span className="text-[#66736B]">
                          Phone:
                        </span>{" "}
                        <strong>
                          {viewingPatient.patient?.phone ||
                            viewingPatient.phone ||
                            "—"}
                        </strong>
                      </p>

                      <p>
                        <span className="text-[#66736B]">
                          Email:
                        </span>{" "}
                        {viewingPatient.patient?.email ||
                          viewingPatient.email ||
                          "—"}
                      </p>

                      <p>
                        <span className="text-[#66736B]">
                          Gender:
                        </span>{" "}
                        <span className="capitalize">
                          {viewingPatient.patient?.gender ||
                            viewingPatient.gender ||
                            "—"}
                        </span>
                      </p>

                      <p>
                        <span className="text-[#66736B]">
                          Date of Birth:
                        </span>{" "}
                        {formatDate(
                          viewingPatient.patient
                            ?.dateOfBirth ||
                            viewingPatient.dateOfBirth
                        )}
                      </p>

                      <p>
                        <span className="text-[#66736B]">
                          Address:
                        </span>{" "}
                        {viewingPatient.patient?.address ||
                          viewingPatient.address ||
                          "—"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#0B291D] p-5 text-white">
                    <h3 className="font-semibold">
                      Contact Patient
                    </h3>

                    <p className="mt-2 text-sm text-white/55">
                      Use the registered mobile number for patient communication.
                    </p>

                    <div className="mt-5 flex gap-2">
                      <a
                        href={`tel:${
                          viewingPatient.patient?.phone ||
                          viewingPatient.phone ||
                          ""
                        }`}
                        className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#123C2A]"
                      >
                        <Phone size={16} />
                        Call
                      </a>

                      <a
                        href={`https://wa.me/91${String(
                          viewingPatient.patient?.phone ||
                            viewingPatient.phone ||
                            ""
                        ).replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-[#789B82] px-4 py-2.5 text-sm font-semibold text-white"
                      >
                        <MessageCircle size={16} />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <div className="rounded-2xl border border-[#123C2A]/8 bg-white">
                    <div className="border-b border-[#123C2A]/8 p-5">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={19}
                          className="text-[#789B82]"
                        />

                        <h3 className="font-bold text-[#123C2A]">
                          Appointment History
                        </h3>
                      </div>
                    </div>

                    {(viewingPatient.appointments || []).length ===
                    0 ? (
                      <div className="p-6 text-center">
                        <CheckCircle2
                          size={24}
                          className="mx-auto text-[#789B82]"
                        />

                        <p className="mt-2 text-sm font-semibold text-[#123C2A]">
                          No appointment history
                        </p>

                        <p className="mt-1 text-xs text-[#66736B]">
                          No appointments are currently linked to this patient.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-left">
                          <thead>
                            <tr className="border-b border-[#123C2A]/8 bg-[#F7F3E8]/45">
                              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-[#66736B]">
                                Booking ID
                              </th>
                              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-[#66736B]">
                                Care
                              </th>
                              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-[#66736B]">
                                Date
                              </th>
                              <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-[#66736B]">
                                Status
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {viewingPatient.appointments.map(
                              (appointment) => (
                                <tr
                                  key={appointment._id}
                                  className="border-b border-[#123C2A]/6 last:border-0"
                                >
                                  <td className="px-5 py-4 text-xs font-semibold text-[#123C2A]">
                                    {appointment.bookingId || "—"}
                                  </td>

                                  <td className="px-5 py-4 text-sm text-[#17231C]">
                                    {appointment.care || "—"}
                                  </td>

                                  <td className="px-5 py-4 text-sm text-[#17231C]">
                                    {formatDate(
                                      appointment.preferredDate
                                    )}
                                  </td>

                                  <td className="px-5 py-4">
                                    <span className="rounded-full bg-[#789B82]/10 px-3 py-1 text-xs font-semibold capitalize text-[#123C2A]">
                                      {appointment.status ||
                                        "pending"}
                                    </span>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
