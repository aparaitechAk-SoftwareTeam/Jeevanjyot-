import { useEffect, useState } from "react";
import {
  Bell,
  Search,
  RefreshCw,
  AlertCircle,
  X,
  Mail,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function formatDate(date) {
  if (!date) return "—";
  const val = new Date(date);
  if (Number.isNaN(val.getTime())) return date;
  return val.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsManagement({ logout }) {
  const [notifications, setNotifications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedNotif, setSelectedNotif] = useState(null);
  const [retryingId, setRetryingId] = useState(null);

  const token = () => localStorage.getItem("jeevanjyot_admin_token");

  const fetchNotifications = async () => {
    const authToken = token();
    if (!authToken) return logout();

    try {
      setLoading(true);
      setError("");

      let url = `${API_URL}/admin/notifications?`;
      if (statusFilter) url += `status=${statusFilter}&`;
      if (channelFilter) url += `channel=${channelFilter}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch notifications.");

      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [statusFilter, channelFilter]);

  const handleRetry = async (id) => {
    const authToken = token();
    if (!authToken) return logout();

    try {
      setRetryingId(id);
      setError("");

      const response = await fetch(`${API_URL}/admin/notifications/${id}/retry`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Delivery provider not configured.");
      }

      fetchNotifications();
    } catch (err) {
      setError(err.message);
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#789B82]">Communication Logs</p>
          <h1 className="mt-1 flex items-center gap-3 text-3xl font-bold tracking-tight text-[#123C2A] sm:text-4xl">
            <Bell size={32} />
            Notifications & Dispatch History
          </h1>
          <p className="mt-2 text-sm text-[#66736B]">
            Track automated Email, WhatsApp, and System notification logs generated for appointments and patient updates.
          </p>
        </div>

        <button
          onClick={fetchNotifications}
          className="flex items-center gap-2 rounded-xl border border-[#123C2A]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#123C2A] shadow-xs hover:bg-[#F7F3E8]"
        >
          <RefreshCw size={16} />
          Refresh History
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-700" />
          <span>{error}</span>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="rounded-2xl border border-[#123C2A]/10 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#66736B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchNotifications()}
              placeholder="Search recipient, phone, subject..."
              className="h-10 w-full rounded-xl border border-[#123C2A]/15 bg-white pl-10 pr-4 text-xs outline-none focus:border-[#789B82]"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-[#123C2A]/15 px-3 bg-white outline-none font-medium"
            >
              <option value="">All Statuses</option>
              <option value="sent">Sent</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="not_configured">Not Configured</option>
            </select>

            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="h-10 rounded-xl border border-[#123C2A]/15 px-3 bg-white outline-none font-medium"
            >
              <option value="">All Channels</option>
              <option value="Email">Email</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="System">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* LIST TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#123C2A]/8 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <RefreshCw size={25} className="animate-spin text-[#789B82]" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-5 text-center">
            <Bell size={32} className="text-[#789B82]" />
            <h3 className="mt-3 font-semibold text-[#123C2A]">No notification logs found</h3>
            <p className="text-xs text-[#66736B] mt-1">Notifications are generated automatically when appointments or records are processed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-[#123C2A]/8 bg-[#F7F3E8]/45 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                  <th className="px-5 py-4">Event Type</th>
                  <th className="px-5 py-4">Recipient</th>
                  <th className="px-5 py-4">Channel</th>
                  <th className="px-5 py-4">Delivery Status</th>
                  <th className="px-5 py-4">Created Date</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#123C2A]/6">
                {notifications.map((n) => (
                  <tr key={n._id} className="hover:bg-[#F7F3E8]/25">
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#123C2A] text-sm">{n.type}</p>
                      <p className="text-xs text-[#66736B] truncate max-w-xs">{n.subject || n.message}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#17231C] text-xs">{n.recipientName || "Patient"}</p>
                      <p className="text-[11px] text-[#66736B]">{n.email || n.phone || "—"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#123C2A]">
                        {n.channel === "Email" ? <Mail size={14} /> : <MessageSquare size={14} />}
                        {n.channel}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {n.status === "sent" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={13} /> Sent
                        </span>
                      ) : n.status === "not_configured" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                          <AlertTriangle size={13} /> Not Configured
                        </span>
                      ) : n.status === "failed" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 border border-red-200">
                          <XCircle size={13} /> Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-[#66736B]">
                      {formatDate(n.createdAt)}
                    </td>
                    <td className="px-5 py-4 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedNotif(n)}
                        className="rounded-lg border border-[#123C2A]/15 px-2.5 py-1 text-xs font-semibold text-[#123C2A] hover:bg-[#123C2A] hover:text-white"
                      >
                        Details
                      </button>
                      {["failed", "not_configured"].includes(n.status) && (
                        <button
                          onClick={() => handleRetry(n._id)}
                          disabled={retryingId === n._id}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#123C2A] px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-50"
                        >
                          <RotateCw size={12} className={retryingId === n._id ? "animate-spin" : ""} />
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedNotif && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#789B82]">Notification Details</p>
                <h3 className="font-bold text-lg text-[#123C2A]">{selectedNotif.type}</h3>
              </div>
              <button onClick={() => setSelectedNotif(null)}><X size={18} /></button>
            </div>

            <div className="space-y-3 text-xs text-[#17231C]">
              <div className="grid grid-cols-2 gap-2 bg-[#F7F3E8]/40 p-3 rounded-xl">
                <div><strong>Recipient:</strong> {selectedNotif.recipientName}</div>
                <div><strong>Channel:</strong> {selectedNotif.channel}</div>
                <div><strong>Phone:</strong> {selectedNotif.phone || "—"}</div>
                <div><strong>Email:</strong> {selectedNotif.email || "—"}</div>
              </div>

              <div>
                <strong>Subject:</strong>
                <p className="text-sm font-semibold text-[#123C2A] mt-0.5">{selectedNotif.subject || "N/A"}</p>
              </div>

              <div>
                <strong>Message Content:</strong>
                <div className="mt-1 rounded-xl border p-3 bg-white font-mono text-[11px] leading-relaxed">
                  {selectedNotif.message}
                </div>
              </div>

              {selectedNotif.errorMessage && (
                <div className="rounded-xl bg-amber-50 p-3 text-amber-900 border border-amber-200">
                  <strong>Provider Status Message:</strong>
                  <p className="mt-0.5">{selectedNotif.errorMessage}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button onClick={() => setSelectedNotif(null)} className="rounded-xl border px-4 py-2 text-xs font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
