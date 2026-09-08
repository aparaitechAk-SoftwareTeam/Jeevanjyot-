import { useEffect, useMemo, useState } from "react";
import {
  Star,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Trash2,
  AlertCircle,
  ShieldCheck,
  CalendarDays,
  User,
  Phone,
  Layers,
  Clock,
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
  });
}

export default function ReviewsManagement({ logout }) {
  const [reviews, setReviews] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [savingReplyId, setSavingReplyId] = useState("");

  const token = () => localStorage.getItem("jeevanjyot_admin_token");

  const fetchReviews = async (manualRefresh = false) => {
    const authToken = token();
    if (!authToken) {
      logout();
      return;
    }

    try {
      setError("");
      if (manualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_URL}/admin/reviews`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to load reviews.");
      }

      setReviews(data.reviews || []);
    } catch (err) {
      setError(err.message || "Unable to load review data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesStatus =
        selectedStatus === "all" || review.status === selectedStatus;

      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [
          review.reviewId,
          review.patientName,
          review.patientPhone,
          review.appointmentBookingId,
          review.treatmentCare,
          review.doctorName,
          review.reviewText,
          review.adminReply,
        ]
          .filter(Boolean)
          .some((val) => String(val).toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [reviews, selectedStatus, search]);

  const saveReply = async (reviewId) => {
    const text = (replyTexts[reviewId] || "").trim();
    if (!text) return;

    const authToken = token();
    if (!authToken) {
      logout();
      return;
    }

    try {
      setSavingReplyId(reviewId);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/reviews/${reviewId}/reply`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ adminReply: text }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to save reply.");
      }

      setEditingReplyId(null);
      await fetchReviews(true);
    } catch (err) {
      setError(err.message || "Unable to save reply.");
    } finally {
      setSavingReplyId("");
    }
  };

  const approveReview = async (reviewId) => {
    const authToken = token();
    if (!authToken) {
      logout();
      return;
    }

    try {
      setActionId(reviewId);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/reviews/${reviewId}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to approve review.");
      }

      await fetchReviews(true);
    } catch (err) {
      setError(err.message || "Unable to approve review.");
    } finally {
      setActionId("");
    }
  };

  const rejectReview = async (reviewId) => {
    const authToken = token();
    if (!authToken) {
      logout();
      return;
    }

    try {
      setActionId(reviewId);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/reviews/${reviewId}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to reject review.");
      }

      await fetchReviews(true);
    } catch (err) {
      setError(err.message || "Unable to reject review.");
    } finally {
      setActionId("");
    }
  };

  const deleteReview = async (review) => {
    const confirmed = window.confirm(
      `Delete review by "${review.patientName}"?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    const authToken = token();
    if (!authToken) {
      logout();
      return;
    }

    try {
      setActionId(review._id);
      setError("");

      const response = await fetch(`${API_URL}/admin/reviews/${review._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete review.");
      }

      await fetchReviews(true);
    } catch (err) {
      setError(err.message || "Unable to delete review.");
    } finally {
      setActionId("");
    }
  };

  return (
    <section>
      {/* HEADER */}
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#789B82]">
            Patient Experience & Moderation
          </p>

          <h1 className="mt-1 flex items-center gap-3 text-3xl font-bold tracking-tight text-[#123C2A] sm:text-4xl">
            <Star size={32} className="text-[#C5A45D]" />
            Patient Reviews Management
          </h1>

          <p className="mt-2 text-sm text-[#66736B]">
            Moderate patient reviews for completed appointments before publishing to the public website.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fetchReviews(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#123C2A]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#123C2A] shadow-sm transition hover:bg-[#123C2A] hover:text-white disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="text-xs font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TABS & SEARCH BAR */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Reviews" },
            { id: "pending", label: "Pending Approval" },
            { id: "approved", label: "Approved" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => {
            const count =
              tab.id === "all"
                ? reviews.length
                : reviews.filter((r) => r.status === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  selectedStatus === tab.id
                    ? "bg-[#123C2A] text-white shadow-sm"
                    : "border border-[#123C2A]/10 bg-white text-[#66736B] hover:bg-[#F7F3E8]"
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:max-w-xs">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#66736B]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient, phone or review..."
            className="h-11 w-full rounded-xl border border-[#123C2A]/10 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#789B82] focus:ring-2 focus:ring-[#789B82]/15"
          />
        </div>
      </div>

      {/* TABLE / LIST */}
      <section className="overflow-hidden rounded-2xl border border-[#123C2A]/8 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={25}
                className="mx-auto animate-spin text-[#789B82]"
              />
              <p className="mt-3 text-sm text-[#66736B]">Loading reviews...</p>
            </div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#789B82]/10 text-[#789B82]">
              <Star size={25} />
            </div>
            <h3 className="mt-4 font-semibold text-[#123C2A]">
              No reviews found
            </h3>
            <p className="mt-1 max-w-sm text-xs leading-5 text-[#66736B]">
              No patient review records match the selected filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead>
                <tr className="border-b border-[#123C2A]/8 bg-[#F7F3E8]/45">
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Patient & Appointment
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Rating
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Review Text
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Status & Date
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#66736B]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredReviews.map((review) => (
                  <tr
                    key={review._id}
                    className="border-b border-[#123C2A]/6 last:border-0 hover:bg-[#F7F3E8]/25"
                  >
                    <td className="px-5 py-5">
                      <div>
                        <p className="font-semibold text-[#123C2A]">
                          {review.patientName}
                        </p>
                        <p className="text-xs text-[#66736B] flex items-center gap-1 mt-0.5">
                          <Phone size={12} className="text-[#789B82]" />
                          {review.patientPhone}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#123C2A]">
                          <span className="rounded-md bg-[#F7F3E8] px-2 py-0.5 font-bold">
                            {review.treatmentCare || "Ayurvedic Treatment"}
                          </span>
                          <span className="text-[#66736B]">
                            ({review.appointmentBookingId})
                          </span>
                        </div>
                        {review.isVerified && (
                          <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                            <ShieldCheck size={12} /> Verified Patient
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? "fill-[#C5A45D] text-[#C5A45D]"
                                : "text-slate-200"
                            }
                          />
                        ))}
                        <span className="ml-1 text-xs font-bold text-[#123C2A]">
                          {review.rating}.0
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-5 max-w-xs sm:max-w-md">
                      <div className="mb-1 text-[11px] font-medium text-[#66736B] flex items-center gap-1">
                        <User size={12} className="text-[#789B82]" />
                        Attending Doctor: <span className="font-bold text-[#123C2A]">{review.doctorName || "Dr. Jeevan Atole"}</span>
                      </div>

                      <p className="text-xs leading-relaxed text-[#17231C] bg-[#F7F3E8]/30 p-3 rounded-xl border border-[#123C2A]/6">
                        "{review.reviewText}"
                      </p>

                      {/* Admin / Doctor Reply Section */}
                      {review.adminReply && editingReplyId !== review._id ? (
                        <div className="mt-2.5 rounded-xl border border-[#789B82]/25 bg-[#789B82]/10 p-2.5 text-xs">
                          <div className="flex items-center justify-between font-semibold text-[#123C2A]">
                            <span className="flex items-center gap-1">
                              <ShieldCheck size={13} className="text-[#123C2A]" />
                              Reply by {review.repliedBy || "Dr. Jeevan Atole"}:
                            </span>
                            <button
                              onClick={() => {
                                setEditingReplyId(review._id);
                                setReplyTexts((prev) => ({ ...prev, [review._id]: review.adminReply }));
                              }}
                              className="text-[10px] font-bold text-[#123C2A] underline hover:text-[#789B82]"
                            >
                              Edit Reply
                            </button>
                          </div>
                          <p className="mt-1 italic text-[#123C2A]/90">"{review.adminReply}"</p>
                          {review.repliedAt && (
                            <span className="mt-1 block text-[10px] text-[#66736B]">
                              Replied on {formatDate(review.repliedAt)}
                            </span>
                          )}
                        </div>
                      ) : editingReplyId === review._id || !review.adminReply ? (
                        <div className="mt-2.5">
                          {editingReplyId === review._id ? (
                            <div className="space-y-2 rounded-xl border border-[#123C2A]/15 bg-white p-2.5 shadow-xs">
                              <textarea
                                value={
                                  replyTexts[review._id] !== undefined
                                    ? replyTexts[review._id]
                                    : review.adminReply || ""
                                }
                                onChange={(e) =>
                                  setReplyTexts((prev) => ({
                                    ...prev,
                                    [review._id]: e.target.value,
                                  }))
                                }
                                placeholder="Write doctor / admin response to patient..."
                                rows={2}
                                className="w-full rounded-lg border border-[#123C2A]/10 p-2 text-xs text-[#123C2A] outline-none focus:border-[#789B82]"
                              />
                              <div className="flex items-center justify-end gap-2">
                                {review.adminReply && (
                                  <button
                                    onClick={() => setEditingReplyId(null)}
                                    className="px-2.5 py-1 text-[11px] font-semibold text-[#66736B] hover:underline"
                                  >
                                    Cancel
                                  </button>
                                )}
                                <button
                                  onClick={() => saveReply(review._id)}
                                  disabled={
                                    savingReplyId === review._id ||
                                    !replyTexts[review._id]?.trim()
                                  }
                                  className="rounded-lg bg-[#123C2A] px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-[#123C2A]/90 disabled:opacity-50"
                                >
                                  {savingReplyId === review._id ? "Saving..." : "Save Reply"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingReplyId(review._id);
                                setReplyTexts((prev) => ({
                                  ...prev,
                                  [review._id]: review.adminReply || "",
                                }));
                              }}
                              className="mt-1 text-[11px] font-semibold text-[#123C2A] underline hover:text-[#789B82]"
                            >
                              + Add Doctor Reply
                            </button>
                          )}
                        </div>
                      ) : null}
                    </td>

                    <td className="px-5 py-5">
                      <div className="space-y-1">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                            review.status === "approved"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : review.status === "rejected"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {review.status}
                        </span>
                        <p className="text-[11px] text-[#66736B]">
                          Submitted: {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        {review.status === "pending" && (
                          <>
                            <button
                              onClick={() => approveReview(review._id)}
                              disabled={actionId === review._id}
                              title="Approve Review"
                              className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-60"
                            >
                              <CheckCircle2 size={14} />
                              Approve
                            </button>
                            <button
                              onClick={() => rejectReview(review._id)}
                              disabled={actionId === review._id}
                              title="Reject Review"
                              className="flex items-center gap-1 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-amber-700 disabled:opacity-60"
                            >
                              <XCircle size={14} />
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => deleteReview(review)}
                          disabled={actionId === review._id}
                          title="Delete Review"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-60"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
