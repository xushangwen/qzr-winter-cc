import { Task, Reward, Punishment } from "./types";

// 每日任务列表（基于实体打卡表）
export const TASKS: Task[] = [
  { id: "writing", name: "写话", icon: "ri-edit-2-line" },
  { id: "jump_rope", name: "跳绳", icon: "ri-run-line" },
  { id: "ping_pong", name: "乒乓球", icon: "ri-ping-pong-line" },
  { id: "math", name: "口算/99乘法表", icon: "ri-calculator-line" },
  { id: "english", name: "英语", icon: "ri-translate-2" },
  { id: "handwriting", name: "写字", icon: "ri-pencil-line" },
  { id: "coding", name: "编程", icon: "ri-code-s-slash-line" },
];

// 奖励列表
export const REWARDS: Reward[] = [
  {
    id: "star_zone",
    name: "星星兑换区",
    cost: 100,
    icon: "ri-star-line",
    description: "解锁星星兑换区特权",
  },
  {
    id: "flower_market",
    name: "逛花市",
    cost: 200,
    icon: "ri-plant-line",
    description: "和家人一起逛花市",
  },
  {
    id: "switch",
    name: "Switch 游戏时间",
    cost: 400,
    icon: "ri-gamepad-line",
    description: "获得 Switch 游戏时间",
  },
];

// 惩罚列表
export const PUNISHMENTS: Punishment[] = [
  { id: "copy", name: "罚抄 30 遍", icon: "ri-file-copy-line" },
  { id: "early_rise", name: "提早起床", icon: "ri-alarm-line" },
  { id: "cleaning", name: "大扫除", icon: "ri-home-gear-line" },
];

// 星星分值
export const STAR_POINTS = {
  gold: 2, // 金星 = 2分
  pink: 1, // 粉星 = 1分
  none: 0,
} as const;

// 一周达标阈值（完成率百分比）
export const WEEKLY_PASS_THRESHOLD = 60;

// 星期名称
export const WEEKDAY_NAMES = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
export const WEEKDAY_NAMES_SHORT = ["一", "二", "三", "四", "五", "六", "日"];
