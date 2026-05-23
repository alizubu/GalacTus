"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

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
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
        state === "saved"
          ? "bg-green-500 text-white"
          : "bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-60"
      }`}
    >
      {state === "saving" && <Loader2 size={14} className="animate-spin" />}
      {state === "saved" && <Check size={14} />}
      {state === "saving" ? "Saving..." : state === "saved" ? "Saved!" : label}
    </button>
  );
}
