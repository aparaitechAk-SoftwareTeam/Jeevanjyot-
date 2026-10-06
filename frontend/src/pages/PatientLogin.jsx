import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, ShieldCheck, ArrowRight, AlertCircle, Leaf } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function PatientLogin() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Please enter your registered mobile number or Patient ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/patient/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("jeevanjyot_patient_token", data.token);
      localStorage.setItem("jeevanjyot_patient", JSON.stringify(data.patient));

      navigate("/patient/portal");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F3E8] p-4 text-[#17231C]">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#123C2A]/10">
        <div className="bg-[#0B291D] p-8 text-center text-white">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#789B82]/20 text-[#C5A45D]">
            <Leaf size={28} />
          </div>
          <h2 className="mt-4 font-serif text-2xl font-bold">Patient Portal</h2>
          <p className="mt-1 text-xs text-white/60">
            Jeevanjyot Nature Cure Ayurvedic Clinic
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#66736B] mb-2">
              Mobile Number or Patient ID *
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66736B]" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter 10-digit mobile or JJP-ID"
                className="h-12 w-full rounded-xl border border-[#123C2A]/15 pl-11 pr-4 text-sm outline-none transition focus:border-[#789B82] focus:ring-2 focus:ring-[#789B82]/15"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#123C2A] text-sm font-semibold text-white transition hover:bg-[#0B291D] disabled:opacity-60"
          >
            <span>{loading ? "Authenticating..." : "Access Patient Portal"}</span>
            <ArrowRight size={16} />
          </button>

          <div className="text-center pt-2">
            <a href="/" className="text-xs text-[#789B82] hover:underline font-semibold">
              ← Return to Main Website
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
