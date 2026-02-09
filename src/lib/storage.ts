import { AppData, CheckStatus, RedeemRecord } from "./types";
import { STAR_POINTS, TASKS } from "./constants";

const STORAGE_KEY = "qzr-winter-cc-data";

// 默认数据
const defaultData: AppData = {
  records: {},
  redeemHistory: [],
  totalStarsEarned: 0,
  totalStarsSpent: 0,
};

// 读取数据
export function loadData(): AppData {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    return JSON.parse(raw) as AppData;
  } catch {
    return defaultData;
  }
}

// 保存数据
export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 切换打卡状态：none -> gold -> pink -> none
export function toggleCheck(
  data: AppData,
  date: string,
  taskId: string
): AppData {
  const newData = { ...data, records: { ...data.records } };
  if (!newData.records[date]) {
    newData.records[date] = {};
  }
  newData.records[date] = { ...newData.records[date] };

  const currentStatus = newData.records[date][taskId] || "none";
  const nextStatus: CheckStatus =
    currentStatus === "none" ? "gold" : currentStatus === "gold" ? "pink" : "none";

  newData.records[date][taskId] = nextStatus;

  // 重新计算总星星数
  newData.totalStarsEarned = calculateTotalStars(newData);

  return newData;
}

// 计算总星星数
export function calculateTotalStars(data: AppData): number {
  let total = 0;
  for (const date in data.records) {
    for (const taskId in data.records[date]) {
      const status = data.records[date][taskId];
      total += STAR_POINTS[status];
    }
  }
  return total;
}

// 可用星星数（总获得 - 总花费）
export function getAvailableStars(data: AppData): number {
  return data.totalStarsEarned - data.totalStarsSpent;
}

// 兑换奖励
export function redeemReward(
  data: AppData,
  rewardId: string,
  rewardName: string,
  cost: number
): AppData | null {
  const available = getAvailableStars(data);
  if (available < cost) return null;

  const record: RedeemRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    rewardId,
    rewardName,
    cost,
    date: new Date().toISOString().split("T")[0],
  };

  return {
    ...data,
    redeemHistory: [...data.redeemHistory, record],
    totalStarsSpent: data.totalStarsSpent + cost,
  };
}

// 获取某一天的完成率
export function getDayCompletionRate(
  data: AppData,
  date: string
): number {
  const dayRecords = data.records[date];
  if (!dayRecords) return 0;
  let completed = 0;
  for (const taskId of TASKS.map((t) => t.id)) {
    if (dayRecords[taskId] && dayRecords[taskId] !== "none") {
      completed++;
    }
  }
  return Math.round((completed / TASKS.length) * 100);
}

// 获取某一周的完成率
export function getWeekCompletionRate(
  data: AppData,
  weekDates: string[]
): number {
  const totalSlots = weekDates.length * TASKS.length;
  if (totalSlots === 0) return 0;
  let completed = 0;
  for (const date of weekDates) {
    const dayRecords = data.records[date];
    if (!dayRecords) continue;
    for (const taskId of TASKS.map((t) => t.id)) {
      if (dayRecords[taskId] && dayRecords[taskId] !== "none") {
        completed++;
      }
    }
  }
  return Math.round((completed / totalSlots) * 100);
}

// 获取某一天的星星数
export function getDayStars(data: AppData, date: string): number {
  const dayRecords = data.records[date];
  if (!dayRecords) return 0;
  let stars = 0;
  for (const taskId in dayRecords) {
    stars += STAR_POINTS[dayRecords[taskId]];
  }
  return stars;
}

// 获取某一周的星星数
export function getWeekStars(data: AppData, weekDates: string[]): number {
  return weekDates.reduce((sum, date) => sum + getDayStars(data, date), 0);
}

// 导出数据为 JSON 文件
export function exportData(data: AppData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `qzr-winter-cc-backup-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// 导入数据（返回解析后的 AppData，由调用方决定是否应用）
export function parseImportData(jsonStr: string): AppData | null {
  try {
    const parsed = JSON.parse(jsonStr);
    // 基本结构校验
    if (parsed && typeof parsed.records === "object" && Array.isArray(parsed.redeemHistory)) {
      parsed.totalStarsEarned = calculateTotalStars(parsed);
      return parsed as AppData;
    }
    return null;
  } catch {
    return null;
  }
}
