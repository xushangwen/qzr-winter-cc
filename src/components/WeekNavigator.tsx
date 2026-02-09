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
          className="h-8 w-8 cursor-pointer rounded-lg border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f8fafc] hover:text-[#1a1a1a]"
          aria-label="上一周"
        >
          <i className="ri-arrow-left-s-line text-lg" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          className="h-8 w-8 cursor-pointer rounded-lg border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f8fafc] hover:text-[#1a1a1a]"
          aria-label="下一周"
        >
          <i className="ri-arrow-right-s-line text-lg" />
        </Button>
      </div>

      {/* 日期范围 */}
      <div className="text-center">
        <p className="text-xs text-[#94a3b8]">时间范围</p>
        <p className="num text-sm font-medium text-[#1a1a1a]">{formatWeekRange(weekDates)}</p>
      </div>

      {/* 本周/回到本周 */}
      <div className="min-w-[72px] text-right">
        {!isCurrentWeek ? (
          <Button
            onClick={onToday}
            className="cursor-pointer rounded-lg bg-[#22c55e] text-white text-sm hover:bg-[#16a34a] h-8"
            size="sm"
          >
            回到本周
          </Button>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcfce7] px-2.5 py-1 text-xs font-medium text-[#16a34a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            本周
          </span>
        )}
      </div>
    </motion.div>
  );
}
