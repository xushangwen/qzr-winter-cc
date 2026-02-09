import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  format,
  eachDayOfInterval,
  isToday,
  isSameDay,
  parseISO,
} from "date-fns";
import { zhCN } from "date-fns/locale";

// 获取某一周的所有日期（周一开始）
export function getWeekDates(referenceDate: Date): string[] {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 });
  return eachDayOfInterval({ start: weekStart, end: weekEnd }).map((d) =>
    format(d, "yyyy-MM-dd")
  );
}

// 获取周一日期
export function getWeekStart(referenceDate: Date): Date {
  return startOfWeek(referenceDate, { weekStartsOn: 1 });
}

// 上一周
export function getPrevWeek(current: Date): Date {
  return subWeeks(current, 1);
}

// 下一周
export function getNextWeek(current: Date): Date {
  return addWeeks(current, 1);
}

// 格式化日期显示
export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), "M/d");
}

// 格式化周范围
export function formatWeekRange(dates: string[]): string {
  if (dates.length === 0) return "";
  const start = format(parseISO(dates[0]), "M月d日", { locale: zhCN });
  const end = format(parseISO(dates[dates.length - 1]), "M月d日", {
    locale: zhCN,
  });
  return `${start} - ${end}`;
}

// 判断是否是今天
export function isTodayDate(dateStr: string): boolean {
  return isToday(parseISO(dateStr));
}

// 判断两个日期是否相同
export function isSameDate(dateStr1: string, dateStr2: string): boolean {
  return isSameDay(parseISO(dateStr1), parseISO(dateStr2));
}

// 获取今天的日期字符串
export function getTodayStr(): string {
  return format(new Date(), "yyyy-MM-dd");
}

// 获取星期几的索引 (0=周一, 6=周日)
export function getWeekdayIndex(dateStr: string): number {
  const day = parseISO(dateStr).getDay();
  return day === 0 ? 6 : day - 1;
}
