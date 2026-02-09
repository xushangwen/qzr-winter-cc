"use client";

import { motion } from "framer-motion";
import { STAR_POINTS, TASKS } from "@/lib/constants";
import { AppData, CheckStatus } from "@/lib/types";

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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="panel-shadow rounded-3xl border border-border/75 bg-surface/94 p-4 md:p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <i className="ri-bar-chart-2-line text-lg text-primary" />
        <h2 className="text-base font-semibold text-foreground md:text-lg">本周统计</h2>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border/50 bg-surface-light/80 p-3 text-center">
          <p className="num text-2xl font-semibold text-accent-gold md:text-3xl">{weekStars}</p>
          <p className="mt-1 text-xs text-foreground/62 md:text-sm">本周星星</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-surface-light/80 p-3 text-center">
          <p
            className={`num text-2xl font-semibold md:text-3xl ${
              weekRate >= 80
                ? "text-accent-green"
                : weekRate >= 50
                ? "text-accent-gold"
                : "text-accent-red"
            }`}
          >
            {weekRate}%
          </p>
          <p className="mt-1 text-xs text-foreground/62 md:text-sm">完成率</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-surface-light/80 p-3 text-center">
          <p className="num text-2xl font-semibold text-primary md:text-3xl">
            {taskStats.reduce((sum, task) => sum + task.totalCount, 0)}
          </p>
          <p className="mt-1 text-xs text-foreground/62 md:text-sm">打卡次数</p>
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm font-medium text-foreground/72">每日星星分布</p>
        <div className="flex h-[92px] items-end gap-1.5">
          {dailyStars.map((stars, index) => (
            <div key={weekDates[index]} className="flex flex-1 flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary-light"
                initial={{ height: 0 }}
                animate={{ height: `${(stars / maxDailyStars) * 66}px` }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                style={{ minHeight: stars > 0 ? "5px" : "0" }}
              />
              <span className="text-xs text-foreground/52">{["一", "二", "三", "四", "五", "六", "日"][index]}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground/72">任务完成排行</p>
        <div className="space-y-2.5">
          {sortedStats.map((task, index) => (
            <div key={task.id} className="flex items-center gap-2 text-sm">
              <span className="num w-5 text-right text-xs text-foreground/52">{index + 1}</span>
              <i className={`${task.icon} text-sm text-foreground/56`} />
              <span className="w-24 truncate text-foreground/82">{task.name}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-lighter/95">
                <motion.div
                  className={`h-full rounded-full ${
                    task.rate >= 80
                      ? "bg-accent-green"
                      : task.rate >= 50
                      ? "bg-accent-gold"
                      : task.rate > 0
                      ? "bg-accent-red"
                      : "bg-surface-lighter"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${task.rate}%` }}
                  transition={{ duration: 0.55, delay: index * 0.04 }}
                />
              </div>
              <div className="num flex min-w-[66px] items-center justify-end gap-1 text-xs md:text-sm">
                <span className="text-accent-gold">⭐{task.goldCount}</span>
                <span className="text-accent-pink">🌸{task.pinkCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
