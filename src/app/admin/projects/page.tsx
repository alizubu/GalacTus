"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Project {
  id: string; title: string; href: string; description: string;
  imageUrl: string; videoUrl: string; tags: string[]; dates: string; featured: boolean;
  [key: string]: unknown;
}

const empty: Omit<Project, "id"> = {
  title: "", href: "#", description: "", imageUrl: "",
  videoUrl: "", tags: [], dates: "", featured: true,
};

export default function ProjectsAdminPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const load = () => fetch("/api/admin/projects").then((r) => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({ ...empty }); setIsNew(true); setTagInput(""); };
  const openEdit = (item: Project) => { setEditing({ ...item }); setIsNew(false); setTagInput(""); };
  const closeEdit = () => { setEditing(null); setIsNew(false); };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || !editing) return;
    setEditing((p) => ({ ...p, tags: [...(p?.tags ?? []), t] }));
    setTagInput("");
  };
  const removeTag = (tag: string) =>
    setEditing((p) => ({ ...p, tags: (p?.tags ?? []).filter((t) => t !== tag) }));

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/admin/projects" : `/api/admin/projects/${editing.id}`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    closeEdit();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case Studies</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} projects</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all">
          <Plus size={15} /> Add Project
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-400 mt-1">{item.dates}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((t) => (
                  <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center text-gray-400 text-sm">
            No projects yet.
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-gray-900">{isNew ? "Add Project" : "Edit Project"}</h2>
              <button onClick={closeEdit} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: "title", label: "Title" },
                { key: "href", label: "Live URL" },
                { key: "dates", label: "Date Range (e.g. 2 Weeks)" },
                { key: "videoUrl", label: "Video URL (optional)" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                  <input
                    type="text"
                    value={(editing as Record<string, string>)[f.key] ?? ""}
                    onChange={(e) => setEditing((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>
              ))}
              {/* Image upload */}
              <ImageUpload
                label="Project Image"
                value={editing.imageUrl ?? ""}
                onChange={(url) => setEditing((p) => ({ ...p, imageUrl: url }))}
              />
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add tag + Enter" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
                  <button onClick={addTag} className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"><Plus size={14} /></button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(editing.tags ?? []).map((t) => (
                    <span key={t} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                      {t}<button onClick={() => removeTag(t)} className="text-gray-400 hover:text-red-500"><X size={10} /></button>
                    </span>
                  ))}
                </div>
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
