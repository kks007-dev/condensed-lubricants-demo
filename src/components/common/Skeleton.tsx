import type { HTMLAttributes } from "react";

export default function Skeleton({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`relative overflow-hidden rounded ${className}`} {...rest}>
      <div className="absolute inset-0 animate-pulse bg-slate-200" />
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      <style>{`@keyframes shimmer{100%{transform:translateX(100%)}}`}</style>
      <div className="opacity-0">.</div>
    </div>
  );
}
