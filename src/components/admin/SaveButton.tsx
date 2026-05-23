"use client";

import { useState } from "react";
import { Loader2, Check, Save } from "lucide-react";

interface Props {
  onSave: () => Promise<void>;
  label?: string;
}

export default function SaveButton({ onSave, label = "Save Changes" }: Props) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  const handleClick = async () => {
    setState("saving");
    try {
      await onSave();
      setState("saved");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("idle");
      alert("Save failed. Please try again.");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={state !== "idle"}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60"
      style={{
        background:
          state === "saved"
            ? "linear-gradient(135deg, #22c55e, #16a34a)"
            : "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
        color: "white",
        boxShadow:
          state === "saved"
            ? "0 4px 16px rgba(34,197,94,0.3)"
            : "0 4px 16px rgba(0,0,0,0.15)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {state === "saving" && <Loader2 size={14} className="animate-spin" />}
      {state === "saved" && <Check size={14} />}
      {state === "idle" && <Save size={14} />}
      {state === "saving" ? "Saving..." : state === "saved" ? "Saved!" : label}
    </button>
  );
}
