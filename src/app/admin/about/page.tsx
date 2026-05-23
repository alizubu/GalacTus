"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import SaveButton from "@/components/admin/SaveButton";

// Load editor client-side only (SSR not supported)
const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 rounded-xl h-64 bg-gray-50 animate-pulse" />
  ),
});

export default function AboutAdminPage() {
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data) => {
        setBio(data.about_bio ?? "");
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ about_bio: bio }),
    });
    if (!res.ok) throw new Error("Save failed");
  };

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">About / Bio</h1>
        <p className="text-gray-500 text-sm mt-1">
          Use the toolbar to format your bio — bold, headings, lists, links and more.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-1">
        <RichTextEditor
          content={bio}
          onChange={setBio}
          placeholder="Write your bio here..."
        />
      </div>

      <SaveButton onSave={handleSave} />
    </div>
  );
}
