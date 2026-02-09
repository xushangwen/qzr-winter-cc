"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useAppData } from "@/hooks/useAppData";
import { getNextWeek, getPrevWeek, getTodayStr, getWeekDates } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AnimatedCounter from "./ui/AnimatedCounter";
import ThemeToggle from "./ThemeToggle";
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
  const [importResult, setImportResult] = useState<{ open: boolean; success: boolean }>({ open: false, success: false });

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
        setImportResult({ open: true, success });
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
        <div className="card-minimal px-8 py-10">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#22c55e]/20 border-t-[#22c55e]" />
            <p className="text-sm text-[#64748b]">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 md:py-10">
        {/* 顶部 Header - 极简风格 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="ui-kicker mb-1">Daily Tracker</p>
              <h1 className="ui-title text-2xl font-semibold text-[var(--foreground)] md:text-3xl">
                乔子然寒假日程
              </h1>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                每日打卡 · 周度复盘 · 积分兑换
              </p>
            </div>
            
            <div className="flex items-center gap-3">

              {/* 星星余额 - 极简大数字 */}
              <div className="card-minimal flex items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-subtle)]">
                  <span className="text-xl">⭐</span>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">可用星星</p>
                  <p className="num text-2xl font-semibold text-[var(--foreground)]">
                    <AnimatedCounter value={availableStars} />
                  </p>
                </div>
              </div>
              
              {/* 主题切换 */}
              <ThemeToggle />
            </div>
          </div>
        </motion.div>

        {/* 周导航 */}
        <div className="mb-5">
          <WeekNavigator
            weekDates={weekDates}
            onPrev={() => setCurrentDate(getPrevWeek(currentDate))}
            onNext={() => setCurrentDate(getNextWeek(currentDate))}
            onToday={() => setCurrentDate(new Date())}
            isCurrentWeek={isCurrentWeek}
          />
        </div>

        {/* 主体布局 */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          {/* 左侧：打卡表格 */}
          <section className="xl:col-span-8">
            <WeeklyGrid
              weekDates={weekDates}
              records={data.records}
              onToggle={handleToggleCheck}
              getDayStars={getDayStars}
              getDayRate={getDayRate}
            />
          </section>

          {/* 右侧：统计 + 奖励 */}
          <aside className="space-y-5 xl:col-span-4">
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

        {/* 惩罚面板 */}
        <div className="mt-5">
          <PunishmentPanel weekRate={weekRate} isWeekFinished={isWeekFinished} />
        </div>

        {/* 底部操作 */}
        <footer className="mt-10 border-t border-[var(--border)] pt-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleExport} 
              className="cursor-pointer gap-2 rounded-lg border-[var(--border)] bg-[var(--card)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
            >
              <i className="ri-download-2-line" />
              导出数据
            </Button>
            <Button 
              variant="outline" 
              onClick={handleFileImport} 
              className="cursor-pointer gap-2 rounded-lg border-[var(--border)] bg-[var(--card)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
            >
              <i className="ri-upload-2-line" />
              导入数据
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={onFileChange}
              className="hidden"
            />
          </div>
          <p className="mt-4 text-xs text-[var(--muted-foreground)]">坚持每天完成一个小目标</p>
        </footer>
      </div>

      {/* 导入结果 Dialog */}
      <Dialog open={importResult.open} onOpenChange={(open) => setImportResult((prev) => ({ ...prev, open }))}>
        <DialogContent className="border-[var(--border)] bg-[var(--card)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--foreground)]">{importResult.success ? "导入成功" : "导入失败"}</DialogTitle>
            <DialogDescription className="text-[var(--muted-foreground)]">
              {importResult.success ? "数据已成功导入！" : "导入失败，文件格式不正确。"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              onClick={() => setImportResult({ open: false, success: false })} 
              className="cursor-pointer bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
            >
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
