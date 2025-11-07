import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

import Skeleton from "@/components/common/Skeleton";
import type { BannerTone } from "../types";

type VoiceSessionBannerProps = PropsWithChildren<{
  tone: BannerTone;
  loading?: boolean;
}>;

const TONE_CLASSES: Record<BannerTone, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warn: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-red-200 bg-red-50 text-red-800",
  success: "border-green-200 bg-green-50 text-green-800",
};

export default function VoiceSessionBanner({ tone, loading = false, children }: VoiceSessionBannerProps) {
  if (loading) {
    return <Skeleton className="h-16 w-full rounded-md" />;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-md border p-4 text-base ${TONE_CLASSES[tone]}`}
    >
      {children}
    </motion.section>
  );
}
