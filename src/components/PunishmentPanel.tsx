"use client";

import { motion } from "framer-motion";
import { PUNISHMENTS, WEEKLY_PASS_THRESHOLD } from "@/lib/constants";
import GlowCard from "./ui/GlowCard";

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
    <GlowCard delay={0.24} className={`p-4 md:p-5 ${isTriggered ? "glow-red" : ""}`}>
      <div className="mb-3 flex items-center gap-2">
        <i className={`ri-alarm-warning-line text-lg ${isTriggered ? "text-accent-red" : "text-white/40"}`} />
        <h2 className="text-base font-semibold text-white md:text-lg">惩罚机制</h2>
      </div>

      <p className="mb-3 text-sm text-white/45">
        周完成率低于 {WEEKLY_PASS_THRESHOLD}% 将触发惩罚
        {isPending ? "（本周进行中，周末统一判定）" : ""}
      </p>

      {/* 完成率指示器 */}
      <div
        className={`mb-4 rounded-2xl border p-3 ${
          isTriggered
            ? "border-accent-red/20 bg-accent-red/[0.06]"
            : isPending
            ? "border-white/[0.06] bg-white/[0.03]"
            : "border-accent-green/20 bg-accent-green/[0.06]"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/45">本周完成率</span>
          <span
            className={`num text-2xl font-semibold ${
              isTriggered
                ? "text-accent-red"
                : isPending
                ? "text-white/35"
                : "text-accent-green"
            }`}
          >
            {weekRate}%
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className={`h-full rounded-full ${
              isTriggered
                ? "bg-accent-red"
                : isPending
                ? "bg-white/[0.08]"
                : "bg-gradient-to-r from-accent-green to-accent-cyan"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${weekRate}%` }}
            transition={{ duration: 0.7 }}
          />
        </div>
      </div>

      {/* 惩罚项列表 - 横向排列（全宽时更好看） */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {PUNISHMENTS.map((punishment) => (
          <div
            key={punishment.id}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm ${
              isTriggered
                ? "bg-accent-red/[0.08] text-accent-red"
                : "bg-white/[0.03] text-white/50"
            }`}
          >
            <i className={`${punishment.icon} text-base`} />
            <span>{punishment.name}</span>
            {isTriggered && (
              <span className="ml-auto rounded-full bg-accent-red/15 px-2 py-0.5 text-xs font-medium">
                触发
              </span>
            )}
          </div>
        ))}
      </div>
    </GlowCard>
  );
}
