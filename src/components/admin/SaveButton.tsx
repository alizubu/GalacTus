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
      const { toast } = await import("react-hot-toast");
      toast.error("Save failed. Please try again.");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={state !== "idle"}
      className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold
                 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed
                 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: state === "saved"
          ? "linear-gradient(135deg, #22c55e, #16a34a)"
          : "linear-gradient(135deg, #111827, #1f2937)",
        color: "white",
        boxShadow: state === "saved"
          ? "0 8px 24px rgba(34,197,94,0.25), 0 2px 8px rgba(34,197,94,0.15)"
          : "0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {state === "saving" && <Loader2 size={15} className="animate-spin" />}
      {state === "saved" && <Check size={15} />}
      {state === "idle" && <Save size={15} />}
      {state === "saving" ? "Saving..." : state === "saved" ? "Saved!" : label}
    </button>
  );
}
