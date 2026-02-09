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
            <tr className="border-b border-[#e2e8f0]">
              <th className="sticky left-0 z-10 w-[120px] bg-white px-4 py-3 text-left">
                <span className="text-xs font-medium text-[#94a3b8]">任务</span>
              </th>
              {weekDates.map((date, index) => {
                const today = isTodayDate(date);
                return (
                  <th key={date} className="min-w-[72px] px-1 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-xs font-medium ${today ? "text-[#22c55e]" : "text-[#94a3b8]"}`}>
                        周{WEEKDAY_NAMES_SHORT[index]}
                      </span>
                      <span
                        className={`num text-xs ${
                          today 
                            ? "bg-[#dcfce7] text-[#16a34a] font-medium px-2 py-0.5 rounded-full" 
                            : "text-[#64748b]"
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
                className="border-b border-[#f1f5f9] transition-colors hover:bg-[#f8fafc]"
              >
                <td className="sticky left-0 z-10 bg-white px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <i className={`${task.icon} text-sm text-[#94a3b8]`} />
                    <span className="text-sm text-[#475569]">{task.name}</span>
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
            <tr className="bg-[#f8fafc]">
              <td className="sticky left-0 z-10 bg-[#f8fafc] px-4 py-3">
                <span className="text-xs font-medium text-[#64748b]">每日统计</span>
              </td>
              {weekDates.map((date) => {
                const stars = getDayStars(date);
                const rate = getDayRate(date);
                return (
                  <td key={`stats-${date}`} className="px-1 py-3 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="num text-xs font-semibold text-[#1a1a1a]">
                        {stars > 0 ? `${stars}★` : "-"}
                      </span>
                      {rate > 0 && (
                        <span
                          className={`num text-[10px] ${
                            rate >= 80
                              ? "text-[#22c55e]"
                              : rate >= 50
                              ? "text-[#f59e0b]"
                              : "text-[#ef4444]"
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
