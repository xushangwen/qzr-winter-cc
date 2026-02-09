"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REWARDS } from "@/lib/constants";
import { RedeemRecord } from "@/lib/types";

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

  const handleRedeem = (rewardId: string, name: string, cost: number) => {
    const success = onRedeem(rewardId, name, cost);
    if (success) {
      setJustRedeemed(rewardId);
      setTimeout(() => setJustRedeemed(null), 2000);
    }
    setShowConfirm(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-surface/80 backdrop-blur-xl rounded-2xl border border-border/50 p-4 md:p-5"
    >
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <i className="ri-gift-2-line text-accent-gold text-base md:text-lg" />
        <h2 className="text-sm md:text-base font-semibold text-foreground/90">奖励兑换</h2>
      </div>

      {/* 星星余额 */}
      <div className="bg-gradient-to-r from-accent-gold/10 to-accent-pink/10 rounded-xl p-3 md:p-4 mb-3 md:mb-4 border border-accent-gold/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] md:text-xs text-foreground/50 mb-0.5 md:mb-1">可用星星</p>
            <p className="text-2xl md:text-3xl font-bold text-accent-gold">{availableStars}</p>
          </div>
          <div className="text-right text-[11px] md:text-xs text-foreground/40 space-y-0.5 md:space-y-1">
            <p>累计获得: <span className="text-accent-gold">{totalEarned}</span></p>
            <p>已兑换: <span className="text-accent-pink">{totalSpent}</span></p>
          </div>
        </div>
      </div>

      {/* 奖励列表 */}
      <div className="space-y-2.5">
        {REWARDS.map((reward) => {
          const canAfford = availableStars >= reward.cost;
          const isConfirming = showConfirm === reward.id;
          const wasRedeemed = justRedeemed === reward.id;

          return (
            <div
              key={reward.id}
              className={`
                relative rounded-xl border transition-all duration-300
                ${canAfford
                  ? "border-accent-gold/30 bg-surface-light/50 hover:bg-surface-lighter/50"
                  : "border-border/30 bg-surface-light/20 opacity-60"
                }
              `}
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      canAfford ? "bg-accent-gold/15" : "bg-surface-lighter/50"
                    }`}
                  >
                    <i
                      className={`${reward.icon} text-lg ${
                        canAfford ? "text-accent-gold" : "text-foreground/30"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{reward.name}</p>
                    <p className="text-xs text-foreground/40">
                      {reward.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      canAfford ? "text-accent-gold" : "text-foreground/30"
                    }`}
                  >
                    ★{reward.cost}
                  </span>

                  <AnimatePresence mode="wait">
                    {wasRedeemed ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-8 h-8 rounded-lg bg-accent-green/20 flex items-center justify-center"
                      >
                        <i className="ri-check-line text-accent-green" />
                      </motion.div>
                    ) : isConfirming ? (
                      <motion.div
                        key="confirm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex gap-1"
                      >
                        <button
                          onClick={() =>
                            handleRedeem(reward.id, reward.name, reward.cost)
                          }
                          className="w-8 h-8 rounded-lg bg-accent-green/20 hover:bg-accent-green/30 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <i className="ri-check-line text-accent-green text-sm" />
                        </button>
                        <button
                          onClick={() => setShowConfirm(null)}
                          className="w-8 h-8 rounded-lg bg-accent-red/20 hover:bg-accent-red/30 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <i className="ri-close-line text-accent-red text-sm" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="redeem"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => canAfford && setShowConfirm(reward.id)}
                        disabled={!canAfford}
                        className={`
                          px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer
                          ${canAfford
                            ? "bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30"
                            : "bg-surface-lighter/30 text-foreground/20 cursor-not-allowed"
                          }
                        `}
                      >
                        兑换
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 进度条 */}
              <div className="px-3 pb-2">
                <div className="w-full h-1 rounded-full bg-surface-lighter/50 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-accent-gold to-accent-pink"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        (availableStars / reward.cost) * 100,
                        100
                      )}%`,
                    }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 兑换历史 */}
      {redeemHistory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-xs text-foreground/40 mb-2">兑换记录</p>
          <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
            {redeemHistory
              .slice()
              .reverse()
              .map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between text-xs text-foreground/50"
                >
                  <span>{record.rewardName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-accent-pink">-★{record.cost}</span>
                    <span className="text-foreground/30">{record.date}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
