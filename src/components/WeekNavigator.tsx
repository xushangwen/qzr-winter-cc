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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card flex items-center justify-between gap-3 p-3.5 md:p-4"
    >
      {/* 左右箭头 */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white/80 md:h-11 md:w-11"
          aria-label="上一周"
        >
          <i className="ri-arrow-left-s-line text-xl" />
        </button>
        <button
          onClick={onNext}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white/80 md:h-11 md:w-11"
          aria-label="下一周"
        >
          <i className="ri-arrow-right-s-line text-xl" />
        </button>
      </div>

      {/* 日期范围 */}
      <div className="text-center">
        <p className="ui-kicker">Week Range</p>
        <p className="num text-sm font-semibold text-white/90 md:text-base">{formatWeekRange(weekDates)}</p>
      </div>

      {/* 本周/回到本周 */}
      <div className="min-w-[86px] text-right">
        {!isCurrentWeek ? (
          <button
            onClick={onToday}
            className="cursor-pointer rounded-lg bg-gradient-to-r from-primary to-accent-blue px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:opacity-90"
          >
            回到本周
          </button>
        ) : (
          <span className="inline-flex rounded-lg border border-primary/30 bg-primary/15 px-2.5 py-1 text-sm font-medium text-primary-light">
            本周
          </span>
        )}
      </div>
    </motion.div>
  );
}
