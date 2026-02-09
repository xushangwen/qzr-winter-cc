"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { REWARDS } from "@/lib/constants";
import { RedeemRecord } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AnimatedCounter from "./ui/AnimatedCounter";

interface RewardPanelProps {
  availableStars: number;
  totalEarned: number;
  totalSpent: number;
  redeemHistory: RedeemRecord[];
  onRedeem: (rewardId: string, rewardName: string, cost: number) => boolean;
}

export default function RewardPanel({
  availableStars,
  totalEarned,
  totalSpent,
  redeemHistory,
  onRedeem,
}: RewardPanelProps) {
  const [confirmReward, setConfirmReward] = useState<{ id: string; name: string; cost: number } | null>(null);
  const [justRedeemed, setJustRedeemed] = useState<string | null>(null);
  const redeemTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redeemTimerRef.current) clearTimeout(redeemTimerRef.current);
    };
  }, []);

  const handleRedeem = () => {
    if (!confirmReward) return;
    const success = onRedeem(confirmReward.id, confirmReward.name, confirmReward.cost);
    if (success) {
      if (redeemTimerRef.current) clearTimeout(redeemTimerRef.current);
      setJustRedeemed(confirmReward.id);
      redeemTimerRef.current = setTimeout(() => setJustRedeemed(null), 1600);
    }
    setConfirmReward(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="card-minimal p-5"
    >
      {/* 标题 */}
      <div className="mb-4 flex items-center gap-2">
        <i className="ri-gift-line text-sm text-[#22c55e]" />
        <h2 className="text-sm font-semibold text-[#1a1a1a]">奖励兑换</h2>
      </div>

      {/* 星星余额 - 大数字风格 */}
      <div className="mb-5 flex items-center gap-4 rounded-lg bg-[#f8fafc] p-4">
        <div className="flex-1">
          <p className="text-xs text-[#64748b]">可用星星</p>
          <p className="num text-3xl font-semibold text-[#1a1a1a]">
            <AnimatedCounter value={availableStars} />
          </p>
        </div>
        <div className="text-right text-xs text-[#64748b]">
          <p>累计: <span className="num font-medium text-[#22c55e]">{totalEarned}</span></p>
          <p>已兑: <span className="num font-medium text-[#f472b6]">{totalSpent}</span></p>
        </div>
      </div>

      {/* 奖励列表 */}
      <div className="space-y-3">
        {REWARDS.map((reward) => {
          const canAfford = availableStars >= reward.cost;
          const wasRedeemed = justRedeemed === reward.id;
          const progress = Math.min((availableStars / reward.cost) * 100, 100);

          return (
            <div
              key={reward.id}
              className={`rounded-lg border p-3 transition-all ${
                canAfford
                  ? "border-[#e2e8f0] bg-white"
                  : "border-[#f1f5f9] bg-[#f8fafc] opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-md ${
                    canAfford ? "bg-[#dcfce7]" : "bg-[#f1f5f9]"
                  }`}>
                    <i className={`${reward.icon} text-sm ${canAfford ? "text-[#22c55e]" : "text-[#94a3b8]"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">{reward.name}</p>
                    <p className="text-xs text-[#64748b]">{reward.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`num text-xs font-medium ${canAfford ? "text-[#22c55e]" : "text-[#94a3b8]"}`}>
                    ★{reward.cost}
                  </span>

                  <AnimatePresence mode="wait">
                    {wasRedeemed ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-[#dcfce7]"
                      >
                        <i className="ri-check-line text-[#22c55e]" />
                      </motion.div>
                    ) : (
                      <motion.div key="redeem">
                        <Button
                          size="sm"
                          onClick={() => canAfford && setConfirmReward({ id: reward.id, name: reward.name, cost: reward.cost })}
                          disabled={!canAfford}
                          className={`cursor-pointer text-xs h-7 ${
                            canAfford
                              ? "bg-[#22c55e] text-white hover:bg-[#16a34a]"
                              : "bg-[#f1f5f9] text-[#94a3b8]"
                          }`}
                        >
                          兑换
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 进度条 */}
              <div className="mt-2">
                <Progress value={progress} className="h-1 bg-[#f1f5f9]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 兑换记录 */}
      {redeemHistory.length > 0 && (
        <div className="mt-4 border-t border-[#e2e8f0] pt-3">
          <p className="mb-2 text-xs font-medium text-[#64748b]">兑换记录</p>
          <div className="max-h-[100px] space-y-1.5 overflow-y-auto">
            {redeemHistory
              .slice()
              .reverse()
              .map((record) => (
                <div
                  key={record.id}
                  className="num flex items-center justify-between rounded-md bg-[#f8fafc] px-2.5 py-1.5 text-xs"
                >
                  <span className="text-[#475569]">{record.rewardName}</span>
                  <div className="flex items-center gap-2 text-[#94a3b8]">
                    <span className="font-medium text-[#f472b6]">-★{record.cost}</span>
                    <span>{record.date}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 兑换确认 Dialog */}
      <Dialog open={!!confirmReward} onOpenChange={(open) => !open && setConfirmReward(null)}>
        <DialogContent className="border-[#e2e8f0] bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a]">确认兑换</DialogTitle>
            <DialogDescription className="text-[#64748b]">
              确定要花费 <span className="num font-medium text-[#22c55e]">★{confirmReward?.cost}</span> 星星兑换「{confirmReward?.name}」吗？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setConfirmReward(null)} 
              className="cursor-pointer border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]"
            >
              取消
            </Button>
            <Button 
              onClick={handleRedeem} 
              className="cursor-pointer bg-[#22c55e] text-white hover:bg-[#16a34a]"
            >
              确认兑换
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
