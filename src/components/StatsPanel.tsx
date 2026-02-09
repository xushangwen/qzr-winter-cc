"use client";

import { motion } from "framer-motion";
import { TASKS, STAR_POINTS } from "@/lib/constants";
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
  // 计算每个任务本周的完成情况
  const taskStats = TASKS.map((task) => {
    let goldCount = 0;
    let pinkCount = 0;
    let totalPoints = 0;

    weekDates.forEach((date) => {
      const status: CheckStatus = data.records[date]?.[task.id] || "none";
      if (status === "gold") goldCount++;
      if (status === "pink") pinkCount++;
      totalPoints += STAR_POINTS[status];
    });

    return {
      ...task,
      goldCount,
      pinkCount,
      totalCount: goldCount + pinkCount,
      totalPoints,
      rate: Math.round(((goldCount + pinkCount) / 7) * 100),
    };
  });

  // 按完成率排序
  const sortedStats = [...taskStats].sort((a, b) => b.rate - a.rate);

  // 计算本周每天的星星数用于柱状图
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-surface/80 backdrop-blur-xl rounded-2xl border border-border/50 p-4 md:p-5"
    >
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <i className="ri-bar-chart-2-line text-primary-light text-base md:text-lg" />
        <h2 className="text-sm md:text-base font-semibold text-foreground/90">本周统计</h2>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-3 gap-1.5 md:gap-2 mb-4 md:mb-5">
        <div className="bg-surface-light/50 rounded-xl p-2.5 md:p-3 text-center">
          <p className="text-xl md:text-2xl font-bold text-accent-gold">{weekStars}</p>
          <p className="text-[9px] md:text-[10px] text-foreground/40 mt-0.5">本周星星</p>
        </div>
        <div className="bg-surface-light/50 rounded-xl p-2.5 md:p-3 text-center">
          <p
            className={`text-xl md:text-2xl font-bold ${
              weekRate >= 80
                ? "text-accent-green"
                : weekRate >= 50
                ? "text-accent-gold"
                : "text-accent-red"
            }`}
          >
            {weekRate}%
          </p>
          <p className="text-[9px] md:text-[10px] text-foreground/40 mt-0.5">完成率</p>
        </div>
        <div className="bg-surface-light/50 rounded-xl p-2.5 md:p-3 text-center">
          <p className="text-xl md:text-2xl font-bold text-primary-light">
            {taskStats.reduce((sum, t) => sum + t.totalCount, 0)}
          </p>
          <p className="text-[9px] md:text-[10px] text-foreground/40 mt-0.5">打卡次数</p>
        </div>
      </div>

      {/* 每日星星柱状图 */}
      <div className="mb-5">
        <p className="text-xs text-foreground/40 mb-2">每日星星分布</p>
        <div className="flex items-end gap-1.5 h-[80px]">
          {dailyStars.map((stars, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <motion.div
                className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary-light"
                initial={{ height: 0 }}
                animate={{
                  height: `${(stars / maxDailyStars) * 60}px`,
                }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                style={{ minHeight: stars > 0 ? "4px" : "0px" }}
              />
              <span className="text-[9px] text-foreground/30">
                {["一", "二", "三", "四", "五", "六", "日"][index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 各任务完成情况 */}
      <div>
        <p className="text-xs text-foreground/40 mb-2">任务完成排行</p>
        <div className="space-y-2">
          {sortedStats.map((task, index) => (
            <div key={task.id} className="flex items-center gap-2">
              <span className="text-[10px] text-foreground/30 w-4 text-right">
                {index + 1}
              </span>
              <i className={`${task.icon} text-xs text-foreground/40`} />
              <span className="text-xs text-foreground/70 w-24 truncate">
                {task.name}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-surface-lighter/50 overflow-hidden">
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
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                />
              </div>
              <div className="flex items-center gap-1 min-w-[50px] justify-end">
                <span className="text-[10px] text-accent-gold">
                  ⭐{task.goldCount}
                </span>
                <span className="text-[10px] text-accent-pink">
                  🌸{task.pinkCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
