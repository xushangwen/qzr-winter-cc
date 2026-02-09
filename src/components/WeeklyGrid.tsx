"use client";

import { motion } from "framer-motion";
import { TASKS, WEEKDAY_NAMES_SHORT } from "@/lib/constants";
import { formatDateShort, isTodayDate } from "@/lib/date-utils";
import { CheckStatus } from "@/lib/types";
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="glass-card overflow-hidden"
    >
      {/* 移动端滑动提示 */}
      <div className="flex items-center justify-end gap-1 px-4 py-2 text-xs text-white/35 md:hidden">
        <i className="ri-arrow-left-right-line" />
        <span>左右滑动查看整周</span>
      </div>

      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-[156px] bg-[#0a0a0f]/90 px-3 py-3 text-left backdrop-blur-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/35">任务</span>
              </th>
              {weekDates.map((date, index) => {
                const today = isTodayDate(date);
                return (
                  <th key={date} className="min-w-[80px] px-1 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-xs ${today ? "text-primary-light" : "text-white/40"}`}>
                        {WEEKDAY_NAMES_SHORT[index]}
                      </span>
                      <span
                        className={`num rounded-full px-2 py-0.5 text-xs font-semibold md:text-sm ${
                          today ? "bg-primary/20 text-primary-light" : "text-white/60"
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

          <tbody>
            {TASKS.map((task, taskIndex) => (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: taskIndex * 0.03 }}
                className="border-t border-white/[0.04] transition-colors hover:bg-white/[0.02]"
              >
                <td className="sticky left-0 z-10 bg-[#0a0a0f]/90 px-3 py-2.5 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <i className={`${task.icon} text-base text-primary/70`} />
                    <span className="text-[15px] font-medium text-white/80">{task.name}</span>
                  </div>
                </td>

                {weekDates.map((date) => (
                  <td key={`${task.id}-${date}`} className="px-1 py-1.5">
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

          <tfoot>
            <tr className="border-t border-white/[0.08] bg-white/[0.02]">
              <td className="sticky left-0 z-10 bg-[#0a0a0f]/90 px-3 py-3 backdrop-blur-sm">
                <span className="text-xs font-semibold text-white/45 md:text-sm">每日统计</span>
              </td>
              {weekDates.map((date) => {
                const stars = getDayStars(date);
                const rate = getDayRate(date);
                return (
                  <td key={`stats-${date}`} className="px-1 py-3 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="num text-xs font-semibold text-accent-gold md:text-sm">
                        {stars > 0 ? `★${stars}` : "-"}
                      </span>
                      <span
                        className={`num text-xs md:text-sm ${
                          rate >= 80
                            ? "text-accent-green"
                            : rate >= 50
                            ? "text-accent-gold"
                            : rate > 0
                            ? "text-accent-red"
                            : "text-white/25"
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
