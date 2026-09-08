import { useEffect, useState } from "react";
import {
  Settings,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function SettingsManagement({ logout }) {
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [clinicInfo, setClinicInfo] = useState({
    clinicName: "",
    address: "",
    phone1: "",
    phone2: "",
    email: "",
    googleMapsUrl: "",
  });

  const [workingHours, setWorkingHours] = useState([]);
  const [appointmentSettings, setAppointmentSettings] = useState({
    slotDurationMinutes: 30,
    advanceBookingDays: 30,
    allowCancellation: true,
  });

  const [holidays, setHolidays] = useState([]);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [newHolidayReason, setNewHolidayReason] = useState("");

  const token = () => localStorage.getItem("jeevanjyot_admin_token");

  const fetchData = async () => {
    const authToken = token();
    if (!authToken) return logout();

    try {
      setLoading(true);
      setError("");

      const [resSettings, resHolidays] = await Promise.all([
        fetch(`${API_URL}/admin/settings`, { headers: { Authorization: `Bearer ${authToken}` } }),
        fetch(`${API_URL}/admin/holidays`, { headers: { Authorization: `Bearer ${authToken}` } }),
      ]);

      const dataSettings = await resSettings.json();
      const dataHolidays = await resHolidays.json();

      if (dataSettings.success && dataSettings.settings) {
        const s = dataSettings.settings;
        setClinicInfo({
          clinicName: s.clinicName || "",
          address: s.address || "",
          phone1: s.phone1 || "",
          phone2: s.phone2 || "",
          email: s.email || "",
          googleMapsUrl: s.googleMapsUrl || "",
        });
        setWorkingHours(s.workingHours || []);
        if (s.appointmentSettings) setAppointmentSettings(s.appointmentSettings);
      }

      if (dataHolidays.success) setHolidays(dataHolidays.holidays || []);
    } catch (err) {
      setError("Failed to load settings data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const authToken = token();
    if (!authToken) return logout();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...clinicInfo,
        workingHours,
        appointmentSettings,
      };

      const response = await fetch(`${API_URL}/admin/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update settings.");

      setSuccess("Clinic settings saved successfully to MongoDB.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    const authToken = token();
    if (!authToken) return logout();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`${API_URL}/admin/holidays`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ date: newHolidayDate, reason: newHolidayReason }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add holiday.");

      setShowHolidayModal(false);
      setNewHolidayDate("");
      setNewHolidayReason("");
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHoliday = async (id) => {
    const authToken = token();
    if (!authToken) return logout();

    try {
      setError("");
      const response = await fetch(`${API_URL}/admin/holidays/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete holiday.");

      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#789B82]">Clinic Operations</p>
          <h1 className="mt-1 flex items-center gap-3 text-3xl font-bold tracking-tight text-[#123C2A] sm:text-4xl">
            <Settings size={32} />
            Clinic Settings & Holidays
          </h1>
          <p className="mt-2 text-sm text-[#66736B]">
            Configure clinic contact details, working hours, appointment scheduling rules, and holiday blocks.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 rounded-xl border border-[#123C2A]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#123C2A] shadow-xs hover:bg-[#F7F3E8]"
        >
          <RefreshCw size={16} />
          Reload Settings
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* TABS */}
      <div className="flex flex-wrap gap-2 border-b border-[#123C2A]/10 pb-3">
        {[
          { id: "info", label: "Clinic Profile", icon: MapPin },
          { id: "hours", label: "Working Hours", icon: Clock },
          { id: "holidays", label: "Clinic Holidays", icon: Calendar, count: holidays.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-semibold transition ${
                isSelected
                  ? "bg-[#123C2A] text-white shadow-sm"
                  : "bg-white text-[#66736B] hover:bg-[#F7F3E8] border border-[#123C2A]/10"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#123C2A]/10 bg-white">
          <RefreshCw size={25} className="animate-spin text-[#789B82]" />
        </div>
      ) : activeTab === "info" ? (
        <form onSubmit={handleSaveSettings} className="rounded-3xl border border-[#123C2A]/10 bg-white p-6 shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-[#123C2A]">General Clinic Information</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#66736B] mb-1">Clinic Name</label>
              <input
                type="text"
                value={clinicInfo.clinicName}
                onChange={(e) => setClinicInfo({ ...clinicInfo, clinicName: e.target.value })}
                required
                className="h-11 w-full rounded-xl border border-[#123C2A]/15 px-3 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#66736B] mb-1">Full Clinic Address</label>
              <textarea
                rows={2}
                value={clinicInfo.address}
                onChange={(e) => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                required
                className="w-full rounded-xl border border-[#123C2A]/15 p-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#66736B] mb-1">Primary Phone</label>
              <input
                type="text"
                value={clinicInfo.phone1}
                onChange={(e) => setClinicInfo({ ...clinicInfo, phone1: e.target.value })}
                required
                className="h-11 w-full rounded-xl border border-[#123C2A]/15 px-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#66736B] mb-1">Secondary Phone</label>
              <input
                type="text"
                value={clinicInfo.phone2}
                onChange={(e) => setClinicInfo({ ...clinicInfo, phone2: e.target.value })}
                className="h-11 w-full rounded-xl border border-[#123C2A]/15 px-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#66736B] mb-1">Clinic Email</label>
              <input
                type="email"
                value={clinicInfo.email}
                onChange={(e) => setClinicInfo({ ...clinicInfo, email: e.target.value })}
                className="h-11 w-full rounded-xl border border-[#123C2A]/15 px-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#66736B] mb-1">Google Maps Embed/URL</label>
              <input
                type="text"
                value={clinicInfo.googleMapsUrl}
                onChange={(e) => setClinicInfo({ ...clinicInfo, googleMapsUrl: e.target.value })}
                className="h-11 w-full rounded-xl border border-[#123C2A]/15 px-3 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#123C2A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0B291D] disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Clinic Information"}
            </button>
          </div>
        </form>
      ) : activeTab === "hours" ? (
        <form onSubmit={handleSaveSettings} className="rounded-3xl border border-[#123C2A]/10 bg-white p-6 shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-[#123C2A]">Weekly Clinic Schedule</h3>

          <div className="space-y-3">
            {workingHours.map((wh, idx) => (
              <div key={wh.day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-[#123C2A]/10 bg-[#F7F3E8]/30">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={wh.isOpen}
                    onChange={(e) => {
                      const updated = [...workingHours];
                      updated[idx].isOpen = e.target.checked;
                      setWorkingHours(updated);
                    }}
                    className="h-4 w-4 rounded accent-[#123C2A]"
                  />
                  <span className="font-bold text-sm text-[#123C2A] w-24">{wh.day}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${wh.isOpen ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                    {wh.isOpen ? "Open" : "Closed"}
                  </span>
                </div>

                {wh.isOpen && (
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="text"
                      value={wh.startTime}
                      onChange={(e) => {
                        const updated = [...workingHours];
                        updated[idx].startTime = e.target.value;
                        setWorkingHours(updated);
                      }}
                      className="h-9 w-24 rounded-lg border px-2 text-center"
                    />
                    <span>to</span>
                    <input
                      type="text"
                      value={wh.endTime}
                      onChange={(e) => {
                        const updated = [...workingHours];
                        updated[idx].endTime = e.target.value;
                        setWorkingHours(updated);
                      }}
                      className="h-9 w-24 rounded-lg border px-2 text-center"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3 border-t">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#123C2A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0B291D] disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Working Hours"}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-3xl border border-[#123C2A]/10 bg-white p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-[#123C2A]">Clinic Holiday Management</h3>
              <p className="text-xs text-[#66736B]">Blocked dates automatically restrict public appointment bookings in real-time.</p>
            </div>
            <button
              onClick={() => setShowHolidayModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#123C2A] px-4 py-2 text-xs font-semibold text-white"
            >
              <Plus size={15} /> Add Holiday
            </button>
          </div>

          {holidays.length === 0 ? (
            <p className="text-center text-sm text-[#66736B] py-8">No clinic holidays configured.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-xs text-[#66736B] uppercase font-bold">
                    <th className="pb-3">Holiday Date</th>
                    <th className="pb-3">Closure Reason</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#123C2A]/6">
                  {holidays.map((h) => (
                    <tr key={h._id} className="hover:bg-[#F7F3E8]/30">
                      <td className="py-3 font-bold text-[#123C2A]">{h.date}</td>
                      <td className="py-3 text-[#17231C]">{h.reason}</td>
                      <td className="py-3">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${h.isActive ? "bg-red-50 text-red-700 border border-red-200" : "bg-gray-100 text-gray-600"}`}>
                          {h.isActive ? "Active Block" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDeleteHoliday(h._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* HOLIDAY MODAL */}
      {showHolidayModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-[#123C2A]">Add Clinic Holiday</h3>
              <button onClick={() => setShowHolidayModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddHoliday} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#66736B] mb-1">Holiday Date *</label>
                <input
                  type="date"
                  value={newHolidayDate}
                  onChange={(e) => setNewHolidayDate(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border px-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#66736B] mb-1">Reason for Closure *</label>
                <input
                  type="text"
                  placeholder="e.g. Diwali Festival / Staff Training"
                  value={newHolidayReason}
                  onChange={(e) => setNewHolidayReason(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border px-3 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setShowHolidayModal(false)} className="px-4 py-2 text-xs border rounded-xl">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-xs bg-[#123C2A] text-white font-semibold rounded-xl disabled:opacity-60">
                  {saving ? "Adding..." : "Add Holiday Block"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
