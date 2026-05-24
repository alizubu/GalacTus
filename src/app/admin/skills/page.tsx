"use client";

import { useState, useEffect, useCallback, KeyboardEvent } from "react";
import { X, Plus, GripVertical } from "lucide-react";

interface Skill { id: string; name: string; order: number; }

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [input, setInput] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const dragItem = useCallback(() => ({ current: null as string | null }), []);
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
        body: JSON.stringify({ name }),
      });
      if (!res.ok) return;
      setInput(""); load();
    } catch (err) { console.error(err); }
  };

  const removeSkill = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      load();
    } catch (err) { console.error(err); }
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
      const reordered = newIds.map((id) => skills.find((s) => s.id === id)!).filter(Boolean);
      setSkills(reordered);
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
          {skills.length} skills · Type and press Enter to add
          {reordering && <span className="text-blue-500 ml-2">· Saving order...</span>}
          {skills.length > 1 && !reordering && <span className="text-gray-400 ml-2">· Drag rows to reorder</span>}
        </p>
      </div>

      {loadError && <p className="text-red-500 text-sm">Failed to load skills. Refresh the page.</p>}

      {/* Add input */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex gap-3">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder="e.g. Meta Ads Manager"
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
          <button onClick={addSkill} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Draggable skill list */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-1.5">
        {skills.length === 0 && <p className="text-gray-400 text-sm">No skills yet. Add some above.</p>}
        {skills.map((s) => (
          <div
            key={s.id}
            draggable
            onDragStart={() => handleDragStart(s.id)}
            onDragEnter={() => handleDragEnter(s.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all
              ${draggingId === s.id ? "opacity-40 bg-gray-50" : "hover:bg-gray-50"}
              ${overId === s.id ? "border-t-2 border-blue-400" : ""}`}
          >
            <GripVertical size={14} className="text-gray-300 cursor-grab shrink-0" />
            <span className="flex-1 text-sm text-gray-800">{s.name}</span>
            <button onClick={() => removeSkill(s.id)} className="text-gray-300 hover:text-red-500 transition-colors p-0.5">
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
