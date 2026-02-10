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

  // 检查是否有任何打卡记录
  const hasAnyRecords = Object.keys(records).length > 0 && 
    Object.values(records).some(day => Object.keys(day).length > 0);

  return (
    <div className="space-y-4">
      {/* 表头 - 日期行 */}
      <div className="card-minimal p-3">
        <div className="flex items-center">
          {/* 左上角空白 */}
          <div className="w-[100px] flex-shrink-0" />
          
          {/* 日期列 */}
          <div className="flex-1 grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const today = isTodayDate(date);
              const stars = getDayStars(date);
              const rate = getDayRate(date);
              
              return (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                    today 
                      ? "bg-[var(--primary-subtle)] ring-1 ring-[var(--primary)]/30" 
                      : ""
                  }`}
                >
                  <span className={`text-xs font-medium ${
                    today ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
                  }`}>
                    周{WEEKDAY_NAMES_SHORT[index]}
                  </span>
                  <span className={`num text-sm font-semibold ${
                    today ? "text-[var(--primary)]" : "text-[var(--foreground)]"
                  }`}>
                    {formatDateShort(date)}
                  </span>
                  
                  {/* 每日统计小标签 */}
                  <div className="flex flex-col items-center gap-0.5 mt-1">
                    {stars > 0 && (
                      <span className="num text-[10px] font-medium text-[var(--primary)]">
                        {stars}★
                      </span>
                    )}
                    {rate > 0 && (
                      <span className={`num text-[9px] ${
                        rate >= 80
                          ? "text-[var(--success)]"
                          : rate >= 50
                          ? "text-[var(--warning)]"
                          : "text-[var(--danger)]"
                      }`}>
                        {rate}%
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 任务行 - 卡片列表 */}
      <div className="space-y-2">
        {TASKS.map((task, taskIndex) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: taskIndex * 0.05 }}
            className="card-minimal p-3 hover:border-[var(--primary)]/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              {/* 任务信息 */}
              <div className="w-[100px] flex-shrink-0 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--secondary)]">
                  <i className={`${task.icon} text-sm text-[var(--muted-foreground)]`} />
                </div>
                <span className="text-sm font-medium text-[var(--foreground)] truncate">
                  {task.name}
                </span>
              </div>

              {/* 打卡按钮行 */}
              <div className="flex-1 grid grid-cols-7 gap-2">
                {weekDates.map((date) => (
                  <StarCell
                    key={`${task.id}-${date}`}
                    status={getStatus(date, task.id)}
                    onToggle={() => onToggle(date, task.id)}
                    isToday={isTodayDate(date)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 空状态提示 */}
      {!hasAnyRecords && (
        <div className="card-minimal empty-state py-12">
          <div className="empty-state-icon">🎯</div>
          <p className="empty-state-title">开始你的第一次打卡</p>
          <p className="empty-state-desc">点击上方的格子标记今天的完成情况</p>
        </div>
      )}
    </div>
  );
}
