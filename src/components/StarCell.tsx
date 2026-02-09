"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    status === "none" ? "未完成，点击标记为金星" :
    status === "gold" ? "金星(2分)，点击切换为粉花" :
    "粉花(1分)，点击取消";

  return (
    <button
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`
        relative w-full aspect-square rounded-lg md:rounded-xl flex items-center justify-center
        transition-all duration-200 cursor-pointer group active:scale-90
        ${isToday ? "ring-2 ring-primary-light/50" : ""}
        ${status === "none"
          ? "bg-surface-light/50 hover:bg-surface-lighter/70"
          : status === "gold"
          ? "bg-accent-gold/10"
          : "bg-accent-pink/10"
        }
      `}
    >
      <AnimatePresence mode="wait">
        {status === "none" ? (
          <motion.div
            key={`empty-${animateKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-surface-lighter group-hover:text-border transition-colors"
          >
            <i className="ri-add-line text-lg md:text-xl" />
          </motion.div>
        ) : status === "gold" ? (
          <motion.div
            key={`gold-${animateKey}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
            className="relative"
          >
            <span className="text-2xl md:text-3xl">⭐</span>
            {/* 闪光粒子 */}
            <motion.div
              initial={{ opacity: 1, scale: 0 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-2 h-2 rounded-full bg-accent-gold/60" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key={`pink-${animateKey}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
            className="relative"
          >
            <span className="text-2xl md:text-3xl">🌸</span>
            <motion.div
              initial={{ opacity: 1, scale: 0 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-2 h-2 rounded-full bg-accent-pink/60" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
