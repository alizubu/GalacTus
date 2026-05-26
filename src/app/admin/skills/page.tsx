"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { X, Plus, GripVertical, Pencil, Check, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Skill { id: string; name: string; iconUrl: string; order: number; }

// ── Small inline icon uploader ───────────────────────────────────────────────
function IconUploadButton({
  value, onChange,
}: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "portfolio/skill-icons");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Upload failed"); return; }
      onChange(data.url);
    } catch { toast.error("Upload failed."); }
    finally { setUploading(false); }
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      {/* Preview or placeholder */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        title="Upload icon"
        className="w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center
                   cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-all overflow-hidden shrink-0"
      >
        {uploading ? (
          <Loader2 size={13} className="animate-spin text-gray-400" />
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="icon" className="w-5 h-5 object-contain" />
        ) : (
          <Upload size={12} className="text-gray-400" />
        )}
      </div>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-gray-300 hover:text-red-400 transition-colors"
          title="Remove icon"
        >
          <X size={11} />
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SkillsAdminPage() {
  const [skills, setSkills]       = useState<Skill[]>([]);
  const [input, setInput]         = useState("");
  const [newIcon, setNewIcon]     = useState("");
  const [loadError, setLoadError] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId]       = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingIcon, setEditingIcon] = useState("");
  const dragRef = { current: null as string | null };

  const load = () =>
    fetch("/api/admin/skills")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setSkills)
      .catch((err) => { console.error(err); setLoadError(true); });
  useEffect(() => { load(); }, []);

  const addSkill = async () => {
    const name = input.trim();
    if (!name) return;
    try {
      const res = await fetch("/api/admin/skills", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, iconUrl: newIcon }),
      });
      if (!res.ok) { toast.error("Failed to add skill."); return; }
      setInput(""); setNewIcon(""); load();
    } catch { toast.error("Network error."); }
  };

  const removeSkill = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
      if (!res.ok) { toast.error("Failed to delete skill."); return; }
      load();
    } catch { toast.error("Network error."); }
  };

  const startEdit = (s: Skill) => {
    setEditingId(s.id); setEditingName(s.name); setEditingIcon(s.iconUrl ?? "");
  };
  const cancelEdit = () => { setEditingId(null); setEditingName(""); setEditingIcon(""); };

  const saveEdit = async (id: string) => {
    const name = editingName.trim();
    if (!name) return;
    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, iconUrl: editingIcon }),
      });
      if (!res.ok) { toast.error("Failed to update skill."); return; }
      cancelEdit(); load();
    } catch { toast.error("Network error."); }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill(); }
  };

  const handleDragStart = (id: string) => { dragRef.current = id; setDraggingId(id); };
  const handleDragEnter = (id: string) => { if (dragRef.current !== id) setOverId(id); };
  const handleDragEnd = async () => {
    if (dragRef.current && overId && dragRef.current !== overId) {
      const ids = skills.map((s) => s.id);
      const fromIdx = ids.indexOf(dragRef.current);
      const toIdx = ids.indexOf(overId);
      const newIds = [...ids];
      const [moved] = newIds.splice(fromIdx, 1);
      newIds.splice(toIdx, 0, moved);
      setSkills(newIds.map((id) => skills.find((s) => s.id === id)!).filter(Boolean));
      setReordering(true);
      try {
        await fetch("/api/admin/reorder", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collection: "skill", ids: newIds }),
        });
      } finally { setReordering(false); }
    }
    dragRef.current = null; setDraggingId(null); setOverId(null);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
        <p className="text-gray-500 text-sm mt-1">
          {skills.length} skills · Upload a PNG/SVG icon per skill
          {reordering && <span className="text-blue-500 ml-2">· Saving order...</span>}
          {skills.length > 1 && !reordering && <span className="text-gray-400 ml-2">· Drag to reorder</span>}
        </p>
      </div>

      {loadError && <p className="text-red-500 text-sm">Failed to load skills. Refresh the page.</p>}

      {/* Add new skill */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Add New Skill</p>
        <div className="flex gap-3 items-center">
          {/* Icon upload for new skill */}
          <IconUploadButton value={newIcon} onChange={setNewIcon} />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="e.g. Meta Ads Manager"
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400"
          />
          <button
            onClick={addSkill}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all shrink-0"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        {newIcon && (
          <p className="text-[11px] text-gray-400 mt-2">
            Icon ready — click Add to save skill with icon.
          </p>
        )}
      </div>

      {/* Skills list */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-1.5">
        {skills.length === 0 && <p className="text-gray-400 text-sm">No skills yet. Add some above.</p>}
        {skills.map((s) => (
          <div
            key={s.id}
            draggable={editingId !== s.id}
            onDragStart={() => handleDragStart(s.id)}
            onDragEnter={() => handleDragEnter(s.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all
              ${draggingId === s.id ? "opacity-40 bg-gray-50" : "hover:bg-gray-50"}
              ${overId === s.id ? "border-t-2 border-blue-400" : ""}`}
          >
            <GripVertical size={14} className="text-gray-300 cursor-grab shrink-0" />

            {editingId === s.id ? (
              <>
                {/* Icon upload in edit mode */}
                <IconUploadButton value={editingIcon} onChange={setEditingIcon} />
                <input
                  autoFocus
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")  { e.preventDefault(); saveEdit(s.id); }
                    if (e.key === "Escape") cancelEdit();
                  }}
                  className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-gray-500"
                />
                <button onClick={() => saveEdit(s.id)} className="text-green-500 hover:text-green-700 p-0.5"><Check size={13} /></button>
                <button onClick={cancelEdit}           className="text-gray-300 hover:text-gray-500 p-0.5"><X size={13} /></button>
              </>
            ) : (
              <>
                {/* Icon preview in list */}
                <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 overflow-hidden">
                  {s.iconUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={s.iconUrl} alt={s.name} className="w-5 h-5 object-contain" />
                    : <div className="w-4 h-4 rounded bg-gray-200" />}
                </div>
                <span className="flex-1 text-sm text-gray-800">{s.name}</span>
                <button onClick={() => startEdit(s)}   className="text-gray-300 hover:text-blue-500 p-0.5"><Pencil size={12} /></button>
                <button onClick={() => removeSkill(s.id)} className="text-gray-300 hover:text-red-500 p-0.5"><X size={12} /></button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
