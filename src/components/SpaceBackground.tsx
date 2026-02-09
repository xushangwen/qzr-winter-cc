"use client";

import { motion } from "framer-motion";

/* 动态渐变 mesh 背景：多层模糊渐变球 + 缓慢漂移动画 */
export default function SpaceBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* 深空底色 */}
      <div className="absolute inset-0 bg-[#0a0a0f]" />

      {/* 渐变球 - 紫色主调 */}
      <motion.div
        className="absolute h-[600px] w-[600px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)", left: "-5%", top: "-10%" }}
        animate={{ x: [0, 50, -20, 0], y: [0, -30, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* 渐变球 - 蓝色 */}
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)", right: "-8%", top: "20%" }}
        animate={{ x: [0, -40, 30, 0], y: [0, 50, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* 渐变球 - 青色 */}
      <motion.div
        className="absolute h-[450px] w-[450px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)", left: "30%", bottom: "-15%" }}
        animate={{ x: [0, 30, -50, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />

      {/* 微弱网格纹理 */}
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:60px_60px]" />
    </div>
  );
}
