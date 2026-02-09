"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckStatus } from "@/lib/types";

interface StarCellProps {
  status: CheckStatus;
  onToggle: () => void;
  isToday: boolean;
}

/* 三态发光切换：空态(暗) → 金星(金色光晕) → 粉花(粉色光晕) */
export default function StarCell({ status, onToggle, isToday }: StarCellProps) {
  const [animateKey, setAnimateKey] = useState(0);

  const handleClick = () => {
    setAnimateKey((prev) => prev + 1);
    onToggle();
  };

  const ariaLabel =
    status === "none"
      ? "未完成，点击标记为金星"
      : status === "gold"
      ? "金星(2分)，点击切换为粉花"
      : "粉花(1分)，点击取消";

  return (
    <button
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`
        group relative flex min-h-[52px] w-full aspect-square cursor-pointer items-center justify-center rounded-xl border transition-all active:scale-[0.96]
        ${isToday ? "ring-2 ring-primary/40" : ""}
        ${
          status === "none"
            ? "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]"
            : status === "gold"
            ? "border-amber-400/25 bg-amber-400/[0.08] glow-gold"
            : "border-pink-400/25 bg-pink-400/[0.08] glow-pink"
        }
      `}
    >
      <AnimatePresence mode="wait">
        {status === "none" ? (
          <motion.div
            key={`empty-${animateKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white/20 transition-colors group-hover:text-white/40"
          >
            <i className="ri-add-line text-xl" />
          </motion.div>
        ) : status === "gold" ? (
          <motion.span
            key={`gold-${animateKey}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="text-2xl"
          >
            ⭐
          </motion.span>
        ) : (
          <motion.span
            key={`pink-${animateKey}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="text-2xl"
          >
            🌸
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
