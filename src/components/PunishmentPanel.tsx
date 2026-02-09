"use client";

import { motion } from "framer-motion";
import { PUNISHMENTS, WEEKLY_PASS_THRESHOLD } from "@/lib/constants";

interface PunishmentPanelProps {
  weekRate: number;
  isWeekFinished: boolean;
}

export default function PunishmentPanel({
  weekRate,
  isWeekFinished,
}: PunishmentPanelProps) {
  const isTriggered = isWeekFinished && weekRate < WEEKLY_PASS_THRESHOLD;
  const isPending = !isWeekFinished;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`
        bg-surface/80 backdrop-blur-xl rounded-2xl border p-4 md:p-5
        ${isTriggered ? "border-accent-red/40" : "border-border/50"}
      `}
    >
      <div className="flex items-center gap-2 mb-2.5 md:mb-3">
        <i
          className={`ri-alarm-warning-line text-base md:text-lg ${
            isTriggered ? "text-accent-red" : "text-foreground/40"
          }`}
        />
        <h2 className="text-sm md:text-base font-semibold text-foreground/90">惩罚机制</h2>
      </div>

      <p className="text-[11px] md:text-xs text-foreground/40 mb-2.5 md:mb-3">
        一周完成率低于 {WEEKLY_PASS_THRESHOLD}% 将触发惩罚
        {isPending ? "（本周进行中，周结束后判定）" : ""}
      </p>

      {/* 本周达标状态 */}
      <div
        className={`
          rounded-xl p-3 mb-3 border
          ${isTriggered
            ? "bg-accent-red/10 border-accent-red/20"
            : isPending
            ? "bg-surface-light/30 border-border/20"
            : weekRate === 0
            ? "bg-surface-light/30 border-border/20"
            : "bg-accent-green/10 border-accent-green/20"
          }
        `}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-foreground/50">本周完成率</span>
          <span
            className={`text-lg font-bold ${
              isTriggered
                ? "text-accent-red"
                : isPending
                ? "text-foreground/30"
                : weekRate === 0
                ? "text-foreground/30"
                : "text-accent-green"
            }`}
          >
            {weekRate}%
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-surface-lighter/50 mt-2 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              isTriggered
                ? "bg-accent-red"
                : isPending
                ? "bg-surface-lighter"
                : "bg-gradient-to-r from-accent-green to-accent-gold"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${weekRate}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      {/* 惩罚项列表 */}
      <div className="space-y-2">
        {PUNISHMENTS.map((punishment) => (
          <div
            key={punishment.id}
            className={`
              flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all
              ${isTriggered
                ? "bg-accent-red/10 text-accent-red"
                : "bg-surface-light/30 text-foreground/40"
              }
            `}
          >
            <i className={`${punishment.icon} text-base`} />
            <span className="text-sm">{punishment.name}</span>
            {isTriggered && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-auto text-[10px] bg-accent-red/20 px-1.5 py-0.5 rounded-full"
              >
                触发
              </motion.span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
