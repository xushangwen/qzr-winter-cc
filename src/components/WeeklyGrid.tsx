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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card-minimal overflow-hidden"
    >
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="sticky left-0 z-10 w-[120px] bg-[var(--card)] px-4 py-3 text-left">
                <span className="text-xs font-medium text-[var(--muted-foreground)]">任务</span>
              </th>
              {weekDates.map((date, index) => {
                const today = isTodayDate(date);
                return (
                  <th key={date} className="min-w-[72px] px-1 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-xs font-medium ${today ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}>
                        周{WEEKDAY_NAMES_SHORT[index]}
                      </span>
                      <span
                        className={`num text-xs ${
                          today 
                            ? "bg-[var(--primary-subtle)] text-[var(--primary)] font-medium px-2 py-0.5 rounded-full" 
                            : "text-[var(--muted-foreground)]"
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: taskIndex * 0.02 }}
                className="border-b border-[var(--border-light)] transition-colors hover:bg-[var(--secondary)]"
              >
                <td className="sticky left-0 z-10 bg-[var(--card)] px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <i className={`${task.icon} text-sm text-[var(--muted-foreground)]`} />
                    <span className="text-sm text-[var(--secondary-foreground)]">{task.name}</span>
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
            <tr className="bg-[var(--secondary)]">
              <td className="sticky left-0 z-10 bg-[var(--secondary)] px-4 py-3">
                <span className="text-xs font-medium text-[var(--muted-foreground)]">每日统计</span>
              </td>
              {weekDates.map((date) => {
                const stars = getDayStars(date);
                const rate = getDayRate(date);
                return (
                  <td key={`stats-${date}`} className="px-1 py-3 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="num text-xs font-semibold text-[var(--foreground)]">
                        {stars > 0 ? `${stars}★` : "-"}
                      </span>
                      {rate > 0 && (
                        <span
                          className={`num text-[10px] ${
                            rate >= 80
                              ? "text-[var(--success)]"
                              : rate >= 50
                              ? "text-[var(--warning)]"
                              : "text-[var(--danger)]"
                          }`}
                        >
                          {rate}%
                        </span>
                      )}
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
