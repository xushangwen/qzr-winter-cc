"use client";

import { motion } from "framer-motion";

interface ProgressRingProps {
  /** 0-100 百分比 */
  progress: number;
  /** 环的尺寸 px */
  size?: number;
  /** 环的粗细 px */
  strokeWidth?: number;
  /** 渐变色 [起始色, 结束色] */
  colors?: [string, string];
  className?: string;
  children?: React.ReactNode;
}

export default function ProgressRing({
  progress,
  size = 100,
  strokeWidth = 6,
  colors = ["#8b5cf6", "#06b6d4"],
  className = "",
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gradientId = `ring-grad-${size}-${colors[0].replace("#", "")}`;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        {/* 背景环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* 进度环 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (circumference * Math.min(progress, 100)) / 100 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {/* 中心内容 */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
