"use client";

export default function SpaceBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.35),rgba(255,255,255,0))]" />
      <div className="absolute -top-16 left-[-8%] h-72 w-72 rounded-full bg-primary/14 blur-3xl" />
      <div className="absolute right-[-6%] top-1/4 h-80 w-80 rounded-full bg-accent-gold/12 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[36%] h-72 w-72 rounded-full bg-primary-light/10 blur-3xl" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(210,214,202,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(210,214,202,0.45)_1px,transparent_1px)] [background-size:40px_40px]" />
    </div>
  );
}
