"use client";

import { motion } from "framer-motion";
import { TASKS, WEEKDAY_NAMES_SHORT } from "@/lib/constants";
import { CheckStatus } from "@/lib/types";
import { formatDateShort, isTodayDate } from "@/lib/date-utils";
import StarCell from "./StarCell";

interface WeeklyGridProps {
  weekDates: string[];
  records: Record<string, Record<string, CheckStatus>>;
  onToggle: (date: string, taskId: string) => void;
  getDayStars: (date: string) => number;
  getDayRate: (date: string) => number;
}

export default function WeeklyGrid({
  weekDates,
  records,
  onToggle,
  getDayStars,
  getDayRate,
}: WeeklyGridProps) {
  const getStatus = (date: string, taskId: string): CheckStatus => {
    return records[date]?.[taskId] || "none";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-surface/80 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden"
    >
      {/* 横滑提示（仅移动端） */}
      <div className="flex items-center justify-end gap-1 px-3 py-1.5 md:hidden text-[10px] text-foreground/30">
        <i className="ri-arrow-left-right-line text-xs" />
        <span>左右滑动查看</span>
      </div>

      {/* 表格容器 */}
      <div className="overflow-x-auto scrollbar-thin -mt-1 md:mt-0">
        <table className="w-full min-w-[520px]">
          {/* 表头：星期 */}
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-surface/95 backdrop-blur-sm px-2 md:px-3 py-2.5 md:py-3 text-left w-[80px] md:w-[110px]">
                <span className="text-[10px] md:text-xs text-foreground/40 uppercase tracking-wider">
                  任务
                </span>
              </th>
              {weekDates.map((date, index) => {
                const today = isTodayDate(date);
                return (
                  <th key={date} className="px-0.5 md:px-1 py-2.5 md:py-3 text-center min-w-[52px] md:min-w-[64px]">
                    <div
                      className={`flex flex-col items-center gap-0.5 ${
                        today ? "text-primary-light" : "text-foreground/60"
                      }`}
                    >
                      <span className="text-[9px] md:text-[10px] uppercase tracking-wider">
                        {WEEKDAY_NAMES_SHORT[index]}
                      </span>
                      <span
                        className={`text-[10px] md:text-xs font-medium ${
                          today
                            ? "bg-primary/20 text-primary-light px-1.5 md:px-2 py-0.5 rounded-full"
                            : ""
                        }`}
                      >
                        {formatDateShort(date)}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* 表体：任务行 */}
          <tbody>
            {TASKS.map((task, taskIndex) => (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: taskIndex * 0.05 }}
                className="border-t border-border/20 hover:bg-surface-light/30 transition-colors"
              >
                {/* 任务名称 */}
                <td className="sticky left-0 z-10 bg-surface/95 backdrop-blur-sm px-2 md:px-3 py-1.5 md:py-2">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <i
                      className={`${task.icon} text-primary-light/70 text-sm md:text-base`}
                    />
                    <span className="text-[11px] md:text-sm font-medium text-foreground/80 whitespace-nowrap">
                      {task.name}
                    </span>
                  </div>
                </td>

                {/* 打卡格子 */}
                {weekDates.map((date) => (
                  <td key={`${task.id}-${date}`} className="px-0.5 md:px-1 py-1 md:py-1.5">
                    <StarCell
                      status={getStatus(date, task.id)}
                      onToggle={() => onToggle(date, task.id)}
                      isToday={isTodayDate(date)}
                    />
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>

          {/* 表尾：每日统计 */}
          <tfoot>
            <tr className="border-t-2 border-border/40">
              <td className="sticky left-0 z-10 bg-surface/95 backdrop-blur-sm px-2 md:px-3 py-2.5 md:py-3">
                <span className="text-[10px] md:text-xs text-foreground/40">每日统计</span>
              </td>
              {weekDates.map((date) => {
                const stars = getDayStars(date);
                const rate = getDayRate(date);
                return (
                  <td key={`stats-${date}`} className="px-0.5 md:px-1 py-2.5 md:py-3 text-center">
                    <div className="flex flex-col items-center gap-0.5 md:gap-1">
                      <span className="text-[10px] md:text-xs font-semibold text-accent-gold">
                        {stars > 0 ? `★${stars}` : "-"}
                      </span>
                      <span
                        className={`text-[9px] md:text-[10px] ${
                          rate >= 80
                            ? "text-accent-green"
                            : rate >= 50
                            ? "text-accent-gold"
                            : rate > 0
                            ? "text-accent-red"
                            : "text-foreground/20"
                        }`}
                      >
                        {rate > 0 ? `${rate}%` : ""}
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </motion.div>
  );
}
