"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X, Check } from "lucide-react";

interface GalleryItem { id: string; src: string; alt: string; category: string; }

const empty: Omit<GalleryItem, "id"> = { src: "", alt: "", category: "" };

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/admin/gallery").then((r) => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!form.src) return;
    setSaving(true);
    await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setAdding(false);
    setForm({ ...empty });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove from gallery?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Creative Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} images</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all">
          <Plus size={15} /> Add Image
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {items.map((item) => (
          <div key={item.id} className="relative group rounded-xl overflow-hidden border border-gray-100 aspect-[3/4] bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-end p-3">
              <div className="opacity-0 group-hover:opacity-100 transition-all w-full">
                <p className="text-white text-xs font-medium truncate">{item.alt}</p>
                <p className="text-white/60 text-[10px]">{item.category}</p>
              </div>
              <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-red-500 rounded-lg text-white transition-all">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center text-gray-400 text-sm">
            No images yet.
          </div>
        )}
      </div>

      {/* Add modal */}
      {adding && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-gray-900">Add Image</h2>
              <button onClick={() => setAdding(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: "src", label: "Image URL", placeholder: "https://..." },
                { key: "alt", label: "Alt Text / Title", placeholder: "Social Media Poster" },
                { key: "category", label: "Category", placeholder: "Social Media / Branding / Corporate" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                  <input type="text" value={(form as Record<string, string>)[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
                </div>
              ))}
              {form.src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.src} alt="preview" className="w-full h-40 object-cover rounded-lg border border-gray-100" />
              )}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button onClick={() => setAdding(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button onClick={handleAdd} disabled={saving || !form.src} className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-60">
                {saving ? "Adding..." : <><Check size={14} /> Add</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
