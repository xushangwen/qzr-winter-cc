"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { REWARDS } from "@/lib/constants";
import { RedeemRecord } from "@/lib/types";
import GlowCard from "./ui/GlowCard";
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
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [justRedeemed, setJustRedeemed] = useState<string | null>(null);
  const redeemTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redeemTimerRef.current) clearTimeout(redeemTimerRef.current);
    };
  }, []);

  const handleRedeem = (rewardId: string, name: string, cost: number) => {
    const success = onRedeem(rewardId, name, cost);
    if (success) {
      if (redeemTimerRef.current) clearTimeout(redeemTimerRef.current);
      setJustRedeemed(rewardId);
      redeemTimerRef.current = setTimeout(() => setJustRedeemed(null), 1600);
    }
    setShowConfirm(null);
  };

  return (
    <GlowCard delay={0.16} className="p-4 md:p-5">
      <div className="mb-4 flex items-center gap-2">
        <i className="ri-gift-2-line text-lg text-accent-gold" />
        <h2 className="text-base font-semibold text-white md:text-lg">奖励兑换</h2>
      </div>

      {/* 星星余额卡片 */}
      <div className="glow-purple mb-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/12 to-accent-cyan/8 p-4">
        <p className="text-sm text-white/45">可用星星</p>
        <p className="num mt-1 text-3xl font-semibold text-primary-light md:text-4xl">
          <AnimatedCounter value={availableStars} />
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-white/45">
          <p className="num">
            累计获得: <span className="font-semibold text-accent-gold">{totalEarned}</span>
          </p>
          <p className="num">
            已兑换: <span className="font-semibold text-accent-pink">{totalSpent}</span>
          </p>
        </div>
      </div>

      {/* 奖励列表 */}
      <div className="space-y-3">
        {REWARDS.map((reward) => {
          const canAfford = availableStars >= reward.cost;
          const isConfirming = showConfirm === reward.id;
          const wasRedeemed = justRedeemed === reward.id;

          return (
            <div
              key={reward.id}
              className={`rounded-2xl border p-3 ${
                canAfford
                  ? "border-white/[0.08] bg-white/[0.03]"
                  : "border-white/[0.04] bg-white/[0.02] opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl ${
                      canAfford ? "bg-primary/15" : "bg-white/[0.04]"
                    }`}
                  >
                    <i className={`${reward.icon} text-lg ${canAfford ? "text-primary-light" : "text-white/25"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white md:text-base">{reward.name}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-white/45">{reward.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`num text-sm font-semibold ${canAfford ? "text-accent-gold" : "text-white/25"}`}>
                    ★{reward.cost}
                  </span>

                  <AnimatePresence mode="wait">
                    {wasRedeemed ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="glow-green flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green/20"
                      >
                        <i className="ri-check-line text-accent-green" />
                      </motion.div>
                    ) : isConfirming ? (
                      <motion.div
                        key="confirm"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex gap-1"
                      >
                        <button
                          onClick={() => handleRedeem(reward.id, reward.name, reward.cost)}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-accent-green/20 text-accent-green hover:bg-accent-green/30"
                          aria-label="确认兑换"
                        >
                          <i className="ri-check-line" />
                        </button>
                        <button
                          onClick={() => setShowConfirm(null)}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-accent-red/20 text-accent-red hover:bg-accent-red/30"
                          aria-label="取消兑换"
                        >
                          <i className="ri-close-line" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="redeem"
                        onClick={() => canAfford && setShowConfirm(reward.id)}
                        disabled={!canAfford}
                        className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium ${
                          canAfford
                            ? "bg-gradient-to-r from-primary to-accent-blue text-white shadow-sm hover:opacity-90"
                            : "bg-white/[0.04] text-white/25 cursor-not-allowed"
                        }`}
                      >
                        兑换
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 进度条 */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((availableStars / reward.cost) * 100, 100)}%` }}
                  transition={{ duration: 0.7 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 兑换记录 */}
      {redeemHistory.length > 0 && (
        <div className="mt-5 border-t border-white/[0.06] pt-4">
          <p className="mb-2 text-sm font-medium text-white/55">兑换记录</p>
          <div className="max-h-[132px] space-y-2 overflow-y-auto pr-1">
            {redeemHistory
              .slice()
              .reverse()
              .map((record) => (
                <div
                  key={record.id}
                  className="num flex items-center justify-between rounded-lg bg-white/[0.03] px-2.5 py-2 text-sm"
                >
                  <span className="text-white/70">{record.rewardName}</span>
                  <div className="flex items-center gap-2 text-white/45">
                    <span className="font-medium text-accent-pink">-★{record.cost}</span>
                    <span>{record.date}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </GlowCard>
  );
}
