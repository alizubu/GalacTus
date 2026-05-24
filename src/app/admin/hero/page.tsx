"use client";

import { useState, useEffect, useRef } from "react";
import SaveButton from "@/components/admin/SaveButton";
import { Upload, X, Loader2 } from "lucide-react";

const TEXT_FIELDS = [
  { key: "hero_name",        label: "Full Name",          placeholder: "Shelvey Dias" },
  { key: "hero_greeting",    label: "Greeting",           placeholder: "Hi, I'm" },
  { key: "hero_tagline",     label: "Tagline / Role",     placeholder: "Corporate Marketing Strategist" },
  { key: "hero_description", label: "Short Description",  placeholder: "5+ years driving real results...", multiline: true },
];

function AvatarUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Upload failed"); return; }
      onChange(data.url);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Profile Photo
      </label>

      {/* Preview + upload */}
      <div className="flex items-center gap-5">
        {/* Avatar preview */}
        <div className="relative shrink-0">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Avatar preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
              No photo
            </div>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X size={10} />
            </button>
          )}
        </div>

        {/* Upload controls */}
        <div className="flex-1 space-y-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 font-medium transition-all disabled:opacity-60"
          >
            {uploading ? (
              <><Loader2 size={14} className="animate-spin" />Uploading...</>
            ) : (
              <><Upload size={14} />Upload New Photo</>
            )}
          </button>
          <p className="text-[11px] text-gray-400">JPG, PNG, WebP · Max 2MB</p>
          {error && <p className="text-xs text-red-500">{error}</p>}

          {/* Manual URL fallback */}
          <div>
            <label className="block text-[10px] text-gray-400 mb-1">Or paste image URL</label>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/assets/images/shelvey.jpeg"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
}

export default function HeroAdminPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => { setValues(data); setLoading(false); })
      .catch((err) => { console.error(err); setFetchError("Failed to load data. Refresh the page."); setLoading(false); });
  }, []);

  const handleSave = async () => {
    const payload: Record<string, string> = {};
    [...TEXT_FIELDS.map((f) => f.key), "hero_avatar_url"].forEach((key) => {
      if (values[key] !== undefined) payload[key] = values[key];
    });
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error ?? "Save failed"); }
  };

  if (loading) return <div className="text-gray-400 text-sm animate-pulse">Loading...</div>;
  if (fetchError) return (
    <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-4">{fetchError}</div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hero Section</h1>
        <p className="text-gray-500 text-sm mt-1">Edit the top section of your portfolio</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
        {/* Avatar upload — top of the form */}
        <AvatarUpload
          value={values.hero_avatar_url ?? "/assets/images/shelvey.jpeg"}
          onChange={(url) => setValues((v) => ({ ...v, hero_avatar_url: url }))}
        />

        <hr className="border-gray-100" />

        {/* Text fields */}
        {TEXT_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              {f.label}
            </label>
            {f.multiline ? (
              <textarea
                rows={3}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 resize-none"
              />
            ) : (
              <input
                type="text"
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400"
              />
            )}
          </div>
        ))}
      </div>

      <SaveButton onSave={handleSave} />
    </div>
  );
}
