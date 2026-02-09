"use client";

import { useCallback, useSyncExternalStore } from "react";
import { AppData } from "@/lib/types";
import {
  saveData,
  subscribeDataChanges,
  getDataSnapshot,
  getServerDataSnapshot,
  toggleCheck,
  redeemReward,
  getAvailableStars,
  getDayStars,
  getWeekStars,
  getDayCompletionRate,
  getWeekCompletionRate,
  exportData,
  parseImportData,
} from "@/lib/storage";

export function useAppData() {
  const data: AppData = useSyncExternalStore(
    subscribeDataChanges,
    getDataSnapshot,
    getServerDataSnapshot
  );
  const isLoaded = true;

  // 切换打卡状态
  const handleToggleCheck = useCallback(
    (date: string, taskId: string) => {
      const newData = toggleCheck(data, date, taskId);
      saveData(newData);
    },
    [data]
  );

  // 兑换奖励
  const handleRedeem = useCallback(
    (rewardId: string, rewardName: string, cost: number): boolean => {
      const newData = redeemReward(data, rewardId, rewardName, cost);
      if (!newData) return false;
      saveData(newData);
      return true;
    },
    [data]
  );

  // 获取可用星星
  const availableStars = getAvailableStars(data);
  const totalEarned = data.totalStarsEarned;
  const totalSpent = data.totalStarsSpent;

  // 用 useCallback 包裹避免每次渲染创建新函数引用
  const getDayStarsCallback = useCallback(
    (date: string) => getDayStars(data, date),
    [data]
  );
  const getWeekStarsCallback = useCallback(
    (dates: string[]) => getWeekStars(data, dates),
    [data]
  );
  const getDayRateCallback = useCallback(
    (date: string) => getDayCompletionRate(data, date),
    [data]
  );
  const getWeekRateCallback = useCallback(
    (dates: string[]) => getWeekCompletionRate(data, dates),
    [data]
  );

  // 导出数据
  const handleExport = useCallback(() => {
    exportData(data);
  }, [data]);

  // 导入数据
  const handleImport = useCallback((jsonStr: string): boolean => {
    const imported = parseImportData(jsonStr);
    if (!imported) return false;
    saveData(imported);
    return true;
  }, []);

  return {
    data,
    isLoaded,
    availableStars,
    totalEarned,
    totalSpent,
    handleToggleCheck,
    handleRedeem,
    handleExport,
    handleImport,
    getDayStars: getDayStarsCallback,
    getWeekStars: getWeekStarsCallback,
    getDayRate: getDayRateCallback,
    getWeekRate: getWeekRateCallback,
  };
}
