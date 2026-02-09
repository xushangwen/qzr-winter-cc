"use client";

/* 极简背景 - 支持暗色模式 */
export default function SpaceBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-[var(--background)] transition-colors duration-200" />
  );
}
