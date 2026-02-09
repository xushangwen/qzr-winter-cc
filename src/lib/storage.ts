import { AppData, CheckStatus, RedeemRecord } from "./types";
import { STAR_POINTS, TASKS } from "./constants";
import { getTodayStr } from "./date-utils";

const STORAGE_KEY = "qzr-winter-cc-data";
const STORAGE_EVENT = "qzr-winter-cc-data-change";
const TASK_IDS = TASKS.map((task) => task.id);
let cachedSnapshotRaw: string | null | undefined;
let cachedSnapshot: AppData = createDefaultData();
const serverSnapshot: AppData = createDefaultData();

// 默认数据
function createDefaultData(): AppData {
  return {
    records: {},
    redeemHistory: [],
    totalStarsEarned: 0,
    totalStarsSpent: 0,
  };
}

function isCheckStatus(value: unknown): value is CheckStatus {
  return value === "none" || value === "gold" || value === "pink";
}

function getStatusPoints(status: unknown): number {
  if (!isCheckStatus(status)) return 0;
  return STAR_POINTS[status];
}

function normalizeRecords(
  rawRecords: unknown
): Record<string, Record<string, CheckStatus>> {
  if (!rawRecords || typeof rawRecords !== "object") return {};

  const normalized: Record<string, Record<string, CheckStatus>> = {};

  for (const [date, value] of Object.entries(
    rawRecords as Record<string, unknown>
  )) {
    if (!value || typeof value !== "object") continue;
    const dayData: Record<string, CheckStatus> = {};

    for (const [taskId, status] of Object.entries(
      value as Record<string, unknown>
    )) {
      if (!isCheckStatus(status)) continue;
      dayData[taskId] = status;
    }

    if (Object.keys(dayData).length > 0) {
      normalized[date] = dayData;
    }
  }

  return normalized;
}

function normalizeRedeemHistory(rawHistory: unknown): RedeemRecord[] {
  if (!Array.isArray(rawHistory)) return [];

  return rawHistory.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const cost =
      typeof record.cost === "number" &&
      Number.isFinite(record.cost) &&
      record.cost >= 0
        ? record.cost
        : 0;

    return [
      {
        id:
          typeof record.id === "string" && record.id
            ? record.id
            : `imported-${Date.now()}-${index}`,
        rewardId: typeof record.rewardId === "string" ? record.rewardId : "",
        rewardName:
          typeof record.rewardName === "string" ? record.rewardName : "未知奖励",
        cost,
        date:
          typeof record.date === "string" && record.date
            ? record.date
            : getTodayStr(),
      },
    ];
  });
}

function normalizeData(raw: unknown): AppData {
  if (!raw || typeof raw !== "object") return createDefaultData();
  const source = raw as Record<string, unknown>;
  const records = normalizeRecords(source.records);
  const redeemHistory = normalizeRedeemHistory(source.redeemHistory);
  const redeemedFromHistory = redeemHistory.reduce(
    (sum, record) => sum + record.cost,
    0
  );
  const totalStarsSpent =
    typeof source.totalStarsSpent === "number" &&
    Number.isFinite(source.totalStarsSpent) &&
    source.totalStarsSpent >= 0
      ? Math.max(source.totalStarsSpent, redeemedFromHistory)
      : redeemedFromHistory;

  const normalized: AppData = {
    records,
    redeemHistory,
    totalStarsEarned: 0,
    totalStarsSpent,
  };
  normalized.totalStarsEarned = calculateTotalStars(normalized);
  return normalized;
}

// 读取数据
export function loadData(): AppData {
  return getDataSnapshot();
}

// 保存数据
export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  const normalized = normalizeData(data);
  const serialized = JSON.stringify(normalized);
  localStorage.setItem(STORAGE_KEY, serialized);
  cachedSnapshotRaw = serialized;
  cachedSnapshot = normalized;
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function subscribeDataChanges(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onStorageChange = (event: StorageEvent) => {
    if (!event.key || event.key === STORAGE_KEY) {
      listener();
    }
  };
  const onLocalChange = () => listener();

  window.addEventListener("storage", onStorageChange);
  window.addEventListener(STORAGE_EVENT, onLocalChange);

  return () => {
    window.removeEventListener("storage", onStorageChange);
    window.removeEventListener(STORAGE_EVENT, onLocalChange);
  };
}

export function getDataSnapshot(): AppData {
  if (typeof window === "undefined") return createDefaultData();

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedSnapshotRaw && cachedSnapshotRaw !== undefined) {
    return cachedSnapshot;
  }

  cachedSnapshotRaw = raw;
  if (!raw) {
    cachedSnapshot = createDefaultData();
    return cachedSnapshot;
  }

  try {
    cachedSnapshot = normalizeData(JSON.parse(raw));
  } catch {
    cachedSnapshotRaw = null;
    cachedSnapshot = createDefaultData();
  }
  return cachedSnapshot;
}

export function getServerDataSnapshot(): AppData {
  return serverSnapshot;
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
      total += getStatusPoints(status);
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
    date: getTodayStr(),
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
  for (const taskId of TASK_IDS) {
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
  const today = getTodayStr();
  const effectiveDates = weekDates.includes(today)
    ? weekDates.filter((date) => date <= today)
    : weekDates;
  const totalSlots = effectiveDates.length * TASKS.length;
  if (totalSlots === 0) return 0;
  let completed = 0;
  for (const date of effectiveDates) {
    const dayRecords = data.records[date];
    if (!dayRecords) continue;
    for (const taskId of TASK_IDS) {
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
    stars += getStatusPoints(dayRecords[taskId]);
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
  a.download = `qzr-winter-cc-backup-${getTodayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// 导入数据（返回解析后的 AppData，由调用方决定是否应用）
export function parseImportData(jsonStr: string): AppData | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== "object") return null;
    const parsedObj = parsed as Record<string, unknown>;
    if (!("records" in parsedObj) && !("redeemHistory" in parsedObj)) return null;
    return normalizeData(parsed);
  } catch {
    return null;
  }
}
