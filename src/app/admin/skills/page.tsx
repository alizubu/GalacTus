"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";

interface Skill { id: string; name: string; order: number; }

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [input, setInput] = useState("");

  const load = () => fetch("/api/admin/skills").then((r) => r.json()).then(setSkills);
  useEffect(() => { load(); }, []);

  const addSkill = async () => {
    const name = input.trim();
    if (!name) return;
    await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setInput("");
    load();
  };

  const removeSkill = async (id: string) => {
    await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
    load();
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill(); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
        <p className="text-gray-500 text-sm mt-1">{skills.length} skills · Type and press Enter to add</p>
      </div>

      {/* Add input */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex gap-3">
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
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Skills pills */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s.id}
              className="flex items-center gap-1.5 bg-gray-100 text-gray-800 text-sm px-3 py-1.5 rounded-full"
            >
              {s.name}
              <button
                onClick={() => removeSkill(s.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {skills.length === 0 && (
            <p className="text-gray-400 text-sm">No skills yet. Add some above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
