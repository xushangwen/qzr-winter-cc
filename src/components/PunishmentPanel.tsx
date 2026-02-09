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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.12 }}
      className={`panel-shadow rounded-3xl border bg-surface/94 p-4 md:p-5 ${
        isTriggered ? "border-accent-red/35" : "border-border/75"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <i className={`ri-alarm-warning-line text-lg ${isTriggered ? "text-accent-red" : "text-foreground/56"}`} />
        <h2 className="text-base font-semibold text-foreground md:text-lg">惩罚机制</h2>
      </div>

      <p className="mb-3 text-sm text-foreground/70">
        周完成率低于 {WEEKLY_PASS_THRESHOLD}% 将触发惩罚
        {isPending ? "（本周进行中，周末统一判定）" : ""}
      </p>

      <div
        className={`mb-4 rounded-2xl border p-3 ${
          isTriggered
            ? "border-accent-red/25 bg-accent-red/8"
            : isPending
            ? "border-border/70 bg-surface-light/60"
            : "border-accent-green/25 bg-accent-green/10"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground/66">本周完成率</span>
          <span
            className={`num text-2xl font-semibold ${
              isTriggered
                ? "text-accent-red"
                : isPending
                ? "text-foreground/45"
                : "text-accent-green"
            }`}
          >
            {weekRate}%
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-lighter/90">
          <motion.div
            className={`h-full rounded-full ${
              isTriggered
                ? "bg-accent-red"
                : isPending
                ? "bg-surface-lighter"
                : "bg-gradient-to-r from-accent-green to-primary"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${weekRate}%` }}
            transition={{ duration: 0.7 }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {PUNISHMENTS.map((punishment) => (
          <div
            key={punishment.id}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm ${
              isTriggered
                ? "bg-accent-red/10 text-accent-red"
                : "bg-surface-light/70 text-foreground/66"
            }`}
          >
            <i className={`${punishment.icon} text-base`} />
            <span>{punishment.name}</span>
            {isTriggered && (
              <span className="ml-auto rounded-full bg-accent-red/18 px-2 py-0.5 text-xs font-medium">
                触发
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
