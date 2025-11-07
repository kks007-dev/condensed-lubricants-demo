import type { ReactNode } from "react";

export type BannerTone = "info" | "warn" | "error" | "success";

export type StepStatus = "Pending" | "Unfillable" | "Ready for Scheduling" | "Ready for Pickup";

export type Step = {
  id: number;
  name: string;
  status: StepStatus;
  strikePallets: boolean;
  capacity: { percent: number; note: string };
  bannerKey: string;
  banner?: ReactNode;
};

export type LoadingSections = {
  products: boolean;
  banner: boolean;
  status: boolean;
};

export type TimelineEvent = {
  id: string;
  minStepId: number;
  title: string;
  timestamp: string;
  dotClass: string;
};
