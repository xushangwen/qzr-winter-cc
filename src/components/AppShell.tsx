"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useAppData } from "@/hooks/useAppData";
import { getNextWeek, getPrevWeek, getTodayStr, getWeekDates } from "@/lib/date-utils";
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

  if (!isLoaded || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="panel-shadow rounded-2xl border border-border/80 bg-surface/92 px-6 py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
            <p className="text-base text-foreground/65">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-10">
        <header className="panel-shadow mb-5 rounded-3xl border border-border/80 bg-surface/94 p-5 md:mb-7 md:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white shadow-sm md:h-14 md:w-14">
                <i className="ri-rocket-2-line text-xl md:text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  乔子然寒假日程
                </h1>
                <p className="mt-1 text-sm leading-relaxed text-foreground/68 md:text-base">
                  每日打卡 · 积星兑奖 · 养成好习惯
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/12 to-primary-light/10 px-4 py-3 sm:min-w-[196px]">
              <p className="text-sm text-foreground/68">当前可用星星</p>
              <p className="num mt-1 flex items-center gap-2 text-3xl font-semibold text-primary md:text-4xl">
                <span>⭐</span>
                <span>{availableStars}</span>
              </p>
            </div>
          </div>
        </header>

        <div className="mb-4 md:mb-5">
          <WeekNavigator
            weekDates={weekDates}
            onPrev={() => setCurrentDate(getPrevWeek(currentDate))}
            onNext={() => setCurrentDate(getNextWeek(currentDate))}
            onToday={() => setCurrentDate(new Date())}
            isCurrentWeek={isCurrentWeek}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <WeeklyGrid
              weekDates={weekDates}
              records={data.records}
              onToggle={handleToggleCheck}
              getDayStars={getDayStars}
              getDayRate={getDayRate}
            />

            <div className="panel-shadow rounded-2xl border border-border/75 bg-surface/92 px-4 py-3.5">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/74">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">⭐</span>
                  <span>金星 = 2分</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🌸</span>
                  <span>粉花 = 1分</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex h-4 w-4 items-center justify-center rounded bg-surface-lighter/90">
                    <i className="ri-add-line text-[10px] text-foreground/45" />
                  </div>
                  <span>未完成</span>
                </div>
              </div>
            </div>
          </div>

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
            <PunishmentPanel weekRate={weekRate} isWeekFinished={isWeekFinished} />
          </div>
        </div>

        <footer className="mt-9 space-y-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleExport}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/75 bg-surface/94 px-4 py-2.5 text-sm font-medium text-foreground/82 hover:border-border hover:bg-surface-light"
            >
              <i className="ri-download-2-line" />
              导出数据
            </button>
            <button
              onClick={handleFileImport}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/75 bg-surface/94 px-4 py-2.5 text-sm font-medium text-foreground/82 hover:border-border hover:bg-surface-light"
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
          <p className="text-sm text-foreground/55">子然加油！每天进步一点点</p>
        </footer>
      </div>
    </div>
  );
}
