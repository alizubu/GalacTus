"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import DraggableList from "@/components/admin/DraggableList";

interface Experience {
  id: string; company: string; href: string; logo: string;
  title: string; location: string; startDate: string;
  endDate: string; description: string; badges: string[];
  [key: string]: unknown;
}

const empty: Omit<Experience, "id"> = {
  company: "", href: "#", logo: "", title: "",
  location: "", startDate: "", endDate: "Present",
  description: "", badges: [],
};

export default function ExperienceAdminPage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);

  const load = () =>
    fetch("/api/admin/experience").then((r) => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({ ...empty }); setIsNew(true); };
  const openEdit = (item: Experience) => { setEditing({ ...item }); setIsNew(false); };
  const closeEdit = () => { setEditing(null); setIsNew(false); };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/admin/experience" : `/api/admin/experience/${editing.id}`;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setSaving(false); closeEdit(); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
    load();
  };

  const handleReorder = useCallback(async (newIds: string[]) => {
    // Optimistic update
    const ordered = newIds.map((id) => items.find((i) => i.id === id)!).filter(Boolean);
    setItems(ordered);
    setReordering(true);
    try {
      await fetch("/api/admin/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "experience", ids: newIds }),
      });
    } finally {
      setReordering(false);
    }
  }, [items]);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Experience</h1>
          <p className="text-gray-500 text-sm mt-1">
            {items.length} entries
            {reordering && <span className="text-blue-500 ml-2">· Saving order...</span>}
            {items.length > 1 && !reordering && <span className="text-gray-400 ml-2">· Drag to reorder</span>}
          </p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all">
          <Plus size={15} /> Add Entry
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center text-gray-400 text-sm">
          No entries yet. Click &quot;Add Entry&quot; to get started.
        </div>
      ) : (
        <DraggableList
          items={items}
          onReorder={handleReorder}
          renderItem={(item) => (
            <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">{item.company}</p>
                <p className="text-sm text-gray-500">{item.title}</p>
                <p className="text-xs text-gray-400 mt-1">{item.startDate} – {item.endDate} · {item.location}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          )}
        />
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-gray-900">{isNew ? "Add Experience" : "Edit Experience"}</h2>
              <button onClick={closeEdit} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: "company", label: "Company Name" },
                { key: "title", label: "Job Title" },
                { key: "location", label: "Location" },
                { key: "href", label: "Company URL" },
                { key: "startDate", label: "Start Date (e.g. Jan 2021)" },
                { key: "endDate", label: "End Date (or Present)" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                  <input type="text" value={(editing as Record<string, string>)[f.key] ?? ""}
                    onChange={(e) => setEditing((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
                </div>
              ))}
              <ImageUpload label="Company Logo" value={editing.logo ?? ""} onChange={(url) => setEditing((p) => ({ ...p, logo: url }))} />
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea rows={4} value={editing.description ?? ""}
                  onChange={(e) => setEditing((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button onClick={closeEdit} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-60">
                {saving ? "Saving..." : <><Check size={14} /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
