"use client";

import { motion } from "framer-motion";
import { STAR_POINTS, TASKS } from "@/lib/constants";
import { AppData, CheckStatus } from "@/lib/types";
import GlowCard from "./ui/GlowCard";
import ProgressRing from "./ui/ProgressRing";

interface StatsPanelProps {
  data: AppData;
  weekDates: string[];
  weekStars: number;
  weekRate: number;
}

export default function StatsPanel({
  data,
  weekDates,
  weekStars,
  weekRate,
}: StatsPanelProps) {
  /* 每个任务的本周统计 */
  const taskStats = TASKS.map((task) => {
    let goldCount = 0;
    let pinkCount = 0;

    weekDates.forEach((date) => {
      const status: CheckStatus = data.records[date]?.[task.id] || "none";
      if (status === "gold") goldCount++;
      if (status === "pink") pinkCount++;
    });

    return {
      ...task,
      goldCount,
      pinkCount,
      totalCount: goldCount + pinkCount,
      rate: Math.round(((goldCount + pinkCount) / 7) * 100),
    };
  });

  const sortedStats = [...taskStats].sort((a, b) => b.rate - a.rate);

  /* 每日星星分布 */
  const dailyStars = weekDates.map((date) => {
    let stars = 0;
    for (const taskId in data.records[date] || {}) {
      stars += STAR_POINTS[data.records[date][taskId]];
    }
    return stars;
  });
  const maxDailyStars = Math.max(...dailyStars, 1);

  return (
    <GlowCard delay={0.08} className="p-4 md:p-5">
      <div className="mb-4 flex items-center gap-2">
        <i className="ri-bar-chart-2-line text-lg text-primary" />
        <h2 className="text-base font-semibold text-white md:text-lg">本周统计</h2>
      </div>

      {/* 圆形进度环 + 数字卡片 */}
      <div className="mb-5 flex items-center gap-4">
        <ProgressRing
          progress={weekRate}
          size={90}
          strokeWidth={7}
          colors={weekRate >= 80 ? ["#10b981", "#06b6d4"] : weekRate >= 50 ? ["#f59e0b", "#8b5cf6"] : ["#ef4444", "#f59e0b"]}
        >
          <span className={`num text-lg font-bold ${weekRate >= 80 ? "text-accent-green" : weekRate >= 50 ? "text-accent-gold" : "text-accent-red"}`}>
            {weekRate}%
          </span>
        </ProgressRing>

        <div className="grid flex-1 grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-center">
            <p className="num text-2xl font-semibold text-accent-gold">{weekStars}</p>
            <p className="mt-1 text-xs text-white/40">本周星星</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-center">
            <p className="num text-2xl font-semibold text-primary-light">
              {taskStats.reduce((sum, task) => sum + task.totalCount, 0)}
            </p>
            <p className="mt-1 text-xs text-white/40">打卡次数</p>
          </div>
        </div>
      </div>

      {/* 渐变柱状图 */}
      <div className="mb-5">
        <p className="mb-2 text-sm font-medium text-white/55">每日星星分布</p>
        <div className="flex h-[94px] items-end gap-1.5">
          {dailyStars.map((stars, index) => (
            <div key={weekDates[index]} className="flex flex-1 flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-t-md bg-gradient-to-t from-primary to-accent-cyan"
                initial={{ height: 0 }}
                animate={{ height: `${(stars / maxDailyStars) * 68}px` }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                style={{ minHeight: stars > 0 ? "6px" : "0" }}
              />
              <span className="text-xs text-white/35">{["一", "二", "三", "四", "五", "六", "日"][index]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 任务排行 - 发光进度条 */}
      <div>
        <p className="mb-2 text-sm font-medium text-white/55">任务完成排行</p>
        <div className="space-y-2.5">
          {sortedStats.map((task, index) => (
            <div key={task.id} className="flex items-center gap-2 text-sm">
              <span className="num w-5 text-right text-xs text-white/35">{index + 1}</span>
              <i className={`${task.icon} text-sm text-white/45`} />
              <span className="w-24 truncate text-white/70">{task.name}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className={`h-full rounded-full ${
                    task.rate >= 80
                      ? "bg-gradient-to-r from-accent-green to-accent-cyan"
                      : task.rate >= 50
                      ? "bg-gradient-to-r from-accent-gold to-primary"
                      : task.rate > 0
                      ? "bg-gradient-to-r from-accent-red to-accent-gold"
                      : "bg-white/[0.04]"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${task.rate}%` }}
                  transition={{ duration: 0.55, delay: index * 0.04 }}
                />
              </div>
              <div className="num flex min-w-[68px] items-center justify-end gap-1 text-xs md:text-sm">
                <span className="text-accent-gold">⭐{task.goldCount}</span>
                <span className="text-accent-pink">🌸{task.pinkCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlowCard>
  );
}
