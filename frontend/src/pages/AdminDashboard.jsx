import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientsManagement from "./PatientsManagement";
import DoctorsManagement from "./DoctorsManagement";
import TreatmentsManagement from "./TreatmentsManagement";
import EnquiriesManagement from "./EnquiriesManagement";
import PrescriptionsManagement from "./PrescriptionsManagement";
import ReportsManagement from "./ReportsManagement";
import NotificationsManagement from "./NotificationsManagement";
import SettingsManagement from "./SettingsManagement";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Leaf,
  FileText,
  ClipboardList,
  MessageSquare,
  Image,
  HelpCircle,
  BookOpen,
  Bell,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Search,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock3,
  XCircle,
  CalendarCheck2,
  ChevronDown,
  RefreshCw,
  UserRound,
  Activity,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    key: "dashboard",
    available: true,
  },
  {
    label: "Appointments",
    icon: CalendarDays,
    key: "appointments",
    available: true,
  },
  {
    label: "Patients",
    icon: Users,
    key: "patients",
    available: true,
  },
  {
    label: "Doctors",
    icon: Stethoscope,
    key: "doctors",
    available: true,
  },
  {
    label: "Treatments",
    icon: Leaf,
    key: "treatments",
    available: true,
  },
  {
    label: "Prescriptions",
    icon: ClipboardList,
    key: "prescriptions",
    available: true,
  },
  {
    label: "Reports",
    icon: FileText,
    key: "reports",
    available: true,
  },
  {
    label: "Enquiries",
    icon: MessageSquare,
    key: "enquiries",
    available: true,
  },
  {
    label: "Notifications",
    icon: Bell,
    key: "notifications",
    available: true,
  },
  {
    label: "Clinic Settings",
    icon: Settings,
    key: "settings",
    available: true,
  },
];

const statusOptions = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "rejected",
];

function formatDate(date) {
  if (!date) return "—";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isToday(date) {
  if (!date) return false;

  const value = new Date(date);
  const today = new Date();

  return (
    value.getFullYear() === today.getFullYear() &&
    value.getMonth() === today.getMonth() &&
    value.getDate() === today.getDate()
  );
}

function statusClasses(status) {
  switch (status) {
    case "confirmed":
      return "border border-emerald-200 bg-emerald-50 text-emerald-700";
    case "completed":
      return "border border-blue-200 bg-blue-50 text-blue-700";
    case "cancelled":
      return "border border-red-200 bg-red-50 text-red-700";
    case "rejected":
      return "border border-slate-200 bg-slate-100 text-slate-600";
    default:
      return "border border-amber-200 bg-amber-50 text-amber-700";
  }
}

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-2xl border border-[#123C2A]/8 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#789B82]/12 text-[#123C2A]">
          <Icon size={21} />
        </div>

        <span className="text-2xl font-bold text-[#123C2A]">
          {value}
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-[#66736B]">
        {title}
      </p>

      <p className="mt-1 text-xs text-[#66736B]/75">
        {description}
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jeevanjyot_admin_token");
    const adminData = localStorage.getItem("jeevanjyot_admin");

    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    try {
      setAdmin(adminData ? JSON.parse(adminData) : null);
    } catch {
      setAdmin(null);
    }

    fetchAppointments(token);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("jeevanjyot_admin_token");
    localStorage.removeItem("jeevanjyot_admin");
    navigate("/admin/login", { replace: true });
  };

  const fetchAppointments = async (token, manualRefresh = false) => {
    try {
      if (manualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        `${API_URL}/admin/appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
          data.message || "Unable to load appointments."
        );
      }

      setAppointments(data.appointments || []);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load appointment data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshAppointments = () => {
    const token = localStorage.getItem(
      "jeevanjyot_admin_token"
    );

    if (token) {
      fetchAppointments(token, true);
    }
  };

  const updateStatus = async (appointmentId, status) => {
    const token = localStorage.getItem(
      "jeevanjyot_admin_token"
    );

    if (!token) {
      logout();
      return;
    }

    try {
      setUpdatingId(appointmentId);

      const response = await fetch(
        `${API_URL}/admin/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update status."
        );
      }

      setAppointments((current) =>
        current.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                status: data.appointment.status,
              }
            : appointment
        )
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to update appointment status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const stats = useMemo(() => {
    const total = appointments.length;

    const pending = appointments.filter(
      (item) => item.status === "pending"
    ).length;

    const confirmed = appointments.filter(
      (item) => item.status === "confirmed"
    ).length;

    const completed = appointments.filter(
      (item) => item.status === "completed"
    ).length;

    const cancelled = appointments.filter(
      (item) => item.status === "cancelled"
    ).length;

    const rejected = appointments.filter(
      (item) => item.status === "rejected"
    ).length;

    const today = appointments.filter((item) =>
      isToday(item.preferredDate)
    ).length;

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      rejected,
      today,
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return appointments;
    }

    return appointments.filter((item) =>
      [
        item.patientName,
        item.phone,
        item.bookingId,
        item.care,
        item.status,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [appointments, search]);

  const selectSection = (item) => {
    if (!item.available) {
      return;
    }

    setActiveSection(item.key);
    setMobileSidebar(false);
  };

  const firstName =
    admin?.name?.split(" ")[0] || "Admin";

  return (
    <div className="min-h-screen bg-[#F7F3E8] text-[#17231C]">

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#0B291D] px-4 text-white lg:hidden">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#C5A45D]">
            JEEVANJYOT
          </p>
          <p className="text-sm font-semibold">
            Admin Portal
          </p>
        </div>

        <button
          onClick={() => setMobileSidebar(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"
        >
          <Menu size={21} />
        </button>
      </div>

      {/* ================= MOBILE SIDEBAR OVERLAY ================= */}
      {mobileSidebar && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
          onClick={() => setMobileSidebar(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed left-0 top-0 z-[70] flex h-screen w-[270px] flex-col bg-[#0B291D] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebar
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Brand */}
        <div className="flex h-[88px] items-center justify-between border-b border-white/10 px-6">
          <div>
            <p className="text-[11px] font-bold tracking-[0.28em] text-[#C5A45D]">
              JEEVANJYOT
            </p>

            <h1 className="mt-1 text-lg font-semibold">
              Clinic Admin
            </h1>
          </div>

          <button
            onClick={() => setMobileSidebar(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
            Main Menu
          </p>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active =
                activeSection === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => selectSection(item)}
                  disabled={!item.available}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                    active
                      ? "bg-[#789B82]/20 text-white"
                      : item.available
                      ? "text-white/65 hover:bg-white/5 hover:text-white"
                      : "cursor-not-allowed text-white/30"
                  }`}
                >
                  <Icon size={18} />

                  <span className="flex-1">
                    {item.label}
                  </span>

                  {!item.available && (
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-white/35">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Profile */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#789B82]/20 text-[#C5A45D]">
              <UserRound size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {admin?.name || "Jeevanjyot Admin"}
              </p>

              <p className="truncate text-[11px] text-white/45">
                {admin?.email || "Administrator"}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="min-h-screen lg:pl-[270px]">

        {/* Desktop Header */}
        <header className="hidden h-[88px] items-center justify-between border-b border-[#123C2A]/10 bg-[#F7F3E8]/95 px-8 backdrop-blur-xl lg:flex">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#789B82]">
              Jeevanjyot Clinic
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#123C2A]">
              {activeSection === "dashboard"
                ? "Dashboard Overview"
                : activeSection === "appointments"
                ? "Appointment Management"
                : activeSection === "patients"
                ? "Patient Management"
                : "Clinic Management"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right xl:block">
              <p className="text-sm font-semibold text-[#123C2A]">
                Welcome, {firstName}
              </p>

              <p className="text-xs text-[#66736B]">
                Clinic Administrator
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#123C2A] text-white">
              <ShieldCheck size={19} />
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-[#123C2A]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#123C2A] shadow-sm transition hover:bg-[#123C2A] hover:text-white"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

          {activeSection === "patients" ? (
            <PatientsManagement logout={logout} />
          ) : activeSection === "doctors" ? (
            <DoctorsManagement logout={logout} />
          ) : activeSection === "treatments" ? (
            <TreatmentsManagement logout={logout} />
          ) : activeSection === "prescriptions" ? (
            <PrescriptionsManagement logout={logout} />
          ) : activeSection === "reports" ? (
            <ReportsManagement logout={logout} />
          ) : activeSection === "notifications" ? (
            <NotificationsManagement logout={logout} />
          ) : activeSection === "settings" ? (
            <SettingsManagement logout={logout} />
          ) : activeSection === "enquiries" ? (
            <EnquiriesManagement logout={logout} />
          ) : ["gallery", "faqs", "knowledge", "testimonials"].includes(activeSection) ? (
            <ContentManagement logout={logout} initialTab={activeSection} />
          ) : (
            <>
          {/* ================= OVERVIEW ================= */}
          <section>
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-medium text-[#789B82]">
                  Clinic Management
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#123C2A] sm:text-4xl">
                  Good day, {firstName}
                </h1>

                <p className="mt-2 text-sm text-[#66736B]">
                  Manage appointments and monitor clinic activity from one place.
                </p>
              </div>

              <button
                onClick={refreshAppointments}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#123C2A]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#123C2A] shadow-sm transition hover:bg-[#123C2A] hover:text-white disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing ? "animate-spin" : ""
                  }
                />
                Refresh
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">

              <StatCard
                title="Total Appointments"
                value={stats.total}
                icon={CalendarCheck2}
                description="All appointment requests"
              />

              <StatCard
                title="Today's Appointments"
                value={stats.today}
                icon={CalendarDays}
                description="Appointments scheduled today"
              />

              <StatCard
                title="Pending Requests"
                value={stats.pending}
                icon={Clock3}
                description="Waiting for confirmation"
              />

              <StatCard
                title="Confirmed"
                value={stats.confirmed}
                icon={CheckCircle2}
                description="Confirmed appointments"
              />

            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-3">

              <StatCard
                title="Completed"
                value={stats.completed}
                icon={Activity}
                description="Completed appointments"
              />

              <StatCard
                title="Cancelled"
                value={stats.cancelled}
                icon={XCircle}
                description="Cancelled appointments"
              />

              <StatCard
                title="Rejected"
                value={stats.rejected}
                icon={XCircle}
                description="Rejected requests"
              />

            </div>
          </section>

          {/* ================= ERROR ================= */}
          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <XCircle
                size={19}
                className="mt-0.5 shrink-0"
              />

              <div className="flex-1">
                <p className="font-semibold">
                  Something went wrong
                </p>

                <p className="mt-1">
                  {error}
                </p>
              </div>

              <button
                onClick={() => setError("")}
                className="text-xs font-semibold underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ================= QUICK ACTIONS ================= */}
          <section className="mt-7 grid gap-4 md:grid-cols-3">

            <button
              onClick={() => setActiveSection("appointments")}
              className="group rounded-2xl border border-[#123C2A]/8 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#789B82]/12 text-[#123C2A]">
                <CalendarDays size={21} />
              </div>

              <h3 className="mt-4 font-semibold text-[#123C2A]">
                Manage Appointments
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#66736B]">
                View requests, update statuses and contact patients.
              </p>

              <span className="mt-4 inline-block text-xs font-bold text-[#789B82] group-hover:text-[#123C2A]">
                Open appointments →
              </span>
            </button>

            <button
              onClick={() => setActiveSection("patients")}
              className="group rounded-2xl border border-[#123C2A]/8 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#789B82]/12 text-[#123C2A]">
                <Users size={21} />
              </div>

              <h3 className="mt-4 font-semibold text-[#123C2A]">
                Patient Management
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#66736B]">
                View patient profiles, history, and basic medical information.
              </p>

              <span className="mt-4 inline-block text-xs font-bold text-[#789B82] group-hover:text-[#123C2A]">
                Open patients →
              </span>
            </button>

            <button
              onClick={() => setActiveSection("treatments")}
              className="group rounded-2xl border border-[#123C2A]/8 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#789B82]/12 text-[#123C2A]">
                <Leaf size={21} />
              </div>

              <h3 className="mt-4 font-semibold text-[#123C2A]">
                Treatment Management
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#66736B]">
                Manage Ayurveda, Panchakarma, and specialized care treatments.
              </p>

              <span className="mt-4 inline-block text-xs font-bold text-[#789B82] group-hover:text-[#123C2A]">
                Open treatments →
              </span>
            </button>

          </section>

          {/* ================= APPOINTMENTS ================= */}
          <section className="mt-7 overflow-hidden rounded-2xl border border-[#123C2A]/8 bg-white shadow-sm">

            <div className="flex flex-col gap-4 border-b border-[#123C2A]/8 p-5 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={20}
                    className="text-[#789B82]"
                  />

                  <h2 className="text-lg font-bold text-[#123C2A]">
                    Appointment Requests
                  </h2>
                </div>

                <p className="mt-1 text-xs text-[#66736B]">
                  {filteredAppointments.length} appointment
                  {filteredAppointments.length === 1 ? "" : "s"} shown
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
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search patient, phone, booking ID..."
                  className="h-11 w-full rounded-xl border border-[#123C2A]/10 bg-[#F7F3E8]/45 pl-10 pr-4 text-sm outline-none transition focus:border-[#789B82] focus:ring-2 focus:ring-[#789B82]/15"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[280px] items-center justify-center">
                <div className="text-center">
                  <RefreshCw
                    size={25}
                    className="mx-auto animate-spin text-[#789B82]"
                  />

                  <p className="mt-3 text-sm text-[#66736B]">
                    Loading appointments...
                  </p>
                </div>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#789B82]/10 text-[#789B82]">
                  <CalendarDays size={25} />
                </div>

                <h3 className="mt-4 font-semibold text-[#123C2A]">
                  No appointments found
                </h3>

                <p className="mt-1 max-w-sm text-xs leading-5 text-[#66736B]">
                  There are no appointments matching your current search.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead>
                    <tr className="border-b border-[#123C2A]/8 bg-[#F7F3E8]/45">
                      <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                        Patient
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                        Booking ID
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                        Care
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                        Preferred Date
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                        Status
                      </th>

                      <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAppointments.map(
                      (appointment) => (
                        <tr
                          key={appointment._id}
                          className="border-b border-[#123C2A]/6 last:border-0 hover:bg-[#F7F3E8]/25"
                        >
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#789B82]/12 text-[#123C2A]">
                                <UserRound size={17} />
                              </div>

                              <div>
                                <p className="font-semibold text-[#123C2A]">
                                  {appointment.patientName}
                                </p>

                                <p className="mt-0.5 text-xs text-[#66736B]">
                                  {appointment.phone}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <span className="rounded-lg bg-[#F7F3E8] px-2.5 py-1.5 text-[11px] font-semibold text-[#123C2A]">
                              {appointment.bookingId}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <span className="text-sm text-[#17231C]">
                              {appointment.care}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <span className="text-sm text-[#17231C]">
                              {formatDate(
                                appointment.preferredDate
                              )}
                            </span>

                            {isToday(
                              appointment.preferredDate
                            ) && (
                              <span className="ml-2 rounded-full bg-[#789B82]/10 px-2 py-1 text-[9px] font-bold text-[#789B82]">
                                TODAY
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-5">
                            <div className="relative inline-block">
                              <select
                                value={
                                  appointment.status ||
                                  "pending"
                                }
                                disabled={
                                  updatingId ===
                                  appointment._id
                                }
                                onChange={(e) =>
                                  updateStatus(
                                    appointment._id,
                                    e.target.value
                                  )
                                }
                                className={`h-10 appearance-none rounded-xl pl-3 pr-9 text-xs font-semibold outline-none ${statusClasses(
                                  appointment.status
                                )}`}
                              >
                                {statusOptions.map(
                                  (status) => (
                                    <option
                                      key={status}
                                      value={status}
                                    >
                                      {status
                                        .charAt(0)
                                        .toUpperCase() +
                                        status.slice(1)}
                                    </option>
                                  )
                                )}
                              </select>

                              <ChevronDown
                                size={14}
                                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                              />
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${appointment.phone}`}
                                title="Call patient"
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B291D] text-white transition hover:-translate-y-0.5 hover:bg-[#123C2A]"
                              >
                                <Phone size={16} />
                              </a>

                              <a
                                href={`https://wa.me/91${String(
                                  appointment.phone
                                ).replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                title="WhatsApp patient"
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#789B82] text-white transition hover:-translate-y-0.5 hover:bg-[#123C2A]"
                              >
                                <MessageCircle size={17} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </section>

          {/* ================= STATUS SUMMARY ================= */}
          <section className="mt-7 grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl border border-[#123C2A]/8 bg-[#0B291D] p-6 text-white shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A45D]">
                    Appointment Flow
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    Keep every request organized
                  </h3>
                </div>

                <CalendarCheck2
                  size={25}
                  className="text-[#C5A45D]"
                />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-xl font-bold">
                    {stats.pending}
                  </p>
                  <p className="mt-1 text-[10px] text-white/50">
                    Pending
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-xl font-bold">
                    {stats.confirmed}
                  </p>
                  <p className="mt-1 text-[10px] text-white/50">
                    Confirmed
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-xl font-bold">
                    {stats.completed}
                  </p>
                  <p className="mt-1 text-[10px] text-white/50">
                    Completed
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#123C2A]/8 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#789B82]">
                    Clinic Information
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-[#123C2A]">
                    Jeevanjyot Ayurvedic Clinic
                  </h3>
                </div>

                <ShieldCheck
                  size={25}
                  className="text-[#789B82]"
                />
              </div>

              <p className="mt-4 text-sm leading-6 text-[#66736B]">
                Nature Cure Ayurvedic Clinic &
                Panchakarma Centre
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-[#66736B]">
                <Clock3 size={15} />
                Monday–Saturday • 10:00 AM–9:00 PM
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-[#66736B]">
                <Phone size={15} />
                9822510456 • 9035051086
              </div>
            </div>

          </section>

            </>
          )}
          <footer className="py-8 text-center text-xs text-[#66736B]">
            Jeevanjyot Nature Cure Ayurvedic Clinic & Panchakarma Centre
            <span className="mx-2">•</span>
            Admin Portal
          </footer>

        </main>
      </div>
    </div>
  );
}

