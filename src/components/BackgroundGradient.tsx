"use client";

export default function BackgroundGradient() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Blob 1 — blue, top-left */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "rgba(59, 130, 246, 0.18)",
          filter: "blur(100px)",
          top: -200,
          left: -200,
          willChange: "transform",
          animation: "blob-float1 25s infinite alternate ease-in-out",
        }}
      />

      {/* Blob 2 — purple, top-right */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(139, 92, 246, 0.15)",
          filter: "blur(100px)",
          top: 80,
          right: -150,
          willChange: "transform",
          animation: "blob-float2 30s infinite alternate ease-in-out",
        }}
      />

      {/* Blob 3 — teal/green, bottom-center */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "rgba(16, 185, 129, 0.10)",
          filter: "blur(120px)",
          bottom: -200,
          left: "30%",
          willChange: "transform",
          animation: "blob-float3 35s infinite alternate ease-in-out",
        }}
      />

      {/* Blob 4 — amber, center */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(251, 191, 36, 0.08)",
          filter: "blur(90px)",
          top: "40%",
          left: "40%",
          willChange: "transform",
          animation: "blob-float4 28s infinite alternate ease-in-out",
        }}
      />

      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
