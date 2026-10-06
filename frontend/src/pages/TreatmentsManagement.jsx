import { useEffect, useMemo, useState } from "react";
import {
  Leaf,
  Search,
  RefreshCw,
  Plus,
  Edit3,
  Eye,
  X,
  Save,
  Clock,
  AlertCircle,
  FileText,
  Sparkles,
  Layers,
  ArrowUpDown,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CATEGORIES = ["Ayurveda", "Panchakarma", "Specialized Care", "Wellness"];

const emptyForm = {
  name: "",
  category: "Ayurveda",
  description: "",
  duration: "45-60 Mins",
  consultationRequirement: "Required prior to treatment",
  imageUrl: "",
  displayOrder: 0,
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

export default function TreatmentsManagement({ logout }) {
  const [treatments, setTreatments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [viewingTreatment, setViewingTreatment] = useState(null);

  const token = () => localStorage.getItem("jeevanjyot_admin_token");

  const fetchTreatments = async (manualRefresh = false) => {
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

      const response = await fetch(`${API_URL}/admin/treatments`, {
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
        throw new Error(data.message || "Unable to load treatments.");
      }

      setTreatments(data.treatments || []);
    } catch (err) {
      setError(err.message || "Unable to load treatment data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const filteredTreatments = useMemo(() => {
    return treatments.filter((treatment) => {
      const matchesCategory =
        selectedCategory === "All" || treatment.category === selectedCategory;

      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [treatment.treatmentId, treatment.name, treatment.category, treatment.description]
          .filter(Boolean)
          .some((val) => String(val).toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [treatments, selectedCategory, search]);

  const openAdd = () => {
    setEditingTreatment(null);
    setForm({ ...emptyForm, displayOrder: treatments.length + 1 });
    setError("");
    setShowForm(true);
  };

  const openEdit = (treatment) => {
    setEditingTreatment(treatment);
    setForm({
      name: treatment.name || "",
      category: treatment.category || "Ayurveda",
      description: treatment.description || "",
      duration: treatment.duration || "",
      consultationRequirement: treatment.consultationRequirement || "",
      imageUrl: treatment.imageUrl || "",
      displayOrder: treatment.displayOrder ?? 0,
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

  const saveTreatment = async (event) => {
    event.preventDefault();

    const authToken = token();

    if (!authToken) {
      logout();
      return;
    }

    if (!form.name.trim() || !form.description.trim()) {
      setError("Treatment name and description are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const isEdit = Boolean(editingTreatment);

      const response = await fetch(
        isEdit
          ? `${API_URL}/admin/treatments/${editingTreatment._id}`
          : `${API_URL}/admin/treatments`,
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
          data.message || `Unable to ${isEdit ? "update" : "create"} treatment.`
        );
      }

      setShowForm(false);
      setEditingTreatment(null);
      setForm(emptyForm);

      await fetchTreatments(true);
    } catch (err) {
      setError(err.message || "Unable to save treatment.");
    } finally {
      setSaving(false);
    }
  };

  const deactivateTreatment = async (treatment) => {
    const confirmed = window.confirm(
      `Deactivate treatment "${treatment.name}"?\n\nIt will be hidden from the clinic website.`
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
        `${API_URL}/admin/treatments/${treatment._id}`,
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
        throw new Error(data.message || "Unable to deactivate treatment.");
      }

      await fetchTreatments(true);
    } catch (err) {
      setError(err.message || "Unable to deactivate treatment.");
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
            <Leaf size={32} />
            Treatment & Panchakarma Management
          </h1>

          <p className="mt-2 text-sm text-[#66736B]">
            Manage clinical Ayurvedic procedures, Panchakarma therapies, and specialized care offerings.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fetchTreatments(true)}
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
            <Plus size={17} />
            Add Treatment
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

      {/* CATEGORY TABS & SEARCH BAR */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-[#123C2A] text-white shadow-sm"
                  : "border border-[#123C2A]/10 bg-white text-[#66736B] hover:bg-[#F7F3E8]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:max-w-xs">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#66736B]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search treatment name or description..."
            className="h-11 w-full rounded-xl border border-[#123C2A]/10 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#789B82] focus:ring-2 focus:ring-[#789B82]/15"
          />
        </div>
      </div>

      {/* MAIN TABLE */}
      <section className="overflow-hidden rounded-2xl border border-[#123C2A]/8 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={25}
                className="mx-auto animate-spin text-[#789B82]"
              />
              <p className="mt-3 text-sm text-[#66736B]">Loading treatments...</p>
            </div>
          </div>
        ) : filteredTreatments.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#789B82]/10 text-[#789B82]">
              <Leaf size={25} />
            </div>

            <h3 className="mt-4 font-semibold text-[#123C2A]">
              No treatments found
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-[#66736B]">
              Add a treatment to display it on the clinic website.
            </p>

            <button
              onClick={openAdd}
              className="mt-5 flex items-center gap-2 rounded-xl bg-[#123C2A] px-4 py-2.5 text-xs font-semibold text-white"
            >
              <Plus size={15} />
              Add First Treatment
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead>
                <tr className="border-b border-[#123C2A]/8 bg-[#F7F3E8]/45">
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Treatment Name
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Category
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Duration & Care
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Status
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Order
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTreatments.map((treatment) => (
                  <tr
                    key={treatment._id}
                    className="border-b border-[#123C2A]/6 last:border-0 hover:bg-[#F7F3E8]/25"
                  >
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#789B82]/12 text-[#123C2A]">
                          <Sparkles size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-[#123C2A]">
                            {treatment.name}
                          </p>
                          <p className="mt-0.5 text-xs text-[#66736B] line-clamp-1 max-w-md">
                            {treatment.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <span className="rounded-full border border-[#123C2A]/10 bg-[#123C2A]/5 px-3 py-1 text-xs font-semibold text-[#123C2A]">
                        {treatment.category}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <div className="text-xs text-[#17231C]">
                        <p className="font-medium flex items-center gap-1">
                          <Clock size={13} className="text-[#789B82]" />
                          {treatment.duration || "Consultation standard"}
                        </p>
                        <p className="mt-0.5 text-[#66736B]">
                          {treatment.consultationRequirement || "Consultation required"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          treatment.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {treatment.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <span className="rounded-lg bg-[#F7F3E8] px-2.5 py-1.5 text-[11px] font-semibold text-[#123C2A]">
                        #{treatment.displayOrder ?? 0}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewingTreatment(treatment)}
                          title="View detail"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#123C2A]/10 bg-white text-[#123C2A] transition hover:bg-[#123C2A] hover:text-white"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => openEdit(treatment)}
                          title="Edit treatment"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#123C2A]/10 bg-white text-[#123C2A] transition hover:bg-[#123C2A] hover:text-white"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          onClick={() => deactivateTreatment(treatment)}
                          title="Deactivate treatment"
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
      {viewingTreatment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#123C2A]/8 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#789B82]">
                  {viewingTreatment.category}
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#123C2A]">
                  {viewingTreatment.name}
                </h2>
              </div>
              <button
                onClick={() => setViewingTreatment(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F3E8] text-[#123C2A]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-2xl border border-[#123C2A]/10 bg-[#F7F3E8]/50 p-4 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-[#123C2A]">
                  <Clock size={16} className="text-[#789B82]" />
                  <span>Duration: {viewingTreatment.duration || "N/A"}</span>
                </p>
                <p className="flex items-center gap-2 text-[#123C2A]">
                  <FileText size={16} className="text-[#789B82]" />
                  <span>Requirement: {viewingTreatment.consultationRequirement}</span>
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#66736B] mb-2">Description</h4>
                <p className="text-sm leading-relaxed text-[#17231C] bg-white p-4 rounded-xl border border-[#123C2A]/8">
                  {viewingTreatment.description}
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setViewingTreatment(null)}
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
                  Treatment Management
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#123C2A]">
                  {editingTreatment ? "Edit Treatment" : "Add New Treatment"}
                </h2>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F3E8] text-[#123C2A]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveTreatment} className="space-y-5 p-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Treatment Name *" icon={Leaf}>
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={inputClass()}
                    placeholder="e.g. Abhyanga & Swedana"
                    required
                  />
                </Field>

                <Field label="Category *" icon={Layers}>
                  <select
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className={inputClass()}
                    required
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Typical Duration" icon={Clock}>
                  <input
                    value={form.duration}
                    onChange={(e) => updateField("duration", e.target.value)}
                    className={inputClass()}
                    placeholder="e.g. 60 Mins / 7 Days Package"
                  />
                </Field>

                <Field label="Display Order Priority" icon={ArrowUpDown}>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => updateField("displayOrder", e.target.value)}
                    className={inputClass()}
                    placeholder="0"
                  />
                </Field>
              </div>

              <Field label="Consultation Requirement" icon={FileText}>
                <input
                  value={form.consultationRequirement}
                  onChange={(e) => updateField("consultationRequirement", e.target.value)}
                  className={inputClass()}
                  placeholder="e.g. Recommended after Vamana or consultation"
                />
              </Field>

              <Field label="Description *" icon={Sparkles}>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-[#123C2A]/10 bg-[#F7F3E8]/45 px-3 py-3 text-sm outline-none transition focus:border-[#789B82] focus:ring-2 focus:ring-[#789B82]/15"
                  placeholder="Detailed description of the therapy, benefits, and procedure..."
                  required
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
                  Save Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
