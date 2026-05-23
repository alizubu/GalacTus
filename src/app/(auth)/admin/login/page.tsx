"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  if (!mounted) return null;

  // Theme-aware values
  const bg = isDark
    ? "linear-gradient(135deg, #080810 0%, #06060e 100%)"
    : "linear-gradient(135deg, #f0f0ff 0%, #eef0ff 100%)";

  const cardBg = isDark
    ? "rgba(255,255,255,0.04)"
    : "rgba(255,255,255,0.75)";

  const cardBorder = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(99,102,241,0.15)";

  const cardShadow = isDark
    ? "0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)"
    : "0 8px 40px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.06)";

  const titleColor = isDark ? "rgba(255,255,255,0.95)" : "rgba(15,15,40,0.9)";
  const subtitleColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(80,80,120,0.6)";
  const labelColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(80,80,120,0.7)";
  const inputBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)";
  const inputBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(99,102,241,0.2)";
  const inputColor = isDark ? "rgba(255,255,255,0.9)" : "rgba(15,15,40,0.85)";
  const footerColor = isDark ? "rgba(255,255,255,0.18)" : "rgba(80,80,120,0.35)";
  const eyeColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(80,80,120,0.4)";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: bg }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{
          width: 500, height: 500,
          background: isDark
            ? "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          top: "-10%", left: "-10%",
          animation: "blob-float1 20s infinite alternate ease-in-out",
        }} />
        <div className="absolute rounded-full" style={{
          width: 400, height: 400,
          background: isDark
            ? "radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
          bottom: "-5%", right: "-5%",
          animation: "blob-float2 25s infinite alternate ease-in-out",
        }} />
        {!isDark && (
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-[400px]"
      >
        <div
          className="relative rounded-2xl p-8"
          style={{
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: cardShadow,
          }}
        >
          {/* Top glow line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px rounded-full" style={{
            width: "60%",
            background: isDark
              ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
              : "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)",
          }} />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.15))",
                border: "1px solid rgba(99,102,241,0.3)",
                boxShadow: "0 0 24px rgba(99,102,241,0.15)",
              }}>
                <ShieldCheck size={24} className="text-indigo-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: titleColor }}>
              Admin Access
            </h1>
            <p className="text-sm mt-1.5" style={{ color: subtitleColor }}>
              Shelvey Dias · Portfolio CMS
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest" style={{ color: labelColor }}>
                Email
              </label>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required autoComplete="email"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputColor }}
                onFocus={(e) => { e.target.style.border = "1px solid rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                onBlur={(e) => { e.target.style.border = `1px solid ${inputBorder}`; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest" style={{ color: labelColor }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••" required autoComplete="current-password"
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all duration-200"
                  style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputColor }}
                  onFocus={(e) => { e.target.style.border = "1px solid rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                  onBlur={(e) => { e.target.style.border = `1px solid ${inputBorder}`; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: eyeColor }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = isDark ? "rgba(255,255,255,0.7)" : "rgba(99,102,241,0.8)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = eyeColor; }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}
                >
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 mt-2 transition-all duration-200"
              style={{
                background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white",
                boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.3)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (<><Loader2 size={15} className="animate-spin" />Authenticating...</>) : "Sign In"}
            </motion.button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-center text-[11px] mt-6"
            style={{ color: footerColor }}
          >
            Restricted access · Authorized personnel only
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
