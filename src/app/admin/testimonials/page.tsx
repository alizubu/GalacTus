"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, AlertCircle, Star } from "lucide-react";
import toast from "react-hot-toast";

interface Testimonial {
  id: string; name: string; role: string; quote: string; stars: number;
}

const empty: Omit<Testimonial, "id"> = { name: "", role: "", quote: "", stars: 5 };

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={18}
            className={n <= value ? "fill-amber-400 text-amber-400" : "text-gray-300"}
          />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialsAdminPage() {
  const [items, setItems]     = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [isNew, setIsNew]     = useState(false);
  const [saving, setSaving]   = useState(false);
  const [saveError, setSaveError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/testimonials")
      .then((r) => r.json())
      .then((data) => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setEditing({ ...empty }); setIsNew(true);  setSaveError(""); };
  const openEdit = (t: Testimonial) => { setEditing({ ...t }); setIsNew(false); setSaveError(""); };
  const closeEdit = () => { setEditing(null); setIsNew(false); setSaveError(""); };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name?.trim() || !editing.quote?.trim()) {
      setSaveError("Name and quote are required.");
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      const method = isNew ? "POST" : "PUT";
      const url    = isNew ? "/api/admin/testimonials" : `/api/admin/testimonials/${editing.id}`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok) { setSaveError(data.error ?? "Save failed."); return; }
      toast.success(isNew ? "Testimonial added." : "Testimonial updated.");
      closeEdit();
      load();
    } catch { setSaveError("Network error."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) { toast.error("Delete failed."); return; }
      toast.success("Deleted.");
      load();
    } catch { toast.error("Network error."); }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} testimonials</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all">
          <Plus size={15} /> Add
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center text-gray-400 text-sm">
          No testimonials yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                {t.role && <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>}
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed line-clamp-2">"{t.quote}"</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => openEdit(t)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(t.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-gray-900">{isNew ? "Add Testimonial" : "Edit Testimonial"}</h2>
              <button onClick={closeEdit} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} /></button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Client Name</label>
                <input type="text" value={editing.name ?? ""}
                  onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Sarah Mitchell"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Role / Company</label>
                <input type="text" value={editing.role ?? ""}
                  onChange={(e) => setEditing((p) => ({ ...p, role: e.target.value }))}
                  placeholder="CTO, NovaTech Solutions"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>

              {/* Quote */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Testimonial Quote</label>
                <textarea rows={4} value={editing.quote ?? ""}
                  onChange={(e) => setEditing((p) => ({ ...p, quote: e.target.value }))}
                  placeholder="Working with Shelvey was..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none" />
              </div>

              {/* Stars */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Rating</label>
                <StarPicker
                  value={editing.stars ?? 5}
                  onChange={(n) => setEditing((p) => ({ ...p, stars: n }))}
                />
              </div>
            </div>

            {saveError && (
              <div className="mx-6 mb-3 flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                {saveError}
              </div>
            )}

            <div className="flex justify-end gap-3 p-6 border-t">
              <button onClick={closeEdit} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-60 transition-all">
                {saving ? "Saving..." : <><Check size={14} /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
