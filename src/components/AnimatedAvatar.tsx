"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

interface AnimatedAvatarProps {
  src: string;
  name: string;
  initials: string;
}

export default function AnimatedAvatar({ src, name, initials }: AnimatedAvatarProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.div
      className="relative shrink-0 size-24 sm:size-36"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.2,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Rotating ring — very subtle */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, rgba(99,102,241,0.35) 25%, transparent 50%, rgba(168,85,247,0.25) 75%, transparent 100%)",
          borderRadius: "50%",
          padding: "3px",
          opacity: 0.4,
        }}
        animate={
          prefersReducedMotion
            ? {}
            : { rotate: hovered ? 360 : 720 }
        }
        transition={
          prefersReducedMotion
            ? {}
            : {
                rotate: {
                  duration: hovered ? 3 : 8,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop",
                },
              }
        }
      />

      {/* Floating wrapper */}
      <motion.div
        className="relative size-full"
        animate={
          prefersReducedMotion
            ? {}
            : { y: [0, -8, 0] }
        }
        transition={
          prefersReducedMotion
            ? {}
            : {
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }
        }
        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
      >
        {/* Hover glow */}
        {hovered && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-[-4px] rounded-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />
        )}

        {/* Avatar image */}
        <div className="size-full rounded-full border-2 border-border shadow-xl ring-4 ring-muted overflow-hidden">
          {src && !imgErr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={name}
              className="w-full h-full object-cover"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-foreground font-bold text-xl">
              {initials}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
