"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckStatus } from "@/lib/types";

interface StarCellProps {
  status: CheckStatus;
  onToggle: () => void;
  isToday: boolean;
}

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
        group relative flex min-h-[50px] w-full aspect-square cursor-pointer items-center justify-center rounded-xl border transition-all active:scale-95
        ${isToday ? "ring-2 ring-primary/30" : ""}
        ${
          status === "none"
            ? "border-border/70 bg-surface-light/80 hover:bg-surface-lighter/75"
            : status === "gold"
            ? "border-accent-gold/35 bg-accent-gold/10"
            : "border-accent-pink/35 bg-accent-pink/10"
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
            className="text-foreground/35 transition-colors group-hover:text-foreground/48"
          >
            <i className="ri-add-line text-xl" />
          </motion.div>
        ) : status === "gold" ? (
          <motion.span
            key={`gold-${animateKey}`}
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="text-2xl"
          >
            ⭐
          </motion.span>
        ) : (
          <motion.span
            key={`pink-${animateKey}`}
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="text-2xl"
          >
            🌸
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
