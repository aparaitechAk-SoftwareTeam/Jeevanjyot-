import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jeevanjyot_admin_token");
    if (token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const contentType = response.headers.get("content-type");
      let data = {};
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || "Unable to login. Please try again." };
      }

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("jeevanjyot_admin_token", data.token);
      localStorage.setItem(
        "jeevanjyot_admin",
        JSON.stringify(data.admin)
      );

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3E8] px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="bg-[#123C2A] px-7 py-8 text-white">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck size={30} />
            </div>

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C5A45D]">
              Jeevanjyot
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Admin Portal
            </h1>

            <p className="mt-2 text-sm text-white/70">
              Secure clinic management dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-7">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#17231C]">
                Admin Email
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

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-[#17231C]">
                  Password
                </label>
                <Link
                  to="/admin/forgot-password"
                  className="text-xs font-semibold text-[#123C2A] transition hover:text-[#C5A45D] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#66736B]"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[#DCE3DD] bg-[#FAFBF9] py-3.5 pl-11 pr-4 outline-none transition focus:border-[#123C2A] focus:ring-2 focus:ring-[#123C2A]/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#123C2A] px-5 py-3.5 font-semibold text-white transition hover:bg-[#0B291D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In to Admin Panel"}
            </button>

            <p className="text-center text-xs leading-5 text-[#66736B]">
              Authorized clinic administrators only.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}