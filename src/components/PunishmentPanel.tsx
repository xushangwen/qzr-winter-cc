"use client";

import { motion } from "framer-motion";
import { PUNISHMENTS, WEEKLY_PASS_THRESHOLD } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";

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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="card-minimal p-5"
    >
      {/* 标题 */}
      <div className="mb-3 flex items-center gap-2">
        <i className={`ri-alarm-warning-line text-sm ${isTriggered ? "text-[var(--danger)]" : "text-[var(--muted-foreground)]"}`} />
        <h2 className="text-sm font-semibold text-[var(--foreground)]">惩罚机制</h2>
      </div>

      <p className="mb-3 text-xs text-[var(--muted-foreground)]">
        周完成率低于 {WEEKLY_PASS_THRESHOLD}% 将触发惩罚
        {isPending && "（本周进行中）"}
      </p>

      {/* 完成率指示器 */}
      <div
        className={`mb-4 rounded-lg border p-3 ${
          isTriggered
            ? "border-[var(--danger-subtle)] bg-[var(--danger-subtle)]/30"
            : isPending
            ? "border-[var(--border-light)] bg-[var(--secondary)]"
            : "border-[var(--success-subtle)] bg-[var(--success-subtle)]/30"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--muted-foreground)]">本周完成率</span>
          <span
            className={`num text-lg font-semibold ${
              isTriggered
                ? "text-[var(--danger)]"
                : isPending
                ? "text-[var(--muted-foreground)]"
                : "text-[var(--success)]"
            }`}
          >
            {weekRate}%
          </span>
        </div>
        <Progress value={weekRate} className="h-1 bg-[var(--border)]" />
      </div>

      {/* 惩罚项列表 */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {PUNISHMENTS.map((punishment) => (
          <div
            key={punishment.id}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs ${
              isTriggered
                ? "bg-[var(--danger-subtle)]/30 text-[var(--danger)]"
                : "bg-[var(--secondary)] text-[var(--muted-foreground)]"
            }`}
          >
            <i className={`${punishment.icon} text-sm`} />
            <span>{punishment.name}</span>
            {isTriggered && (
              <span className="ml-auto rounded bg-[var(--danger)] px-1.5 py-0.5 text-[10px] text-white">
                触发
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
