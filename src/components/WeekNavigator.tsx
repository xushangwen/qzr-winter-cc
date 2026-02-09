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
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-1.5 md:gap-2">
        <button
          onClick={onPrev}
          className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-surface/80 border border-border/50 flex items-center justify-center hover:bg-surface-light/80 active:scale-90 transition-all cursor-pointer"
        >
          <i className="ri-arrow-left-s-line text-foreground/60" />
        </button>
        <button
          onClick={onNext}
          className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-surface/80 border border-border/50 flex items-center justify-center hover:bg-surface-light/80 active:scale-90 transition-all cursor-pointer"
        >
          <i className="ri-arrow-right-s-line text-foreground/60" />
        </button>
      </div>

      <div className="text-center">
        <p className="text-xs md:text-sm font-medium text-foreground/80">
          {formatWeekRange(weekDates)}
        </p>
      </div>

      <div className="min-w-[60px] flex justify-end">
        {!isCurrentWeek ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onToday}
            className="px-2.5 md:px-3 py-1.5 rounded-lg bg-primary/20 text-primary-light text-[11px] md:text-xs font-medium hover:bg-primary/30 active:scale-95 transition-all cursor-pointer"
          >
            回到本周
          </motion.button>
        ) : (
          <span className="text-[10px] text-accent-green/60 font-medium">本周</span>
        )}
      </div>
    </motion.div>
  );
}
