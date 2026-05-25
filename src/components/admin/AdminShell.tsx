"use client";

import { useAdminTheme } from "./AdminThemeProvider";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { dark } = useAdminTheme();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        background: dark ? "#0f0f13" : "#f5f6fa",
        colorScheme: dark ? "dark" : "light",
        transition: "background 0.3s ease",
      }}
    >
      {children}
    </div>
  );
}
