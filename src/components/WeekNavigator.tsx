"use client";

import { motion } from "framer-motion";
import { formatWeekRange } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";

interface WeekNavigatorProps {
  weekDates: string[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  isCurrentWeek: boolean;
}

export default function WeekNavigator({
  weekDates,
  onPrev,
  onNext,
  onToday,
  isCurrentWeek,
}: WeekNavigatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-minimal flex items-center justify-between gap-3 p-3 md:p-4"
    >
      {/* 左右箭头 */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrev}
          className="h-8 w-8 cursor-pointer rounded-lg border-[var(--border)] bg-[var(--card)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
          aria-label="上一周"
        >
          <i className="ri-arrow-left-s-line text-lg" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          className="h-8 w-8 cursor-pointer rounded-lg border-[var(--border)] bg-[var(--card)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
          aria-label="下一周"
        >
          <i className="ri-arrow-right-s-line text-lg" />
        </Button>
      </div>

      {/* 日期范围 - 优化显示 */}
      <div className="text-center min-w-0 flex-1 px-2">
        <p className="text-xs text-[var(--muted-foreground)] hidden md:block">时间范围</p>
        <p className="num text-sm font-medium text-[var(--foreground)] truncate">
          {formatWeekRange(weekDates)}
        </p>
      </div>

      {/* 本周/回到本周 */}
      <div className="flex-shrink-0">
        {!isCurrentWeek ? (
          <Button
            onClick={onToday}
            className="cursor-pointer rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs hover:opacity-90 h-8 px-3"
            size="sm"
          >
            <span className="hidden sm:inline">回到本周</span>
            <span className="sm:hidden">本周</span>
          </Button>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--success)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
            <span className="hidden sm:inline">本周</span>
          </span>
        )}
      </div>
    </motion.div>
  );
}
