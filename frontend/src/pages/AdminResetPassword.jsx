import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { LockKeyhole, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Reset Password | Jeevanjyot Admin";
    if (!token) {
      setError("Invalid or missing password reset token. Please request a new link.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-type your new password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/admin/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const contentType = response.headers.get("content-type");
      let data = {};
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || "Failed to reset password." };
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setSuccess(true);
      setMessage(data.message || "Password reset successfully. You can now login with your new password.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Unable to reset password.");
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
              Set New Password
            </h1>

            <p className="mt-2 text-sm text-white/70">
              Enter your new secure admin password below.
            </p>
          </div>

          {/* Content */}
          <div className="p-7">
            {success ? (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={36} />
                </div>
                <h2 className="text-xl font-bold text-[#17231C]">Password Updated!</h2>
                <p className="text-sm text-[#66736B]">{message}</p>
                <Link
                  to="/admin/login"
                  className="block w-full rounded-xl bg-[#123C2A] px-5 py-3.5 font-semibold text-white transition hover:bg-[#0B291D]"
                >
                  Proceed to Admin Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
                    <p>{error}</p>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#17231C]">
                    New Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#66736B]"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password (min 6 chars)"
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-[#DCE3DD] bg-[#FAFBF9] py-3.5 pl-11 pr-11 outline-none transition focus:border-[#123C2A] focus:ring-2 focus:ring-[#123C2A]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#66736B] hover:text-[#17231C]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#17231C]">
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#66736B]"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-[#DCE3DD] bg-[#FAFBF9] py-3.5 pl-11 pr-4 outline-none transition focus:border-[#123C2A] focus:ring-2 focus:ring-[#123C2A]/10"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full rounded-xl bg-[#123C2A] px-5 py-3.5 font-semibold text-white transition hover:bg-[#0B291D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Updating Password..." : "Reset Password"}
                </button>

                <div className="pt-2 text-center">
                  <Link
                    to="/admin/login"
                    className="text-xs font-semibold text-[#123C2A] transition hover:text-[#C5A45D] hover:underline"
                  >
                    Back to Admin Login
                  </Link>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
