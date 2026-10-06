import {
  X,
  Phone,
  MessageCircle,
  CalendarDays,
  Clock3,
  UserRound,
  Leaf,
  FileText,
  CheckCircle2,
} from "lucide-react";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function AppointmentDetailsModal({
  appointment,
  onClose,
  onStatusChange,
  updating = false,
}) {
  if (!appointment) return null;

  const phone = appointment.phone || "";
  const cleanPhone = phone.replace(/\D/g, "");

  const formattedDate = appointment.preferredDate
    ? new Date(`${appointment.preferredDate}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      )
    : "Not specified";

  const createdDate = appointment.createdAt
    ? new Date(appointment.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not available";

  const status = appointment.status || "pending";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B291D]/60 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-[#F7F3E8] shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#123C2A]/10 bg-[#F7F3E8]/95 px-6 py-5 backdrop-blur-xl sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#789B82]">
              Appointment Details
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#123C2A] sm:text-2xl">
              {appointment.patientName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#123C2A]/10 bg-white text-[#123C2A] transition hover:bg-[#123C2A] hover:text-white"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          {/* Booking ID + Status */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#123C2A]/10 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66736B]">
                Booking ID
              </p>

              <p className="mt-2 break-all font-mono text-sm font-semibold text-[#123C2A]">
                {appointment.bookingId || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border border-[#123C2A]/10 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66736B]">
                Current Status
              </p>

              <div className="mt-2">
                <span
                  className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${
                    statusStyles[status] || statusStyles.pending
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="rounded-2xl border border-[#123C2A]/10 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#789B82]/15 text-[#123C2A]">
                <UserRound size={18} />
              </div>

              <h3 className="font-semibold text-[#123C2A]">
                Patient Information
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#66736B]">Patient Name</p>
                <p className="mt-1 font-semibold text-[#17231C]">
                  {appointment.patientName || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#66736B]">Mobile Number</p>
                <p className="mt-1 font-semibold text-[#17231C]">
                  {appointment.phone || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Information */}
          <div className="rounded-2xl border border-[#123C2A]/10 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#789B82]/15 text-[#123C2A]">
                <CalendarDays size={18} />
              </div>

              <h3 className="font-semibold text-[#123C2A]">
                Appointment Information
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#66736B]">Selected Care</p>
                <p className="mt-1 flex items-center gap-2 font-semibold text-[#17231C]">
                  <Leaf size={16} className="text-[#789B82]" />
                  {appointment.care || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#66736B]">Preferred Date</p>
                <p className="mt-1 flex items-center gap-2 font-semibold text-[#17231C]">
                  <CalendarDays size={16} className="text-[#789B82]" />
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Patient Message */}
          <div className="rounded-2xl border border-[#123C2A]/10 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#789B82]/15 text-[#123C2A]">
                <FileText size={18} />
              </div>

              <h3 className="font-semibold text-[#123C2A]">
                Health Concern / Message
              </h3>
            </div>

            <p className="rounded-xl bg-[#F7F3E8] p-4 text-sm leading-6 text-[#66736B]">
              {appointment.message?.trim()
                ? appointment.message
                : "No message provided by the patient."}
            </p>
          </div>

          {/* Created */}
          <div className="flex items-center gap-2 text-sm text-[#66736B]">
            <Clock3 size={16} />
            Request received: {createdDate}
          </div>

          {/* Status Update */}
          <div className="rounded-2xl border border-[#123C2A]/10 bg-white p-5">
            <label className="text-sm font-semibold text-[#123C2A]">
              Update Appointment Status
            </label>

            <select
              value={status}
              disabled={updating}
              onChange={(e) => onStatusChange(e.target.value)}
              className="mt-3 w-full rounded-xl border border-[#123C2A]/10 bg-[#F7F3E8] px-4 py-3 text-sm font-medium text-[#123C2A] outline-none focus:border-[#789B82]"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>

            {updating && (
              <p className="mt-2 text-xs text-[#66736B]">
                Updating appointment status...
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={cleanPhone ? `tel:${cleanPhone}` : "#"}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#123C2A] px-5 py-3.5 font-semibold text-white transition hover:bg-[#0B291D]"
            >
              <Phone size={18} />
              Call Patient
            </a>

            <a
              href={
                cleanPhone
                  ? `https://wa.me/91${cleanPhone}`
                  : "#"
              }
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#123C2A]/15 bg-white px-5 py-3.5 font-semibold text-[#123C2A] transition hover:bg-[#123C2A] hover:text-white"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-[#789B82]/10 p-3 text-xs leading-5 text-[#66736B]">
            <CheckCircle2
              size={15}
              className="mt-0.5 shrink-0 text-[#123C2A]"
            />
            Appointment information shown here comes directly from the clinic
            booking record.
          </div>
        </div>
      </div>
    </div>
  );
}
