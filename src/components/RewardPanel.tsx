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
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="ri-gift-line text-sm text-[var(--primary)]" />
          <h2 className="text-sm font-semibold text-[var(--foreground)]">奖励兑换</h2>
        </div>
        {/* 小统计 */}
        <div className="num text-xs text-[var(--muted-foreground)]">
          累计: <span className="text-[var(--primary)]">{totalEarned}</span> · 已兑: <span className="text-[var(--pink)]">{totalSpent}</span>
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
                  ? "border-[var(--border)] bg-[var(--card)]"
                  : "border-[var(--border-light)] bg-[var(--secondary)] opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-md ${
                    canAfford ? "bg-[var(--primary-subtle)]" : "bg-[var(--border-light)]"
                  }`}>
                    <i className={`${reward.icon} text-sm ${canAfford ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">{reward.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{reward.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`num text-xs font-medium ${canAfford ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}>
                    ★{reward.cost}
                  </span>

                  <AnimatePresence mode="wait">
                    {wasRedeemed ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--success-subtle)]"
                      >
                        <i className="ri-check-line text-[var(--success)]" />
                      </motion.div>
                    ) : (
                      <motion.div key="redeem">
                        <Button
                          size="sm"
                          onClick={() => canAfford && setConfirmReward({ id: reward.id, name: reward.name, cost: reward.cost })}
                          disabled={!canAfford}
                          className={`cursor-pointer text-xs h-7 ${
                            canAfford
                              ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
                              : "bg-[var(--border-light)] text-[var(--muted-foreground)]"
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
                <Progress value={progress} className="h-1 bg-[var(--border-light)]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 兑换记录 */}
      {redeemHistory.length > 0 && (
        <div className="mt-4 border-t border-[var(--border)] pt-3">
          <p className="mb-2 text-xs font-medium text-[var(--muted-foreground)]">兑换记录</p>
          <div className="max-h-[100px] space-y-1.5 overflow-y-auto">
            {redeemHistory
              .slice()
              .reverse()
              .map((record) => (
                <div
                  key={record.id}
                  className="num flex items-center justify-between rounded-md bg-[var(--secondary)] px-2.5 py-1.5 text-xs"
                >
                  <span className="text-[var(--secondary-foreground)]">{record.rewardName}</span>
                  <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                    <span className="font-medium text-[var(--pink)]">-★{record.cost}</span>
                    <span>{record.date}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 兑换确认 Dialog */}
      <Dialog open={!!confirmReward} onOpenChange={(open) => !open && setConfirmReward(null)}>
        <DialogContent className="border-[var(--border)] bg-[var(--card)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--foreground)]">确认兑换</DialogTitle>
            <DialogDescription className="text-[var(--muted-foreground)]">
              确定要花费 <span className="num font-medium text-[var(--primary)]">★{confirmReward?.cost}</span> 星星兑换「{confirmReward?.name}」吗？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setConfirmReward(null)} 
              className="cursor-pointer border-[var(--border)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)] w-full sm:w-auto"
            >
              取消
            </Button>
            <Button 
              onClick={handleRedeem} 
              className="cursor-pointer bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 w-full sm:w-auto"
            >
              确认兑换
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
