import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notConfigured, setNotConfigured] = useState(false);

  useEffect(() => {
    document.title = "Forgot Password | Jeevanjyot Admin";
    const token = localStorage.getItem("jeevanjyot_admin_token");
    if (token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");
    setNotConfigured(false);

    try {
      const response = await fetch(`${API_URL}/admin/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const contentType = response.headers.get("content-type");
      let data = {};
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || "Failed to process request." };
      }

      if (!response.ok) {
        if (data.configured === false) {
          setNotConfigured(true);
        }
        throw new Error(data.message || "Failed to process request.");
      }

      setMessage(
        data.message ||
          "If an account exists with this email, a password reset link has been sent."
      );
      setEmail("");
    } catch (err) {
      setError(err.message || "Unable to send reset request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3E8] px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-2xl">
          
          {/* Header Banner */}
          <div className="bg-[#123C2A] px-7 py-8 text-white">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck size={30} />
            </div>

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C5A45D]">
              Jeevanjyot Admin
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Forgot Password?
            </h1>

            <p className="mt-2 text-sm text-white/70">
              Request a secure link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 p-7">
            {message && (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                <p>{message}</p>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
                <div>
                  <p className="font-semibold">{error}</p>
                  {notConfigured && (
                    <p className="mt-1 text-xs text-red-700">
                      SMTP or Brevo email credentials must be added to <code>backend/.env</code> (e.g. <code>SMTP_HOST</code>, <code>SMTP_USER</code>, <code>SMTP_PASS</code> or <code>BREVO_API_KEY</code>).
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#17231C]">
                Registered Admin Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#66736B]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#DCE3DD] bg-[#FAFBF9] py-3.5 pl-11 pr-4 outline-none transition focus:border-[#123C2A] focus:ring-2 focus:ring-[#123C2A]/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#123C2A] px-5 py-3.5 font-semibold text-white transition hover:bg-[#0B291D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending Reset Link..." : "Send Reset Link"}
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#123C2A] transition hover:text-[#C5A45D] hover:underline"
              >
                <ArrowLeft size={16} />
                Back to Admin Login
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
