"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";

// BubbleBackground uses useLayoutEffect + ResizeObserver — must be client-only
const BubbleBackground = dynamic(
  () => import("@/components/animate-ui/backgrounds/bubble").then((m) => m.BubbleBackground),
  { ssr: false, loading: () => null }
);

// Exact same colors as the portfolio dark mode background
const BLOB_COLORS = {
  first:  "99,102,241",   // indigo
  second: "168,85,247",   // purple
  third:  "34,211,238",   // cyan
  fourth: "59,130,246",   // blue
  fifth:  "236,72,153",   // pink
  sixth:  "16,185,129",   // emerald
};

// ── Gradient SVG spinner ────────────────────────────────────────────────────
function GradientSpinner({ size = 56 }: { size?: number }) {
  const r = size / 2 - 4;
  const circ = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className="animate-spin"
      style={{ transformOrigin: "center" }}
    >
      <defs>
        <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#6366f1" />
          <stop offset="50%"  stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      {/* track */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="3"
      />
      {/* gradient arc — ~70% of circumference */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="url(#sg)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${circ * 0.7} ${circ * 0.3}`}
        strokeDashoffset={circ * 0.25}
      />
    </svg>
  );
}

// Small spinner for inside the button
function ButtonSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      className="animate-spin shrink-0" style={{ transformOrigin: "center" }}>
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2"
        strokeLinecap="round" strokeDasharray="22 16" />
    </svg>
  );
}

// ── Dot-texture overlay (identical pattern to portfolio site) ───────────────
function DotTexture() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        opacity: 0.45,
        zIndex: 2,
      }}
    />
  );
}

// ── Blob-only background for loading overlay (no heavy BubbleBackground) ───
function LoadingBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute rounded-full" style={{
        width: 640, height: 640,
        background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 65%)",
        top: "-18%", left: "-18%",
        animation: "blob-float1 20s infinite alternate ease-in-out",
      }} />
      <div className="absolute rounded-full" style={{
        width: 520, height: 520,
        background: "radial-gradient(circle, rgba(168,85,247,0.16) 0%, transparent 65%)",
        bottom: "-12%", right: "-12%",
        animation: "blob-float2 25s infinite alternate ease-in-out",
      }} />
      <div className="absolute rounded-full" style={{
        width: 380, height: 380,
        background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 65%)",
        top: "35%", right: "15%",
        animation: "blob-float3 30s infinite alternate ease-in-out",
      }} />
      <div className="absolute rounded-full" style={{
        width: 300, height: 300,
        background: "radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 65%)",
        bottom: "20%", left: "10%",
        animation: "blob-float4 28s infinite alternate ease-in-out",
      }} />
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      // Show loading overlay, then navigate
      setShowLoading(true);
      router.push("/admin");
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    color: "rgba(255,255,255,0.92)",
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.border = "1px solid rgba(139,92,246,0.6)";
    e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.12), 0 0 18px rgba(99,102,241,0.08)";
    e.target.style.background = "rgba(255,255,255,0.06)";
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.border = "1px solid rgba(255,255,255,0.09)";
    e.target.style.boxShadow = "none";
    e.target.style.background = "rgba(255,255,255,0.04)";
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >

      {/* ── Layer 0: Bubble background (same as portfolio dark mode) ── */}
      <BubbleBackground
        interactive
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #080810 0%, #06060e 50%, #080810 100%)",
          opacity: 0.55,
          zIndex: 0,
        }}
        colors={BLOB_COLORS}
        transition={{ stiffness: 80, damping: 25 }}
      />

      {/* ── Layer 1: Dot texture (same as portfolio) ── */}
      <DotTexture />

      {/* ── Layer 2: Login card ── */}
      <div
        className="relative min-h-screen flex items-center justify-center p-4 sm:p-6"
        style={{ zIndex: 3 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
          style={{ maxWidth: 420 }}
        >
          {/* Glass card */}
          <div
            className="relative rounded-[20px] p-6 sm:px-10 sm:py-12"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: [
                "0 32px 64px rgba(0,0,0,0.45)",
                "0 8px 24px rgba(0,0,0,0.3)",
                "inset 0 1px 0 rgba(255,255,255,0.08)",
              ].join(", "),
            }}
          >
            {/* Shimmer accent line along top edge of card */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-px rounded-full"
              style={{
                width: "65%",
                background:
                  "linear-gradient(90deg, transparent, rgba(139,92,246,0.7), rgba(236,72,153,0.5), transparent)",
              }}
            />

            {/* ── Avatar ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center mb-6"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(99,102,241,0.22) 0%, rgba(236,72,153,0.16) 100%)",
                  border: "1px solid rgba(139,92,246,0.38)",
                  boxShadow: [
                    "0 0 0 5px rgba(139,92,246,0.1)",
                    "0 0 0 10px rgba(139,92,246,0.04)",
                    "0 0 28px rgba(99,102,241,0.22)",
                  ].join(", "),
                }}
              >
                <span
                  className="text-[18px] font-black tracking-tight select-none"
                  style={{ color: "rgba(255,255,255,0.95)" }}
                >
                  SD
                </span>
              </div>
            </motion.div>

            {/* ── Title ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45 }}
              className="text-center mb-8"
            >
              <h1
                className="text-[26px] font-bold tracking-tight leading-tight"
                style={{ color: "rgba(255,255,255,0.95)" }}
              >
                Welcome Back
              </h1>
              <p
                className="text-[13px] mt-1.5"
                style={{ color: "rgba(255,255,255,0.36)" }}
              >
                Portfolio Admin Panel
              </p>
            </motion.div>

            {/* ── Form ── */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.45 }}
            >
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  className="block text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: "rgba(255,255,255,0.28)" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-white/20"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  className="block text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: "rgba(255,255,255,0.28)" }}
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
                    className="w-full rounded-xl px-4 py-3.5 pr-11 text-sm outline-none transition-all duration-200 placeholder:text-white/20"
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
                    style={{ color: "rgba(255,255,255,0.28)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(139,92,246,0.9)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.28)";
                    }}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -4 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm"
                      style={{
                        background: "rgba(239,68,68,0.07)",
                        border: "1px solid rgba(239,68,68,0.22)",
                        color: "#f87171",
                      }}
                    >
                      <AlertCircle size={14} className="shrink-0" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? {} : { scale: 1.02, boxShadow: "0 6px 32px rgba(99,102,241,0.5), 0 0 60px rgba(139,92,246,0.15)" }}
                whileTap={loading ? {} : { scale: 0.98 }}
                className="w-full rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2.5 mt-1"
                style={{
                  background: loading
                    ? "rgba(99,102,241,0.35)"
                    : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 45%, #ec4899 100%)",
                  color: "white",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 24px rgba(99,102,241,0.42), 0 0 48px rgba(139,92,246,0.08)",
                  transition: "box-shadow 0.3s ease",
                  letterSpacing: "0.01em",
                }}
              >
                {loading ? (
                  <>
                    <ButtonSpinner />
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </motion.form>

            {/* Footer note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-[11px] mt-6 tracking-wide"
              style={{ color: "rgba(255,255,255,0.15)" }}
            >
              Restricted access · Authorized personnel only
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* ── Post-login loading overlay ── */}
      <AnimatePresence>
        {showLoading && (
          <motion.div
            key="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 flex flex-col items-center justify-center"
            style={{ background: "#0a0a0f", zIndex: 100 }}
          >
            {/* Blobs — same visual as main login bg */}
            <LoadingBlobs />

            {/* Dot texture */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                opacity: 0.45,
              }}
            />

            {/* Spinner + text */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center gap-5"
              style={{ zIndex: 1 }}
            >
              {/* Outer glow ring */}
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
                    transform: "scale(1.8)",
                    filter: "blur(12px)",
                  }}
                />
                <GradientSpinner size={56} />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="text-[13px] tracking-wide"
                style={{ color: "rgba(255,255,255,0.38)" }}
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
