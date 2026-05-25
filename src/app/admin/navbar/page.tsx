"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GripVertical, Trash2, Eye, EyeOff, Check, AlertCircle, Plus, Lock } from "lucide-react";
import { ICON_REGISTRY, DEFAULT_NAVBAR_ICONS, getIconDef, type NavbarIconDef } from "@/lib/navbar-icons";
import { ModeToggle } from "@/components/mode-toggle";

const MAX_ICONS = 6;

type NavItem = {
  id: string;
  iconName: string;
  label: string;
  href: string;
  visible: boolean;
  isThemeToggle: boolean;
  isHome: boolean;
};

// ── Small inline draggable list ──────────────────────────────────────────────
function useDrag(items: NavItem[], setItems: React.Dispatch<React.SetStateAction<NavItem[]>>) {
  // [M1] useRef instead of plain object literal — persists across re-renders
  const dragId = useRef("");

  const onDragStart = (id: string) => { dragId.current = id; };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (targetId: string) => {
    if (!dragId.current || dragId.current === targetId) return;
    setItems((prev) => {
      const arr = [...prev];
      const from = arr.findIndex((i) => i.id === dragId.current);
      const to   = arr.findIndex((i) => i.id === targetId);
      if (arr[to].isHome || arr[to].isThemeToggle) return prev;
      if (arr[from].isHome || arr[from].isThemeToggle) return prev;
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
    dragId.current = "";
  };

  return { onDragStart, onDragOver, onDrop };
}

// ── Pill preview ─────────────────────────────────────────────────────────────
function PillPreview({ items }: { items: NavItem[] }) {
  const visible = items.filter((i) => i.visible);
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center gap-2 px-4 h-14 rounded-full border border-border bg-card/90 backdrop-blur-3xl shadow-lg">
        {visible.map((item) => {
          const def = getIconDef(item.iconName);
          if (!def) return null;
          if (item.isThemeToggle) {
            return (
              <div key={item.id}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-border bg-background text-muted-foreground">
                <ModeToggle className="size-5 cursor-default pointer-events-none" />
              </div>
            );
          }
          const Icon = def.component;
          return (
            <div key={item.id}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-border bg-background text-muted-foreground">
              <Icon className="w-5 h-5" />
            </div>
          );
        })}
        {visible.length === 0 && (
          <span className="text-xs text-gray-400 px-2">No visible icons</span>
        )}
      </div>
    </div>
  );
}

// ── Icon chooser grid ─────────────────────────────────────────────────────────
function IconChooser({ active, onAdd }: { active: NavItem[]; onAdd: (def: NavbarIconDef) => void }) {
  const available = ICON_REGISTRY.filter(
    (def) => !def.isThemeToggle && !def.isHome && !active.find((a) => a.iconName === def.name)
  );

  if (available.length === 0)
    return <p className="text-xs text-gray-400 mt-1">All available icons are already added.</p>;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {available.map((def) => {
        const Icon = def.component;
        return (
          <button
            key={def.name}
            onClick={() => onAdd(def)}
            title={`Add ${def.label}`}
            className="flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group w-[72px]"
          >
            <Icon className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
            <span className="text-[10px] text-gray-400 group-hover:text-gray-600 transition-colors leading-tight text-center">{def.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function NavbarAdminPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [limitWarn, setLimitWarn] = useState(false);

  // Load from API
  useEffect(() => {
    fetch("/api/admin/navbar")
      .then((r) => r.json())
      .then((data: NavItem[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          // Seed with defaults
          setItems(DEFAULT_NAVBAR_ICONS.map((d, i) => ({ ...d, id: `default-${i}` })));
        } else {
          setItems(data);
        }
      })
      .catch(() => {
        setItems(DEFAULT_NAVBAR_ICONS.map((d, i) => ({ ...d, id: `default-${i}` })));
      })
      .finally(() => setLoading(false));
  }, []);

  const drag = useDrag(items, setItems);

  const visibleCount = items.filter((i) => i.visible).length;

  // [M12] Limit based on total items count (not just visible) so hidden items still occupy a slot
  const addIcon = useCallback((def: NavbarIconDef) => {
    if (items.length >= MAX_ICONS) {
      setLimitWarn(true);
      setTimeout(() => setLimitWarn(false), 3000);
      return;
    }
    setItems((prev) => {
      // Insert before theme toggle (always last)
      const themeIdx = prev.findIndex((i) => i.isThemeToggle);
      const newItem: NavItem = {
        id: `new-${Date.now()}`,
        iconName: def.name,
        label: def.label,
        href: def.defaultHref,
        visible: true,
        isThemeToggle: false,
        isHome: false,
      };
      if (themeIdx === -1) return [...prev, newItem];
      const arr = [...prev];
      arr.splice(themeIdx, 0, newItem);
      return arr;
    });
  }, [visibleCount]);

  const removeIcon = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleVisible = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, visible: !i.visible } : i))
    );
  };

  const updateHref = (id: string, href: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, href } : i)));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/navbar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Save failed. Please try again.");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">

      {/* Header */}
      <div className="pb-2 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Navbar Editor</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage the floating pill navbar. Max {MAX_ICONS} icons. Home is always first, Theme always last.
        </p>
      </div>

      {/* Live Preview */}
      <div className="bg-gray-950 rounded-2xl p-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Live Preview</p>
        <PillPreview items={items} />
        <p className="text-center text-[11px] text-white/20">
          {items.filter((i) => i.visible).length} / {MAX_ICONS} icons visible
        </p>
      </div>

      {/* Limit warning */}
      {limitWarn && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
          <AlertCircle size={15} className="shrink-0" />
          Maximum {MAX_ICONS} icons allowed in the navbar
        </div>
      )}

      {/* Icon chooser */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
          <Plus size={12} className="inline mr-1" /> Add Icons
        </p>
        <IconChooser active={items} onAdd={addIcon} />
      </div>

      {/* Active icons list */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Active Icons (drag to reorder)</p>
        <div className="space-y-2">
          {items.map((item) => {
            const def = getIconDef(item.iconName);
            if (!def) return null;
            const Icon = def.component;
            const locked = item.isHome || item.isThemeToggle;

            return (
              <div
                key={item.id}
                draggable={!locked}
                onDragStart={() => drag.onDragStart(item.id)}
                onDragOver={drag.onDragOver}
                onDrop={() => drag.onDrop(item.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border bg-white transition-all duration-150 ${
                  item.visible ? "border-gray-100" : "border-gray-100 opacity-50"
                }`}
              >
                {/* Drag handle */}
                <div className={`${locked ? "text-gray-200 cursor-not-allowed" : "text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"} shrink-0`}>
                  <GripVertical size={16} />
                </div>

                {/* Icon preview */}
                <div className="w-9 h-9 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0">
                  {item.isThemeToggle ? (
                    <ModeToggle className="size-5 cursor-default pointer-events-none" />
                  ) : (
                    <Icon className="w-4 h-4 text-gray-600" />
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-none">{item.label}</p>
                  {locked && (
                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <Lock size={9} /> {item.isHome ? "Always first" : "Always last"}
                    </p>
                  )}
                </div>

                {/* Href input */}
                {!item.isThemeToggle && (
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => updateHref(item.id, e.target.value)}
                    placeholder="https://..."
                    className="w-44 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400 transition-all font-mono"
                    readOnly={item.isHome}
                  />
                )}
                {item.isThemeToggle && (
                  <span className="w-44 text-xs text-gray-400 italic px-3">auto (no link)</span>
                )}

                {/* Visibility toggle */}
                <button
                  onClick={() => !locked && toggleVisible(item.id)}
                  disabled={locked}
                  title={item.visible ? "Hide" : "Show"}
                  className={`p-2 rounded-lg transition-colors ${
                    locked
                      ? "text-gray-200 cursor-not-allowed"
                      : item.visible
                      ? "text-gray-500 hover:bg-gray-100"
                      : "text-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>

                {/* Delete */}
                <button
                  onClick={() => !locked && removeIcon(item.id)}
                  disabled={locked}
                  title="Remove"
                  className={`p-2 rounded-lg transition-colors ${
                    locked
                      ? "text-gray-200 cursor-not-allowed"
                      : "text-gray-400 hover:bg-red-50 hover:text-red-500"
                  }`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Save button */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-all disabled:opacity-60"
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
          ) : (
            <><Check size={15} /> Save Changes</>
          )}
        </button>
        {saved && (
          <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
            <Check size={14} /> Saved — live site updated
          </span>
        )}
      </div>

    </div>
  );
}
