"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** 是否使用渐变边框 */
  glow?: boolean;
}

export default function GlowCard({
  children,
  className = "",
  delay = 0,
  glow = false,
}: GlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`${glow ? "glass-card-glow" : "glass-card"} ${className}`}
    >
      {children}
    </motion.div>
  );
}
