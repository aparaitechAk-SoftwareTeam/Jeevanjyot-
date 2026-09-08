import { useEffect, useMemo, useState } from "react";
import {
  MessageSquare,
  Search,
  RefreshCw,
  Phone,
  MessageCircle,
  Mail,
  X,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Eye,
  Tag,
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
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadgeClass(status) {
  switch (status) {
    case "contacted":
      return "border border-blue-200 bg-blue-50 text-blue-700";
    case "follow-up":
      return "border border-purple-200 bg-purple-50 text-purple-700";
    case "resolved":
      return "border border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border border-amber-200 bg-amber-50 text-amber-700";
  }
}

export default function EnquiriesManagement({ logout }) {
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const token = () => localStorage.getItem("jeevanjyot_admin_token");

  const fetchEnquiries = async (manualRefresh = false) => {
    const authToken = token();
    if (!authToken) {
      logout();
      return;
    }

    try {
      setError("");
      if (manualRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await fetch(`${API_URL}/admin/enquiries`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await response.json();
      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch enquiries.");
      }

      setEnquiries(data.enquiries || []);
    } catch (err) {
      setError(err.message || "Unable to load enquiries.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enquiry) => {
      const matchesStatus = statusFilter === "all" || enquiry.status === statusFilter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [enquiry.enquiryId, enquiry.name, enquiry.phone, enquiry.email, enquiry.subject, enquiry.message]
          .filter(Boolean)
          .some((val) => String(val).toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [enquiries, statusFilter, search]);

  const updateStatus = async (enquiryId, status) => {
    const authToken = token();
    if (!authToken) {
      logout();
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`${API_URL}/admin/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status, notes }),
      });

      const data = await response.json();
      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) throw new Error(data.message || "Failed to update.");

      setEnquiries((prev) =>
        prev.map((e) => (e._id === enquiryId ? data.enquiry : e))
      );

      if (selectedEnquiry?._id === enquiryId) {
        setSelectedEnquiry(data.enquiry);
      }
    } catch (err) {
      setError(err.message || "Unable to update status.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <section>
      {/* HEADER */}
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#789B82]">Clinic Management</p>
          <h1 className="mt-1 flex items-center gap-3 text-3xl font-bold tracking-tight text-[#123C2A] sm:text-4xl">
            <MessageSquare size={32} />
            Patient Enquiries
          </h1>
          <p className="mt-2 text-sm text-[#66736B]">
            Track public contact form submissions and patient communication.
          </p>
        </div>

        <button
          onClick={() => fetchEnquiries(true)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#123C2A]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#123C2A] shadow-sm transition hover:bg-[#123C2A] hover:text-white disabled:opacity-60"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Error</p>
            <p className="mt-1">{error}</p>
          </div>
          <button onClick={() => setError("")} className="text-xs font-semibold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* STATUS TABS & SEARCH */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {["all", "new", "contacted", "follow-up", "resolved"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? "bg-[#123C2A] text-white shadow-sm"
                  : "border border-[#123C2A]/10 bg-white text-[#66736B] hover:bg-[#F7F3E8]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:max-w-xs">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#66736B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, message..."
            className="h-11 w-full rounded-xl border border-[#123C2A]/10 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#789B82]"
          />
        </div>
      </div>

      {/* TABLE */}
      <section className="overflow-hidden rounded-2xl border border-[#123C2A]/8 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <RefreshCw size={25} className="animate-spin text-[#789B82]" />
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
            <MessageSquare size={32} className="text-[#789B82]" />
            <h3 className="mt-3 font-semibold text-[#123C2A]">No enquiries found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-[#123C2A]/8 bg-[#F7F3E8]/45 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                  <th className="px-5 py-4">Sender</th>
                  <th className="px-5 py-4">Subject & Message</th>
                  <th className="px-5 py-4">Received</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="border-b border-[#123C2A]/6 hover:bg-[#F7F3E8]/25">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#123C2A]">{enquiry.name}</p>
                      <p className="text-xs text-[#66736B]">{enquiry.phone}</p>
                      {enquiry.email && <p className="text-xs text-[#66736B]">{enquiry.email}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-semibold text-[#17231C]">{enquiry.subject}</p>
                      <p className="mt-0.5 text-xs text-[#66736B] line-clamp-2 max-w-md">{enquiry.message}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#66736B]">
                      {formatDate(enquiry.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusBadgeClass(enquiry.status)}`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => {
                          setSelectedEnquiry(enquiry);
                          setNotes(enquiry.notes || "");
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#123C2A]/10 bg-white text-[#123C2A] hover:bg-[#123C2A] hover:text-white"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* DETAIL MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#123C2A]/8 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#789B82]">Enquiry Details</p>
                <h2 className="mt-1 text-xl font-bold text-[#123C2A]">{selectedEnquiry.name}</h2>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F3E8] text-[#123C2A]">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-2xl border border-[#123C2A]/10 bg-[#F7F3E8]/50 p-4 text-sm space-y-2">
                <p className="font-semibold text-[#123C2A]">Phone: {selectedEnquiry.phone}</p>
                <p className="text-[#66736B]">Email: {selectedEnquiry.email || "N/A"}</p>
                <p className="text-[#66736B]">Subject: {selectedEnquiry.subject}</p>
                <p className="text-xs text-[#66736B]">Date: {formatDate(selectedEnquiry.createdAt)}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#66736B] mb-2">Message</h4>
                <p className="text-sm leading-relaxed text-[#17231C] bg-white p-4 rounded-xl border border-[#123C2A]/8">
                  {selectedEnquiry.message}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#66736B] mb-2">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {["new", "contacted", "follow-up", "resolved"].map((st) => (
                    <button
                      key={st}
                      disabled={updating}
                      onClick={() => updateStatus(selectedEnquiry._id, st)}
                      className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                        selectedEnquiry.status === st
                          ? "bg-[#123C2A] text-white"
                          : "border border-[#123C2A]/15 bg-white text-[#66736B] hover:border-[#123C2A]"
                      }`}
                    >
                      Mark {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#123C2A]/8">
                <button onClick={() => setSelectedEnquiry(null)} className="rounded-xl bg-[#123C2A] px-5 py-2.5 text-sm font-semibold text-white">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
