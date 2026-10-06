import { useEffect, useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  HelpCircle,
  MessageSquareQuote,
  BookOpen,
  Plus,
  RefreshCw,
  X,
  Save,
  CheckCircle2,
  Trash2,
  Edit2,
  AlertCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function mapSectionToTab(section) {
  if (!section) return "testimonials";
  if (section === "knowledge") return "articles";
  if (["testimonials", "gallery", "faqs", "articles"].includes(section)) return section;
  return "testimonials";
}

export default function ContentManagement({ logout, initialTab = "testimonials" }) {
  const [activeTab, setActiveTab] = useState(() => mapSectionToTab(initialTab));

  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const token = () => localStorage.getItem("jeevanjyot_admin_token");

  // Sync activeTab if parent passes a new initialTab prop
  useEffect(() => {
    setActiveTab(mapSectionToTab(initialTab));
  }, [initialTab]);

  const fetchContent = async () => {
    const authToken = token();
    if (!authToken) {
      logout();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const headers = { Authorization: `Bearer ${authToken}` };

      const [resT, resG, resF, resA] = await Promise.all([
        fetch(`${API_URL}/admin/testimonials`, { headers }),
        fetch(`${API_URL}/admin/gallery`, { headers }),
        fetch(`${API_URL}/admin/faqs`, { headers }),
        fetch(`${API_URL}/admin/articles`, { headers }),
      ]);

      const dataT = await resT.json();
      const dataG = await resG.json();
      const dataF = await resF.json();
      const dataA = await resA.json();

      if (dataT.success) setTestimonials(dataT.testimonials || []);
      if (dataG.success) setGallery(dataG.gallery || []);
      if (dataF.success) setFaqs(dataF.faqs || []);
      if (dataA.success) setArticles(dataA.articles || []);
    } catch (err) {
      setError(err.message || "Failed to load content data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({});
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const authToken = token();
    if (!authToken) return logout();

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      };

      let baseEndpoint = "";
      if (activeTab === "testimonials") baseEndpoint = `${API_URL}/admin/testimonials`;
      else if (activeTab === "gallery") baseEndpoint = `${API_URL}/admin/gallery`;
      else if (activeTab === "faqs") baseEndpoint = `${API_URL}/admin/faqs`;
      else if (activeTab === "articles") baseEndpoint = `${API_URL}/admin/articles`;

      const isEdit = Boolean(editingItem?._id);
      const url = isEdit ? `${baseEndpoint}/${editingItem._id}` : baseEndpoint;
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save content.");

      setShowModal(false);
      fetchContent();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const authToken = token();
    if (!authToken) return logout();

    try {
      let endpoint = "";
      if (activeTab === "testimonials") endpoint = `${API_URL}/admin/testimonials/${id}`;
      else if (activeTab === "gallery") endpoint = `${API_URL}/admin/gallery/${id}`;
      else if (activeTab === "faqs") endpoint = `${API_URL}/admin/faqs/${id}`;
      else if (activeTab === "articles") endpoint = `${API_URL}/admin/articles/${id}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete item.");
      }

      fetchContent();
    } catch (err) {
      setError(err.message);
    }
  };

  const getItemLabel = () => {
    if (activeTab === "testimonials") return "Testimonial";
    if (activeTab === "gallery") return "Gallery Item";
    if (activeTab === "faqs") return "FAQ";
    if (activeTab === "articles") return "Knowledge Article";
    return "Content Item";
  };

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#789B82]">Clinic CMS</p>
          <h1 className="mt-1 flex items-center gap-3 text-3xl font-bold tracking-tight text-[#123C2A] sm:text-4xl">
            <BookOpen size={32} />
            Website Content & CMS
          </h1>
          <p className="mt-2 text-sm text-[#66736B]">
            Manage public website testimonials, photo gallery, FAQs, and Knowledge Center articles.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchContent}
            className="flex items-center gap-2 rounded-xl border border-[#123C2A]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#123C2A] shadow-xs hover:bg-[#F7F3E8]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-[#123C2A] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0B291D]"
          >
            <Plus size={16} />
            Add {getItemLabel()}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 border-b border-[#123C2A]/10 pb-3">
        {[
          { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote, count: testimonials.length },
          { id: "gallery", label: "Gallery", icon: ImageIcon, count: gallery.length },
          { id: "faqs", label: "FAQs", icon: HelpCircle, count: faqs.length },
          { id: "articles", label: "Knowledge Center", icon: FileText, count: articles.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition ${
                isSelected
                  ? "bg-[#123C2A] text-white shadow-sm"
                  : "bg-white text-[#66736B] hover:bg-[#F7F3E8] border border-[#123C2A]/10"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENT AREA */}
      <div className="rounded-3xl border border-[#123C2A]/8 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <RefreshCw size={25} className="animate-spin text-[#789B82]" />
          </div>
        ) : activeTab === "testimonials" ? (
          testimonials.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
              <MessageSquareQuote size={36} className="text-[#789B82]" />
              <h3 className="mt-3 font-bold text-[#123C2A] text-base">No testimonials yet</h3>
              <p className="text-xs text-[#66736B] mt-1 max-w-sm">Click "+ Add Testimonial" above to add patient feedback.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {testimonials.map((t) => (
                <div key={t._id} className="rounded-2xl border border-[#123C2A]/10 p-5 bg-[#F7F3E8]/30 relative flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[#123C2A]">{t.patientName}</h3>
                        <p className="text-xs text-[#789B82] font-semibold">{t.treatmentName}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(t)} className="text-[#123C2A] hover:text-[#789B82]">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(t._id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-[#66736B] leading-relaxed">"{t.content}"</p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : activeTab === "gallery" ? (
          gallery.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
              <ImageIcon size={36} className="text-[#789B82]" />
              <h3 className="mt-3 font-bold text-[#123C2A] text-base">No gallery items yet</h3>
              <p className="text-xs text-[#66736B] mt-1 max-w-sm">Click "+ Add Gallery Item" above to publish clinic photos.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((g) => (
                <div key={g._id} className="rounded-2xl border border-[#123C2A]/10 overflow-hidden bg-white shadow-xs">
                  <img src={g.imageUrl} alt={g.title} className="h-44 w-full object-cover" />
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm text-[#123C2A]">{g.title}</h4>
                      <p className="text-xs text-[#66736B]">{g.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(g)} className="text-[#123C2A] hover:text-[#789B82]">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(g._id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : activeTab === "faqs" ? (
          faqs.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
              <HelpCircle size={36} className="text-[#789B82]" />
              <h3 className="mt-3 font-bold text-[#123C2A] text-base">No FAQs yet</h3>
              <p className="text-xs text-[#66736B] mt-1 max-w-sm">Click "+ Add FAQ" above to add clinic questions and answers.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f._id} className="rounded-2xl border border-[#123C2A]/10 p-5 bg-white shadow-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-[#123C2A] text-base">{f.question}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(f)} className="text-[#123C2A] hover:text-[#789B82]">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(f._id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#66736B] leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          )
        ) : (
          articles.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
              <FileText size={36} className="text-[#789B82]" />
              <h3 className="mt-3 font-bold text-[#123C2A] text-base">No articles yet</h3>
              <p className="text-xs text-[#66736B] mt-1 max-w-sm">Click "+ Add Knowledge Article" above to publish wellness articles.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((a) => (
                <div key={a._id} className="rounded-2xl border border-[#123C2A]/10 p-5 bg-white shadow-xs flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-[#123C2A] text-base">{a.title}</h4>
                    <p className="text-xs text-[#66736B] mt-1">Category: {a.category} • Status: <span className="font-semibold text-emerald-700 capitalize">{a.status}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(a)} className="text-[#123C2A] hover:text-[#789B82] p-1">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(a._id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-[#123C2A] capitalize">
                {editingItem ? "Edit" : "Add"} {getItemLabel()}
              </h3>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {activeTab === "testimonials" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#66736B] mb-1">Patient Name *</label>
                    <input
                      placeholder="e.g. Ramesh K."
                      value={formData.patientName || ""}
                      required
                      className="w-full rounded-xl border p-3 text-sm"
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#66736B] mb-1">Treatment Name</label>
                    <input
                      placeholder="e.g. Panchakarma Therapy"
                      value={formData.treatmentName || ""}
                      className="w-full rounded-xl border p-3 text-sm"
                      onChange={(e) => setFormData({ ...formData, treatmentName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#66736B] mb-1">Testimonial Content *</label>
                    <textarea
                      placeholder="Patient experience feedback..."
                      value={formData.content || ""}
                      required
                      rows={3}
                      className="w-full rounded-xl border p-3 text-sm"
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                  </div>
                </>
              )}

              {activeTab === "gallery" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#66736B] mb-1">Image Title *</label>
                    <input
                      placeholder="e.g. Panchakarma Therapy Room"
                      value={formData.title || ""}
                      required
                      className="w-full rounded-xl border p-3 text-sm"
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#66736B] mb-1">Category</label>
                    <input
                      placeholder="e.g. Therapies / Clinic Facilities"
                      value={formData.category || ""}
                      className="w-full rounded-xl border p-3 text-sm"
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#66736B] mb-1">Image URL *</label>
                    <input
                      placeholder="https://..."
                      value={formData.imageUrl || ""}
                      required
                      className="w-full rounded-xl border p-3 text-sm"
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
                </>
              )}

              {activeTab === "faqs" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#66736B] mb-1">Question *</label>
                    <input
                      placeholder="e.g. What is Panchakarma therapy?"
                      value={formData.question || ""}
                      required
                      className="w-full rounded-xl border p-3 text-sm"
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#66736B] mb-1">Answer *</label>
                    <textarea
                      placeholder="Detailed answer..."
                      value={formData.answer || ""}
                      required
                      rows={3}
                      className="w-full rounded-xl border p-3 text-sm"
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    />
                  </div>
                </>
              )}

              {activeTab === "articles" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#66736B] mb-1">Article Title *</label>
                    <input
                      placeholder="e.g. Ayurvedic Lifestyle for Diabetes Prevention"
                      value={formData.title || ""}
                      required
                      className="w-full rounded-xl border p-3 text-sm"
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#66736B] mb-1">Category</label>
                    <input
                      placeholder="e.g. Diabetes Care / Wellness"
                      value={formData.category || ""}
                      className="w-full rounded-xl border p-3 text-sm"
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#66736B] mb-1">Article Content *</label>
                    <textarea
                      placeholder="Full article body..."
                      value={formData.content || ""}
                      required
                      rows={4}
                      className="w-full rounded-xl border p-3 text-sm"
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#66736B] mb-1">Publish Status</label>
                    <select
                      value={formData.status || "published"}
                      className="w-full rounded-xl border p-3 text-sm bg-white"
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-semibold border rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs bg-[#123C2A] text-white rounded-xl font-semibold hover:bg-[#0B291D]">
                  {editingItem ? "Update" : "Save"} {getItemLabel()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
