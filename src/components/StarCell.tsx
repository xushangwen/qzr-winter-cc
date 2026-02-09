"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckStatus } from "@/lib/types";

interface StarCellProps {
  status: CheckStatus;
  onToggle: () => void;
  isToday: boolean;
}

/* 极简三态切换 - 支持暗色模式 */
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
        group relative flex h-10 w-full cursor-pointer items-center justify-center rounded-md border transition-all duration-150 active:scale-95
        ${isToday ? "ring-1 ring-[var(--primary)]/30" : ""}
        ${
          status === "none"
            ? "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/40"
            : status === "gold"
            ? "border-[var(--primary)]/30 bg-[var(--primary-subtle)]"
            : "border-[#f472b6]/30 bg-[#fce7f3]"
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
            className="text-[var(--border)]"
          >
            <i className="ri-add-line text-base" />
          </motion.div>
        ) : status === "gold" ? (
          <motion.span
            key={`gold-${animateKey}`}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="text-base"
          >
            ⭐
          </motion.span>
        ) : (
          <motion.span
            key={`pink-${animateKey}`}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="text-base"
          >
            🌸
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
