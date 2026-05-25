"use client";

/**
 * AdminThemeProvider
 * Provides dark/light theme state to all admin pages.
 * Handles persistence (localStorage) and the View Transition
 * circle-expand animation when toggling.
 *
 * Usage:
 *   <AdminThemeProvider>…children…</AdminThemeProvider>
 * Inside children, import useAdminTheme() to get { dark, toggleTheme }.
 */

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type ThemeCtx = { dark: boolean; toggleTheme: (e: React.MouseEvent) => void };

const Ctx = createContext<ThemeCtx>({ dark: false, toggleTheme: () => {} });

export function useAdminTheme() {
  return useContext(Ctx);
}

export default function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("admin-theme");
      if (saved === "dark") setDark(true);
    } catch {}
  }, []);

  // Apply/remove the "admin-dark" class on the html element
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (dark) {
      root.classList.add("admin-dark");
    } else {
      root.classList.remove("admin-dark");
    }
    try { localStorage.setItem("admin-theme", dark ? "dark" : "light"); } catch {}
  }, [dark, mounted]);

  const toggleTheme = useCallback((e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;

    // Use View Transition API if available
    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      typeof (document as Document & { startViewTransition?: (cb: () => void) => void }).startViewTransition === "function"
    ) {
      // Pass click coordinates to CSS via custom properties
      document.documentElement.style.setProperty("--vt-x", `${x}px`);
      document.documentElement.style.setProperty("--vt-y", `${y}px`);

      (document as Document & { startViewTransition: (cb: () => void) => void })
        .startViewTransition(() => {
          setDark((d) => !d);
        });
    } else {
      // Fallback — no animation
      setDark((d) => !d);
    }
  }, []);

  // Avoid flash of wrong theme on mount
  if (!mounted) {
    return (
      <div style={{ visibility: "hidden", minHeight: "100vh" }} />
    );
  }

  return (
    <Ctx.Provider value={{ dark, toggleTheme }}>
      {children}
    </Ctx.Provider>
  );
}
