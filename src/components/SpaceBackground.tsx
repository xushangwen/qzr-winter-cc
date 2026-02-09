"use client";

import { useMemo } from "react";

// 使用固定种子生成伪随机数，避免 SSR/CSR 水合不一致
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function SpaceBackground() {
  // 固定生成 60 颗星星，用 CSS 媒体查询控制移动端隐藏部分
  const stars = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${seededRandom(i * 3 + 1) * 100}%`,
      top: `${seededRandom(i * 3 + 2) * 100}%`,
      size: seededRandom(i * 3 + 3) * 2.5 + 0.5,
      delay: seededRandom(i * 7) * 5,
      duration: seededRandom(i * 7 + 1) * 3 + 2,
      // 前 35 颗在所有设备显示，后 25 颗仅桌面端显示
      mobileHidden: i >= 35,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f1f3d] to-[#0a1628]" />

      {/* 星云效果 */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px]" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[100px]" />
      <div className="absolute top-[60%] left-[60%] w-[300px] h-[300px] rounded-full bg-pink-500/3 blur-[80px]" />

      {/* 星星 */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full bg-white ${star.mobileHidden ? "hidden md:block" : ""}`}
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
