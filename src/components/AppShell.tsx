"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useAppData } from "@/hooks/useAppData";
import { getNextWeek, getPrevWeek, getTodayStr, getWeekDates } from "@/lib/date-utils";
import GlowCard from "./ui/GlowCard";
import AnimatedCounter from "./ui/AnimatedCounter";
import PunishmentPanel from "./PunishmentPanel";
import RewardPanel from "./RewardPanel";
import StatsPanel from "./StatsPanel";
import WeekNavigator from "./WeekNavigator";
import WeeklyGrid from "./WeeklyGrid";

const SpaceBackground = dynamic(() => import("./SpaceBackground"), {
  ssr: false,
});

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

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const isCurrentWeek = useMemo(() => {
    const todayWeek = getWeekDates(new Date());
    const currentWeek = getWeekDates(currentDate);
    return todayWeek[0] === currentWeek[0];
  }, [currentDate]);

  const weekStars = getWeekStars(weekDates);
  const weekRate = getWeekRate(weekDates);
  const isWeekFinished = useMemo(
    () => weekDates[weekDates.length - 1] < getTodayStr(),
    [weekDates]
  );

  /* 加载态 */
  if (!isLoaded || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-card px-7 py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            <p className="text-base text-white/50">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 md:py-10">
        {/* 顶部 Header */}
        <GlowCard glow className="mb-5 px-5 py-5 md:mb-7 md:px-7 md:py-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="ui-kicker">Daily Growth Dashboard</p>
              <h1 className="ui-title mt-1 text-3xl font-semibold text-white md:text-4xl">
                乔子然寒假日程
              </h1>
              <p className="mt-2 text-[15px] text-white/50 md:text-base">
                每日打卡、周度复盘、积分兑换，一目了然。
              </p>
            </div>

            {/* 星星余额卡片 */}
            <div className="glow-purple rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/15 to-accent-blue/10 px-4 py-3.5 md:min-w-[220px]">
              <p className="text-sm text-white/50">可用星星余额</p>
              <p className="num mt-1.5 flex items-center gap-2 text-3xl font-semibold text-primary-light md:text-4xl">
                <span>⭐</span>
                <AnimatedCounter value={availableStars} />
              </p>
            </div>
          </div>
        </GlowCard>

        {/* 周导航 */}
        <div className="mb-4 md:mb-5">
          <WeekNavigator
            weekDates={weekDates}
            onPrev={() => setCurrentDate(getPrevWeek(currentDate))}
            onNext={() => setCurrentDate(getNextWeek(currentDate))}
            onToday={() => setCurrentDate(new Date())}
            isCurrentWeek={isCurrentWeek}
          />
        </div>

        {/* Bento Grid 主体 */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          {/* 左侧：打卡表格 + 图例 */}
          <section className="space-y-4 xl:col-span-8">
            <WeeklyGrid
              weekDates={weekDates}
              records={data.records}
              onToggle={handleToggleCheck}
              getDayStars={getDayStars}
              getDayRate={getDayRate}
            />

            {/* 图例说明 */}
            <div className="glass-card px-4 py-3.5">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/55">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⭐</span>
                  <span>金星 = 2分</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌸</span>
                  <span>粉花 = 1分</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded bg-white/[0.06]">
                    <i className="ri-add-line text-[10px] text-white/30" />
                  </div>
                  <span>未完成</span>
                </div>
              </div>
            </div>
          </section>

          {/* 右侧：统计 + 奖励 */}
          <aside className="space-y-4 xl:col-span-4">
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
          </aside>
        </div>

        {/* 惩罚面板 - 全宽 */}
        <div className="mt-5">
          <PunishmentPanel weekRate={weekRate} isWeekFinished={isWeekFinished} />
        </div>

        {/* 底部操作 */}
        <footer className="mt-9 space-y-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleExport}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/[0.08]"
            >
              <i className="ri-download-2-line" />
              导出数据
            </button>
            <button
              onClick={handleFileImport}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/[0.08]"
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
          <p className="text-sm text-white/35">坚持每天完成一个小目标，就是很大的进步。</p>
        </footer>
      </div>
    </div>
  );
}
