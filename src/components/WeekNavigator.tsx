"use client";

import { motion } from "framer-motion";
import { formatWeekRange } from "@/lib/date-utils";

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
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel-shadow flex items-center justify-between gap-3 rounded-2xl border border-border/75 bg-surface/94 p-3 md:p-4"
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border/75 bg-surface-light text-foreground/72 hover:border-border hover:bg-surface-lighter/80 md:h-11 md:w-11"
          aria-label="上一周"
        >
          <i className="ri-arrow-left-s-line text-xl" />
        </button>
        <button
          onClick={onNext}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border/75 bg-surface-light text-foreground/72 hover:border-border hover:bg-surface-lighter/80 md:h-11 md:w-11"
          aria-label="下一周"
        >
          <i className="ri-arrow-right-s-line text-xl" />
        </button>
      </div>

      <p className="num text-center text-sm font-semibold tracking-tight text-foreground/88 md:text-base">
        {formatWeekRange(weekDates)}
      </p>

      <div className="min-w-[86px] text-right">
        {!isCurrentWeek ? (
          <button
            onClick={onToday}
            className="cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:opacity-90"
          >
            回到本周
          </button>
        ) : (
          <span className="inline-flex rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary">
            本周
          </span>
        )}
      </div>
    </motion.div>
  );
}
