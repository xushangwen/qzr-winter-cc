"use client";

import { motion } from "framer-motion";
import { STAR_POINTS, TASKS } from "@/lib/constants";
import { AppData, CheckStatus } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="card-minimal p-5"
    >
      {/* 标题 */}
      <div className="mb-4 flex items-center gap-2">
        <i className="ri-bar-chart-line text-sm text-[var(--primary)]" />
        <h2 className="text-sm font-semibold text-[var(--foreground)]">本周统计</h2>
      </div>

      {/* 圆形进度环 + 数字 */}
      <div className="mb-5 flex items-center gap-4">
        <ProgressRing
          progress={weekRate}
          size={72}
          strokeWidth={5}
          color="var(--primary)"
        >
          <span className="num text-base font-semibold text-[var(--foreground)]">
            {weekRate}%
          </span>
        </ProgressRing>

        <div className="grid flex-1 grid-cols-2 gap-3">
          <div className="rounded-lg bg-[var(--secondary)] p-3 text-center">
            <p className="num text-lg font-semibold text-[var(--foreground)]">{weekStars}</p>
            <p className="mt-0.5 text-[10px] text-[var(--muted-foreground)]">本周星星</p>
          </div>
          <div className="rounded-lg bg-[var(--secondary)] p-3 text-center">
            <p className="num text-lg font-semibold text-[var(--foreground)]">
              {taskStats.reduce((sum, task) => sum + task.totalCount, 0)}
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--muted-foreground)]">打卡次数</p>
          </div>
        </div>
      </div>

      {/* 每日星星分布 - 细线柱状图 */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-medium text-[var(--muted-foreground)]">每日星星</p>
        <div className="flex h-[60px] items-end gap-1">
          {dailyStars.map((stars, index) => (
            <div key={weekDates[index]} className="flex flex-1 flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-sm"
                style={{ backgroundColor: "var(--primary)" }}
                initial={{ height: 0 }}
                animate={{ height: `${(stars / maxDailyStars) * 44}px` }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
              />
              <span className="text-[10px] text-[var(--muted-foreground)]">
                {["一", "二", "三", "四", "五", "六", "日"][index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 任务排行 - 极简进度条 */}
      <div>
        <p className="mb-2 text-xs font-medium text-[var(--muted-foreground)]">任务完成排行</p>
        <div className="space-y-2">
          {sortedStats.map((task, index) => (
            <div key={task.id} className="flex items-center gap-3 text-sm">
              <span className="num w-4 text-right text-[10px] text-[var(--muted-foreground)]">
                {index + 1}
              </span>
              <i className={`${task.icon} text-xs text-[var(--muted-foreground)]`} />
              <span className="w-16 truncate text-xs text-[var(--secondary-foreground)]">
                {task.name}
              </span>
              <div className="flex-1">
                <Progress value={task.rate} className="h-1 bg-[var(--border-light)]" />
              </div>
              <div className="num flex min-w-[48px] items-center justify-end gap-1 text-[10px]">
                <span className="text-[var(--primary)]">⭐{task.goldCount}</span>
                <span className="text-[var(--pink)]">🌸{task.pinkCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
