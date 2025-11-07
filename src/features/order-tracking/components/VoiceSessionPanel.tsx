import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

import VoiceSessionBanner from "./VoiceSessionBanner";
import { VOICE_SESSION_TIMELINE } from "../data/orderTrackingData";
import type { LoadingSections, Step } from "../types";

const TIMELINE_ITEM_CLASSES = "flex items-start gap-2 rounded-md border border-slate-200 p-2 text-base";

type VoiceSessionPanelProps = {
  step: Step;
  loadingSections: LoadingSections;
};

export default function VoiceSessionPanel({ step, loadingSections }: VoiceSessionPanelProps) {
  const visibleEvents = VOICE_SESSION_TIMELINE.filter((event) => step.id >= event.minStepId);

  return (
    <Card className="flex h-[700px] flex-col rounded-md">
      <CardHeader className="flex-shrink-0 border-b pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-1/2 top-1/2 inline-flex h-4 w-4 -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-40 animate-[ping_2s_ease-in-out_infinite]" />
              </span>
              <svg
                className="relative z-10 h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <CardTitle className="text-base font-semibold">Voice Agent Session</CardTitle>
          </div>
          <p className="text-base text-gray-500">Active • Connected since 9:00 AM</p>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        <div className="flex-[0.38] overflow-y-auto border-b p-4">
          <h3 className="mb-3 text-base font-medium text-gray-700">Current Message</h3>
          <div className="space-y-2">
            {step.banner ? (
              loadingSections.banner ? (
                <VoiceSessionBanner tone="info" loading>
                  Loading…
                </VoiceSessionBanner>
              ) : (
                step.banner
              )
            ) : (
              <div className="text-base italic text-gray-500">Communication open...</div>
            )}
          </div>
        </div>

        <div className="flex-[0.65] overflow-y-auto p-4">
          <h3 className="mb-3 text-base font-medium text-gray-700">Session History</h3>
          <div className="space-y-2">
            {visibleEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={TIMELINE_ITEM_CLASSES}
              >
                <div className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${event.dotClass}`} />
                <div className="flex-1">
                  <div className="text-gray-700">{event.title}</div>
                  <div className="mt-0.5 text-sm text-gray-400">{event.timestamp}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
