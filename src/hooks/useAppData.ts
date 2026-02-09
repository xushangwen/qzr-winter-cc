"use client";

import { useState, useEffect, useCallback } from "react";
import { AppData } from "@/lib/types";
import {
  loadData,
  saveData,
  toggleCheck,
  redeemReward,
  getAvailableStars,
  calculateTotalStars,
  getDayStars,
  getWeekStars,
  getDayCompletionRate,
  getWeekCompletionRate,
  exportData,
  parseImportData,
} from "@/lib/storage";

export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初始化加载
  useEffect(() => {
    const loaded = loadData();
    // 确保 totalStarsEarned 是最新的
    loaded.totalStarsEarned = calculateTotalStars(loaded);
    setData(loaded);
    setIsLoaded(true);
  }, []);

  // 数据变化时自动保存
  useEffect(() => {
    if (data && isLoaded) {
      saveData(data);
    }
  }, [data, isLoaded]);

  // 切换打卡状态
  const handleToggleCheck = useCallback(
    (date: string, taskId: string) => {
      if (!data) return;
      const newData = toggleCheck(data, date, taskId);
      setData(newData);
    },
    [data]
  );

  // 兑换奖励
  const handleRedeem = useCallback(
    (rewardId: string, rewardName: string, cost: number): boolean => {
      if (!data) return false;
      const newData = redeemReward(data, rewardId, rewardName, cost);
      if (!newData) return false;
      setData(newData);
      return true;
    },
    [data]
  );

  // 获取可用星星
  const availableStars = data ? getAvailableStars(data) : 0;
  const totalEarned = data?.totalStarsEarned ?? 0;
  const totalSpent = data?.totalStarsSpent ?? 0;

  // 用 useCallback 包裹避免每次渲染创建新函数引用
  const getDayStarsCallback = useCallback(
    (date: string) => (data ? getDayStars(data, date) : 0),
    [data]
  );
  const getWeekStarsCallback = useCallback(
    (dates: string[]) => (data ? getWeekStars(data, dates) : 0),
    [data]
  );
  const getDayRateCallback = useCallback(
    (date: string) => (data ? getDayCompletionRate(data, date) : 0),
    [data]
  );
  const getWeekRateCallback = useCallback(
    (dates: string[]) => (data ? getWeekCompletionRate(data, dates) : 0),
    [data]
  );

  // 导出数据
  const handleExport = useCallback(() => {
    if (data) exportData(data);
  }, [data]);

  // 导入数据
  const handleImport = useCallback((jsonStr: string): boolean => {
    const imported = parseImportData(jsonStr);
    if (!imported) return false;
    setData(imported);
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
