// 打卡状态：未完成 / 金星（优秀）/ 粉星（完成）
export type CheckStatus = "none" | "gold" | "pink";

// 单个任务定义
export interface Task {
  id: string;
  name: string;
  icon: string; // remixicon class name
}

// 单日打卡记录
export interface DayRecord {
  date: string; // YYYY-MM-DD
  checks: Record<string, CheckStatus>; // taskId -> status
}

// 周记录
export interface WeekData {
  weekStart: string; // YYYY-MM-DD (周一)
  days: DayRecord[];
}

// 奖励项
export interface Reward {
  id: string;
  name: string;
  cost: number;
  icon: string;
  description: string;
}

// 惩罚项
export interface Punishment {
  id: string;
  name: string;
  icon: string;
}

// 兑换记录
export interface RedeemRecord {
  id: string;
  rewardId: string;
  rewardName: string;
  cost: number;
  date: string;
}

// 全局应用数据
export interface AppData {
  records: Record<string, Record<string, CheckStatus>>; // date -> taskId -> status
  redeemHistory: RedeemRecord[];
  totalStarsEarned: number;
  totalStarsSpent: number;
}
