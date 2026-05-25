"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, AlertCircle, Sun, Moon } from "lucide-react";

// ── Gradient SVG spinner (for loading overlay) ──────────────────────────────
function GradientSpinner({ size = 52 }: { size?: number }) {
  const r = size / 2 - 4;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none"
      className="animate-spin" style={{ transformOrigin: "center" }}>
      <defs>
        <linearGradient id="sg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r} stroke="url(#sg2)" strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${circ * 0.7} ${circ * 0.3}`}
        strokeDashoffset={circ * 0.25} />
    </svg>
  );
}

// Small spinner inside submit button
function ButtonSpinner() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
      className="animate-spin shrink-0" style={{ transformOrigin: "center" }}>
      <circle cx="7.5" cy="7.5" r="5.5" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <circle cx="7.5" cy="7.5" r="5.5" stroke="white" strokeWidth="2"
        strokeLinecap="round" strokeDasharray="20 15" />
    </svg>
  );
}

// ── Left-panel blobs — purple + pink only ──────────────────────────────────
function LeftPanelBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute rounded-full" style={{
        width: 480, height: 480,
        background: "radial-gradient(circle, rgba(139,92,246,0.38) 0%, transparent 65%)",
        top: "-15%", left: "-20%",
        animation: "blob-float1 22s infinite alternate ease-in-out",
      }} />
      <div className="absolute rounded-full" style={{
        width: 360, height: 360,
        background: "radial-gradient(circle, rgba(236,72,153,0.28) 0%, transparent 65%)",
        bottom: "-10%", right: "-15%",
        animation: "blob-float2 28s infinite alternate ease-in-out",
      }} />
      <div className="absolute rounded-full" style={{
        width: 260, height: 260,
        background: "radial-gradient(circle, rgba(168,85,247,0.22) 0%, transparent 65%)",
        top: "45%", right: "5%",
        animation: "blob-float3 32s infinite alternate ease-in-out",
      }} />
    </div>
  );
}

// ── Loading overlay blobs ───────────────────────────────────────────────────
function LoadingBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute rounded-full" style={{
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 65%)",
        top: "-15%", left: "-15%",
        animation: "blob-float1 20s infinite alternate ease-in-out",
      }} />
      <div className="absolute rounded-full" style={{
        width: 480, height: 480,
        background: "radial-gradient(circle, rgba(236,72,153,0.16) 0%, transparent 65%)",
        bottom: "-10%", right: "-10%",
        animation: "blob-float2 26s infinite alternate ease-in-out",
      }} />
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [dark, setDark]         = useState(false);

  // Persist theme preference in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("login-theme");
    if (saved === "dark") setDark(true);
  }, []);

  const toggleTheme = () => {
    setDark((d) => {
      localStorage.setItem("login-theme", d ? "light" : "dark");
      return !d;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      setShowOverlay(true);
      router.push("/admin");
    }
  };

  // ── Theme-derived values ──
  const rightBg  = dark ? "#13131a" : "#ffffff";
  const pageBg   = dark ? "#0c0c12" : "#f5f6fa";
  const inputBg  = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const inputBorder = dark ? "rgba(255,255,255,0.09)" : "#e5e7eb";
  const inputColor  = dark ? "rgba(255,255,255,0.9)"  : "#111827";
  const labelColor  = dark ? "rgba(255,255,255,0.35)" : "#6b7280";
  const titleColor  = dark ? "rgba(255,255,255,0.95)" : "#111827";
  const subtitleColor = dark ? "rgba(255,255,255,0.35)" : "#9ca3af";
  const footerColor   = dark ? "rgba(255,255,255,0.2)"  : "#d1d5db";
  const dividerColor  = dark ? "rgba(255,255,255,0.06)" : "#f3f4f6";
  const placeholderCls = dark ? "placeholder:text-white/18" : "placeholder:text-gray-400";
  const eyeColor    = dark ? "rgba(255,255,255,0.28)" : "#9ca3af";
  const toggleBg    = dark ? "rgba(255,255,255,0.07)" : "#f3f4f6";
  const toggleBorder = dark ? "rgba(255,255,255,0.10)" : "#e5e7eb";
  const toggleColor  = dark ? "rgba(255,255,255,0.55)" : "#6b7280";

  const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#8b5cf6";
    e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.12)";
    e.target.style.background = dark ? "rgba(255,255,255,0.07)" : "#fff";
  };
  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = inputBorder;
    e.target.style.boxShadow   = "none";
    e.target.style.background  = inputBg;
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden transition-colors duration-300"
      style={{ background: pageBg }}
    >
      {/* ── Theme toggle — top right ── */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: toggleBg,
            border: `1px solid ${toggleBorder}`,
            color: toggleColor,
          }}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
          <span className="hidden sm:inline text-[12px]">{dark ? "Light" : "Dark"}</span>
        </button>
      </div>

      {/* ── Main split layout ── */}
      <div className="flex min-h-screen">

        {/* ════ LEFT PANEL — always dark, blobs live here ════ */}
        <div
          className="hidden lg:flex lg:flex-col lg:w-[42%] xl:w-[40%] relative overflow-hidden"
          style={{ background: "#0f0f0f" }}
        >
          {/* Blobs — purple + pink only */}
          <LeftPanelBlobs />

          {/* Content — centered vertically */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-12 text-center">
            {/* Logo badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background: "rgba(255,255,255,1)",
                  boxShadow: [
                    "0 0 0 8px rgba(139,92,246,0.12)",
                    "0 0 0 16px rgba(139,92,246,0.05)",
                    "0 12px 32px rgba(0,0,0,0.35)",
                  ].join(", "),
                }}
              >
                <span className="text-[22px] font-black tracking-tight text-black select-none">SD</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                Portfolio Admin
              </h2>
              <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                Manage your content,<br />track messages, update everything.
              </p>
            </motion.div>

            {/* Decorative pill tags */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap gap-2 justify-center mt-10"
            >
              {["Projects", "Experience", "Gallery", "Messages", "Skills"].map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-3 py-1.5 rounded-full font-medium"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Subtle bottom line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "rgba(255,255,255,0.04)" }}
          />
        </div>

        {/* ════ RIGHT PANEL — form, theme-aware ════ */}
        <div
          className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative transition-colors duration-300"
          style={{ background: rightBg }}
        >
          {/* Mobile logo (shown only below lg) */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: "#0f0f0f" }}
            >
              <span className="text-white text-[13px] font-black tracking-tight select-none">SD</span>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: titleColor }}>Portfolio Admin</p>
              <p className="text-[11px]" style={{ color: subtitleColor }}>Sign in to continue</p>
            </div>
          </div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
            style={{ maxWidth: 400 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-[28px] font-bold tracking-tight" style={{ color: titleColor }}>
                Welcome back
              </h1>
              <p className="text-[13px] mt-1" style={{ color: subtitleColor }}>
                Sign in to your admin panel
              </p>
            </div>

            {/* Divider */}
            <div className="h-px mb-8" style={{ background: dividerColor }} />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  className="block text-[11px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: labelColor }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  autoComplete="email"
                  className={`w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200 ${placeholderCls}`}
                  style={{
                    background: inputBg,
                    border: `1px solid ${inputBorder}`,
                    color: inputColor,
                  }}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  className="block text-[11px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: labelColor }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    autoComplete="current-password"
                    className={`w-full rounded-lg px-4 py-3 pr-11 text-sm outline-none transition-all duration-200 ${placeholderCls}`}
                    style={{
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      color: inputColor,
                    }}
                    onFocus={onInputFocus}
                    onBlur={onInputBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
                    style={{ color: eyeColor }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#8b5cf6"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = eyeColor; }}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm"
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        color: "#ef4444",
                      }}
                    >
                      <AlertCircle size={14} className="shrink-0" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? {} : { scale: 1.015, boxShadow: "0 6px 28px rgba(139,92,246,0.45)" }}
                whileTap={loading ? {} : { scale: 0.985 }}
                className="w-full rounded-lg py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-shadow duration-200"
                style={{
                  background: loading
                    ? "rgba(139,92,246,0.4)"
                    : "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%)",
                  color: "white",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(139,92,246,0.35)",
                  letterSpacing: "0.01em",
                }}
              >
                {loading ? <><ButtonSpinner />Signing in...</> : "Sign In"}
              </motion.button>
            </form>

            {/* Footer */}
            <p
              className="text-center text-[11px] mt-8 tracking-wide"
              style={{ color: footerColor }}
            >
              Restricted access · Authorized personnel only
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Post-login loading overlay ── */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 flex items-center justify-center"
            style={{ background: "#0f0f0f", zIndex: 100 }}
          >
            <LoadingBlobs />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col items-center gap-5"
            >
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
                    transform: "scale(1.9)",
                    filter: "blur(14px)",
                  }}
                />
                <GradientSpinner size={52} />
              </div>
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.35 }}
                className="text-[13px] tracking-wide"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Loading dashboard...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
