"use client";

import { useState, useMemo, useRef } from "react";
import { useAppData } from "@/hooks/useAppData";
import { getWeekDates, getPrevWeek, getNextWeek, getWeekStart } from "@/lib/date-utils";
import SpaceBackground from "./SpaceBackground";
import WeekNavigator from "./WeekNavigator";
import WeeklyGrid from "./WeeklyGrid";
import RewardPanel from "./RewardPanel";
import PunishmentPanel from "./PunishmentPanel";
import StatsPanel from "./StatsPanel";

export default function AppShell() {
  const {
    data,
    isLoaded,
    availableStars,
    totalEarned,
    totalSpent,
    handleToggleCheck,
    handleRedeem,
    handleExport,
    handleImport,
    getDayStars,
    getWeekStars,
    getDayRate,
    getWeekRate,
  } = useAppData();

  const [currentDate, setCurrentDate] = useState(new Date());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 导入文件处理
  const handleFileImport = () => {
    fileInputRef.current?.click();
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        const success = handleImport(result);
        alert(success ? "数据导入成功！" : "导入失败，文件格式不正确");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // 当前周的日期列表
  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

  // 判断是否是本周
  const isCurrentWeek = useMemo(() => {
    const todayWeek = getWeekDates(new Date());
    const currentWeek = getWeekDates(currentDate);
    return todayWeek[0] === currentWeek[0];
  }, [currentDate]);

  // 本周统计
  const weekStars = getWeekStars(weekDates);
  const weekRate = getWeekRate(weekDates);

  if (!isLoaded || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-light/30 border-t-primary-light rounded-full animate-spin" />
          <p className="text-sm text-foreground/40">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* 顶部标题区 */}
        <header className="mb-5 md:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/20">
                <i className="ri-rocket-2-line text-white text-lg md:text-xl" />
              </div>
              <div>
                <h1 className="text-base md:text-xl font-bold shimmer-text">
                  乔子然寒假日程
                </h1>
                <p className="text-[11px] text-foreground/40 mt-0.5">
                  每日打卡 · 积星兑奖 · 养成好习惯
                </p>
              </div>
            </div>

            {/* 星星余额快捷显示 */}
            <div className="flex items-center gap-1.5 bg-surface/80 border border-accent-gold/20 rounded-xl px-3 py-1.5 md:py-2 shadow-sm shadow-accent-gold/5">
              <span className="text-base md:text-lg">⭐</span>
              <span className="text-sm md:text-base font-bold text-accent-gold">
                {availableStars}
              </span>
            </div>
          </div>
        </header>

        {/* 周导航 */}
        <div className="mb-4">
          <WeekNavigator
            weekDates={weekDates}
            onPrev={() => setCurrentDate(getPrevWeek(currentDate))}
            onNext={() => setCurrentDate(getNextWeek(currentDate))}
            onToday={() => setCurrentDate(new Date())}
            isCurrentWeek={isCurrentWeek}
          />
        </div>

        {/* 主内容区 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
          {/* 左侧：打卡表格（占 2 列） */}
          <div className="lg:col-span-2 space-y-4">
            <WeeklyGrid
              weekDates={weekDates}
              records={data.records}
              onToggle={handleToggleCheck}
              getDayStars={getDayStars}
              getDayRate={getDayRate}
            />

            {/* 图例说明 */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] text-foreground/40">
              <div className="flex items-center gap-1">
                <span className="text-sm">⭐</span>
                <span>金星 = 2分</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm">🌸</span>
                <span>粉花 = 1分</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 rounded bg-surface-light/50 flex items-center justify-center">
                  <i className="ri-add-line text-[9px] text-surface-lighter" />
                </div>
                <span>未完成</span>
              </div>
            </div>
          </div>

          {/* 右侧：面板区 */}
          <div className="space-y-4">
            <StatsPanel
              data={data}
              weekDates={weekDates}
              weekStars={weekStars}
              weekRate={weekRate}
            />
            <RewardPanel
              availableStars={availableStars}
              totalEarned={totalEarned}
              totalSpent={totalSpent}
              redeemHistory={data.redeemHistory}
              onRedeem={handleRedeem}
            />
            <PunishmentPanel weekRate={weekRate} />
          </div>
        </div>

        {/* 底部 */}
        <footer className="mt-8 space-y-3 text-center">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface/80 border border-border/50 text-xs text-foreground/40 hover:text-foreground/60 hover:bg-surface-light/80 transition-all cursor-pointer"
            >
              <i className="ri-download-2-line" />
              导出数据
            </button>
            <button
              onClick={handleFileImport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface/80 border border-border/50 text-xs text-foreground/40 hover:text-foreground/60 hover:bg-surface-light/80 transition-all cursor-pointer"
            >
              <i className="ri-upload-2-line" />
              导入数据
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={onFileChange}
              className="hidden"
            />
          </div>
          <p className="text-xs text-foreground/20">
            子然加油！每天进步一点点
          </p>
        </footer>
      </div>
    </div>
  );
}
