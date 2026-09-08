import { useEffect, useState } from "react";
import {
  TrendingUp,
  Calendar,
  Users,
  UserCheck,
  Stethoscope,
  Leaf,
  Download,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  Printer,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ReportsManagement({ logout }) {
  const [range, setRange] = useState("this_month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState(null);

  const token = () => localStorage.getItem("jeevanjyot_admin_token");

  const fetchReports = async () => {
    const authToken = token();
    if (!authToken) return logout();

    try {
      setLoading(true);
      setError("");

      let url = `${API_URL}/admin/reports/summary?range=${range}`;
      if (range === "custom") {
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load report analytics.");

      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [range]);

  const handleExportCSV = async () => {
    const authToken = token();
    if (!authToken) return logout();

    try {
      let url = `${API_URL}/admin/reports/export/csv?range=${range}`;
      if (range === "custom") {
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to export CSV report.");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `jeevanjyot_report_${range}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(err.message || "Error exporting CSV.");
    }
  };

  const summary = reportData?.summary;
  const breakdowns = reportData?.breakdowns;

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#789B82]">Analytics & Insights</p>
          <h1 className="mt-1 flex items-center gap-3 text-3xl font-bold tracking-tight text-[#123C2A] sm:text-4xl">
            <TrendingUp size={32} />
            Clinic Reports & Analytics
          </h1>
          <p className="mt-2 text-sm text-[#66736B]">
            Real MongoDB metrics for appointments, patient registrations, doctor workloads, and treatment distributions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchReports}
            className="flex items-center gap-2 rounded-xl border border-[#123C2A]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#123C2A] shadow-xs hover:bg-[#F7F3E8]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl border border-[#123C2A]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#123C2A] shadow-xs hover:bg-[#F7F3E8]"
          >
            <Printer size={16} />
            Print Report
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl bg-[#123C2A] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0B291D]"
          >
            <FileSpreadsheet size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="rounded-2xl border border-[#123C2A]/10 bg-white p-4 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#66736B] mr-2">Time Period:</span>
          {[
            { id: "today", label: "Today" },
            { id: "yesterday", label: "Yesterday" },
            { id: "this_week", label: "This Week" },
            { id: "this_month", label: "This Month" },
            { id: "last_month", label: "Last Month" },
            { id: "custom", label: "Custom Range" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setRange(btn.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                range === btn.id
                  ? "bg-[#123C2A] text-white"
                  : "bg-[#F7F3E8] text-[#66736B] hover:bg-[#123C2A]/10 hover:text-[#123C2A]"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {range === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 rounded-lg border border-[#123C2A]/15 px-2.5 text-xs outline-none"
            />
            <span className="text-xs text-[#66736B]">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-9 rounded-lg border border-[#123C2A]/15 px-2.5 text-xs outline-none"
            />
            <button
              onClick={fetchReports}
              className="rounded-lg bg-[#123C2A] px-3 py-1.5 text-xs font-semibold text-white"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#123C2A]/10 bg-white">
          <RefreshCw size={25} className="animate-spin text-[#789B82]" />
        </div>
      ) : (
        <>
          {/* STAT SUMMARY CARDS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#123C2A]/10 bg-white p-5 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-[#789B82]">
                <span className="text-xs font-bold uppercase tracking-wider">Total Appointments</span>
                <Calendar size={20} />
              </div>
              <p className="text-3xl font-bold text-[#123C2A]">{summary?.appointments?.total || 0}</p>
              <div className="text-xs text-[#66736B] flex justify-between">
                <span>Completed: {summary?.appointments?.completed || 0}</span>
                <span>Pending: {summary?.appointments?.pending || 0}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#123C2A]/10 bg-white p-5 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-[#789B82]">
                <span className="text-xs font-bold uppercase tracking-wider">Patients Registered</span>
                <Users size={20} />
              </div>
              <p className="text-3xl font-bold text-[#123C2A]">{summary?.patients?.total || 0}</p>
              <p className="text-xs text-[#66736B]">New in period: {summary?.patients?.newInPeriod || 0}</p>
            </div>

            <div className="rounded-2xl border border-[#123C2A]/10 bg-white p-5 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-[#789B82]">
                <span className="text-xs font-bold uppercase tracking-wider">Active Doctors</span>
                <Stethoscope size={20} />
              </div>
              <p className="text-3xl font-bold text-[#123C2A]">{summary?.doctors?.active || 0}</p>
              <p className="text-xs text-[#66736B]">Total roster: {summary?.doctors?.total || 0}</p>
            </div>

            <div className="rounded-2xl border border-[#123C2A]/10 bg-white p-5 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-[#789B82]">
                <span className="text-xs font-bold uppercase tracking-wider">Active Treatments</span>
                <Leaf size={20} />
              </div>
              <p className="text-3xl font-bold text-[#123C2A]">{summary?.treatments?.active || 0}</p>
              <p className="text-xs text-[#66736B]">Panchakarma & Specialized</p>
            </div>
          </div>

          {/* TABLES & BREAKDOWNS */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* DOCTOR WORKLOAD */}
            <div className="rounded-2xl border border-[#123C2A]/10 bg-white p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-lg text-[#123C2A]">Doctor Workload & Appointments</h3>
              {breakdowns?.doctorBreakdown?.length === 0 ? (
                <p className="text-sm text-[#66736B] py-6 text-center">No doctor breakdown data available for this period.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-xs text-[#66736B] uppercase font-bold">
                        <th className="pb-2">Doctor Name</th>
                        <th className="pb-2">Total</th>
                        <th className="pb-2">Completed</th>
                        <th className="pb-2">Cancelled</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#123C2A]/5">
                      {breakdowns?.doctorBreakdown?.map((doc, idx) => (
                        <tr key={idx} className="hover:bg-[#F7F3E8]/30">
                          <td className="py-2.5 font-semibold text-[#123C2A]">{doc.doctorName}</td>
                          <td className="py-2.5 text-[#17231C]">{doc.total}</td>
                          <td className="py-2.5 text-emerald-700 font-medium">{doc.completed}</td>
                          <td className="py-2.5 text-red-600">{doc.cancelled}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* TREATMENT POPULARITY */}
            <div className="rounded-2xl border border-[#123C2A]/10 bg-white p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-lg text-[#123C2A]">Treatment & Care Popularity</h3>
              {breakdowns?.treatmentBreakdown?.length === 0 ? (
                <p className="text-sm text-[#66736B] py-6 text-center">No treatment breakdown data available for this period.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-xs text-[#66736B] uppercase font-bold">
                        <th className="pb-2">Treatment / Care</th>
                        <th className="pb-2">Appointments</th>
                        <th className="pb-2">Completed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#123C2A]/5">
                      {breakdowns?.treatmentBreakdown?.map((t, idx) => (
                        <tr key={idx} className="hover:bg-[#F7F3E8]/30">
                          <td className="py-2.5 font-semibold text-[#123C2A]">{t.treatmentName}</td>
                          <td className="py-2.5 text-[#17231C]">{t.total}</td>
                          <td className="py-2.5 text-emerald-700 font-medium">{t.completed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
