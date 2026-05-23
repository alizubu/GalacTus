"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface Education {
  id: string; school: string; href: string; logo: string;
  degree: string; startYear: string; endYear: string;
}

const empty: Omit<Education, "id"> = {
  school: "", href: "#", logo: "", degree: "", startYear: "", endYear: "",
};

export default function EducationAdminPage() {
  const [items, setItems] = useState<Education[]>([]);
  const [editing, setEditing] = useState<Partial<Education> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/admin/education").then((r) => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({ ...empty }); setIsNew(true); };
  const openEdit = (item: Education) => { setEditing({ ...item }); setIsNew(false); };
  const closeEdit = () => { setEditing(null); setIsNew(false); };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/admin/education" : `/api/admin/education/${editing.id}`;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setSaving(false); closeEdit(); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/admin/education/${id}`, { method: "DELETE" });
    load();
  };

  const fields = [
    { key: "school", label: "Institution Name" },
    { key: "degree", label: "Degree / Program" },
    { key: "startYear", label: "Start Year" },
    { key: "endYear", label: "End Year (or Present)" },
    { key: "href", label: "Website URL" },
    { key: "logo", label: "Logo URL" },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Education</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} entries</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all">
          <Plus size={15} /> Add
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900">{item.school}</p>
              <p className="text-sm text-gray-500">{item.degree}</p>
              <p className="text-xs text-gray-400 mt-1">{item.startYear} – {item.endYear}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center text-gray-400 text-sm">No entries yet.</div>}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-gray-900">{isNew ? "Add Education" : "Edit Education"}</h2>
              <button onClick={closeEdit} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                  <input type="text" value={(editing as Record<string, string>)[f.key] ?? ""} onChange={(e) => setEditing((p) => ({ ...p, [f.key]: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button onClick={closeEdit} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-60">
                {saving ? "Saving..." : <><Check size={14} /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
