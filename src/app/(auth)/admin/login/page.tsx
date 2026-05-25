"use client";

import { useState, useEffect, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, AlertCircle, Sun, Moon } from "lucide-react";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

// ── Light Rays — pure CSS, no extra deps ───────────────────────────────────
function LightRays({ dark }: { dark: boolean }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Primary center ray */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "70%",
          background: dark
            ? "conic-gradient(from 270deg at 50% 0%, transparent 10%, rgba(139,92,246,0.12) 30%, rgba(168,85,247,0.09) 50%, rgba(139,92,246,0.12) 70%, transparent 90%)"
            : "conic-gradient(from 270deg at 50% 0%, transparent 10%, rgba(255,255,255,0.9) 30%, rgba(240,240,255,0.7) 50%, rgba(255,255,255,0.9) 70%, transparent 90%)",
          filter: dark ? "blur(32px)" : "blur(28px)",
        }}
      />
      {/* Secondary soft glow at top */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "45%",
          background: dark
            ? "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.18) 0%, transparent 70%)"
            : "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(220,215,255,0.55) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
}

// ── Gradient spinner for loading overlay ───────────────────────────────────
function GradientSpinner() {
  const size = 48, r = 20, circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none"
      className="animate-spin" style={{ transformOrigin: "center" }}>
      <defs>
        <linearGradient id="sp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r={r} stroke="rgba(139,92,246,0.15)" strokeWidth="3" />
      <circle cx="24" cy="24" r={r} stroke="url(#sp)" strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${circ * 0.72} ${circ * 0.28}`}
        strokeDashoffset={circ * 0.2} />
    </svg>
  );
}

// ── Button spinner ──────────────────────────────────────────────────────────
function BtnSpinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      className="animate-spin shrink-0" style={{ transformOrigin: "center" }}>
      <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="2"
        strokeLinecap="round" strokeDasharray="18 13" />
    </svg>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function AdminLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [overlay,  setOverlay]  = useState(false);
  const [dark,     setDark]     = useState(false);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setDark(localStorage.getItem("admin-theme") === "dark");
    } catch {}
  }, []);

  // ── Theme toggle with View Transition circle-expand ──────────────────────
  const toggleTheme = useCallback((e: React.MouseEvent) => {
    const x = e.clientX, y = e.clientY;
    const next = !dark;

    const doChange = () => {
      setDark(next);
      try { localStorage.setItem("admin-theme", next ? "dark" : "light"); } catch {}
    };

    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document
    ) {
      document.documentElement.style.setProperty("--vt-x", `${x}px`);
      document.documentElement.style.setProperty("--vt-y", `${y}px`);
      (document as Document & { startViewTransition: (cb: () => void) => void })
        .startViewTransition(doChange);
    } else {
      doChange();
    }
  }, [dark]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      setOverlay(true);
      router.push("/admin");
    }
  };

  // ── Theme-derived tokens ─────────────────────────────────────────────────
  const pageBg         = dark ? "#0f0f13" : "#ffffff";
  const gridColor      = dark ? "rgb(99,102,241)"  : "rgb(99,102,241)";
  const gridMaxOpacity = dark ? 0.2 : 0.09;

  const cardBg     = dark ? "#1a1b23" : "#ffffff";
  const cardBorder = dark ? "#2d2f3a" : "#e5e7eb";
  const cardShadow = dark
    ? "0 20px 40px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.3)"
    : "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)";

  const titleColor    = dark ? "#f9fafb" : "#111827";
  const subtitleColor = dark ? "#9ca3af" : "#6b7280";
  const labelColor    = dark ? "rgba(255,255,255,0.4)" : "#6b7280";
  const footerColor   = dark ? "rgba(255,255,255,0.2)" : "#d1d5db";

  const inputBg     = dark ? "rgba(255,255,255,0.04)" : "#f9fafb";
  const inputBorder = dark ? "rgba(255,255,255,0.09)" : "#e5e7eb";
  const inputColor  = dark ? "rgba(255,255,255,0.9)"  : "#111827";
  const inputPh     = dark ? "placeholder:text-white/20" : "placeholder:text-gray-400";
  const eyeColor    = dark ? "rgba(255,255,255,0.28)" : "#9ca3af";

  const toggleBg     = dark ? "rgba(255,255,255,0.06)" : "#f3f4f6";
  const toggleBorder = dark ? "rgba(255,255,255,0.10)" : "#e5e7eb";
  const toggleColor  = dark ? "rgba(255,255,255,0.55)" : "#6b7280";

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#8b5cf6";
    e.target.style.boxShadow   = "0 0 0 3px rgba(139,92,246,0.12)";
    e.target.style.background  = dark ? "rgba(255,255,255,0.07)" : "#ffffff";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = inputBorder;
    e.target.style.boxShadow   = "none";
    e.target.style.background  = inputBg;
  };

  if (!mounted) return null;

  return (
    <div
      className="relative min-h-screen overflow-hidden transition-colors duration-300"
      style={{ background: pageBg }}
    >
      {/* ── Layer 0: FlickeringGrid background ── */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <FlickeringGrid
          className="w-full h-full"
          squareSize={4}
          gridGap={6}
          flickerChance={0.12}
          color={gridColor}
          maxOpacity={gridMaxOpacity}
        />
      </div>

      {/* ── Layer 1: Light Rays behind the card ── */}
      <LightRays dark={dark} />

      {/* ── Theme toggle — top right (fixed) ── */}
      <div className="fixed top-4 right-4 z-30">
        <button
          onClick={toggleTheme}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium
                     transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
          style={{
            background: toggleBg,
            border:     `1px solid ${toggleBorder}`,
            color:      toggleColor,
          }}
          title={dark ? "Switch to Light" : "Switch to Dark"}
        >
          {dark
            ? <Sun  size={14} strokeWidth={1.8} />
            : <Moon size={14} strokeWidth={1.8} />}
          <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
        </button>
      </div>

      {/* ── Layer 2: Centered login card ── */}
      <div
        className="relative min-h-screen flex items-center justify-center px-4 py-16"
        style={{ zIndex: 2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
          style={{ maxWidth: 420 }}
        >
          <div
            className="rounded-2xl p-8 sm:p-10"
            style={{
              background:   cardBg,
              border:       `1px solid ${cardBorder}`,
              boxShadow:    cardShadow,
              borderRadius: "16px",
            }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1
                className="text-[26px] font-bold tracking-tight leading-tight"
                style={{ color: titleColor }}
              >
                Welcome back
              </h1>
              <p className="text-[14px] mt-1.5" style={{ color: subtitleColor }}>
                Sign in to your admin panel
              </p>
            </div>

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
                  className={`w-full rounded-lg px-4 py-3 text-[14px] outline-none transition-all duration-200 ${inputPh}`}
                  style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputColor }}
                  onFocus={onFocus}
                  onBlur={onBlur}
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
                    className={`w-full rounded-lg px-4 py-3 pr-11 text-[14px] outline-none transition-all duration-200 ${inputPh}`}
                    style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputColor }}
                    onFocus={onFocus}
                    onBlur={onBlur}
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
                      className="flex items-center gap-2.5 rounded-lg px-4 py-3 text-[13px]"
                      style={{
                        background:  "rgba(239,68,68,0.08)",
                        border:      "1px solid rgba(239,68,68,0.2)",
                        color:       "#ef4444",
                      }}
                    >
                      <AlertCircle size={14} className="shrink-0" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit — shimmer button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? {} : { scale: 1.015 }}
                whileTap={loading ? {} : { scale: 0.985 }}
                className="login-shimmer-btn w-full rounded-lg py-3 text-[14px] font-semibold
                           flex items-center justify-center gap-2 mt-1 select-none"
                style={{
                  background: loading
                    ? "rgba(139,92,246,0.4)"
                    : "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%)",
                  color:     "white",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 18px rgba(139,92,246,0.38)",
                  letterSpacing: "0.01em",
                  transition: "box-shadow 0.25s ease",
                }}
              >
                {loading ? <><BtnSpinner />Signing in...</> : "Sign In"}
              </motion.button>
            </form>

            {/* Footer */}
            <p
              className="text-center text-[11px] mt-7 tracking-wide"
              style={{ color: footerColor }}
            >
              Restricted access · Authorized personnel only
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Post-login loading overlay ── */}
      <AnimatePresence>
        {overlay && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center"
            style={{ background: dark ? "#0f0f13" : "#f5f6fa", zIndex: 100 }}
          >
            {/* FlickeringGrid in overlay too */}
            <div className="absolute inset-0">
              <FlickeringGrid
                className="w-full h-full"
                squareSize={4}
                gridGap={6}
                flickerChance={0.12}
                color={gridColor}
                maxOpacity={gridMaxOpacity}
              />
            </div>
            <LightRays dark={dark} />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col items-center gap-4"
            >
              <GradientSpinner />
              <p className="text-[13px] tracking-wide" style={{ color: subtitleColor }}>
                Loading dashboard...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
