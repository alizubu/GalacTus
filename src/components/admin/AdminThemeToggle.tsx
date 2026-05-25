"use client";

import { Sun, Moon } from "lucide-react";
import { useAdminTheme } from "./AdminThemeProvider";

interface Props {
  /** compact — icon only, no label (default false) */
  compact?: boolean;
}

export default function AdminThemeToggle({ compact = false }: Props) {
  const { dark, toggleTheme } = useAdminTheme();

  return (
    <button
      onClick={toggleTheme}
      title={dark ? "Switch to Light mode" : "Switch to Dark mode"}
      className={`inline-flex items-center gap-1.5 rounded-xl text-[13px] font-medium
                  transition-all duration-200 hover:scale-[1.04] active:scale-[0.96]
                  ${compact ? "p-2" : "px-4 py-2"}`}
      style={{
        background: dark ? "rgba(255,255,255,0.06)" : "#f3f4f6",
        border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #e5e7eb",
        color:   dark ? "rgba(255,255,255,0.55)" : "#6b7280",
      }}
    >
      {dark
        ? <Sun  size={14} strokeWidth={1.8} />
        : <Moon size={14} strokeWidth={1.8} />}
      {!compact && (
        <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
      )}
    </button>
  );
}
