import VoiceSessionBanner from "../components/VoiceSessionBanner";
import type { Step, TimelineEvent } from "../types";

export const ORDER_TRACKING_STEPS: Step[] = [
  {
    id: 1,
    name: "Initial View",
    // Screen 1: change Qty -> 1 pallet and status -> Ready for Scheduling
    status: "Ready for Scheduling",
    strikePallets: false,
    capacity: { percent: 70, note: "70% of safe threshold" },
    bannerKey: "info-initial",
    banner: <VoiceSessionBanner tone="info">Order accessed and reviewing details.</VoiceSessionBanner>,
  },
  // Screens 2-4 removed for condensed demo
  {
    id: 2,
    name: "Freight Forwarder Setup",
    status: "Ready for Scheduling",
    strikePallets: false,
    capacity: { percent: 84, note: "84% of safe threshold" },
    bannerKey: "info-schedule",
    banner: (
      <VoiceSessionBanner tone="info">
        <div className="mb-3 font-medium">Confirm Pickup</div>
        <div className="flex items-start gap-6">
          <div>
            <div className="mb-1 text-base tracking-wide text-gray-500">Freight Forwarder</div>
            <div className="text-base text-gray-900">BlueBridge Freight</div>
          </div>
          <div>
            <div className="mb-1 text-base tracking-wide text-gray-500">Pickup Date</div>
            <div className="text-base text-gray-900">10 Oct 2025</div>
          </div>
        </div>
      </VoiceSessionBanner>
    ),
  },
  {
    id: 3,
    name: "Confirmation Received",
  status: "Scheduled for Pickup",
    strikePallets: false,
    capacity: { percent: 84, note: "84% of safe threshold" },
    bannerKey: "info-confirm",
    banner: (
      <VoiceSessionBanner tone="success">
        <div className="mb-3 font-medium">✅ Shipment Confirmed</div>
        <div className="mb-4 flex items-start gap-6">
          <div>
            <div className="mb-1 text-base tracking-wide text-gray-500">Freight Forwarder</div>
            <div className="text-base text-gray-900">BlueBridge Freight</div>
          </div>
          <div>
            <div className="mb-1 text-base tracking-wide text-gray-500">Pickup Date</div>
            <div className="text-base text-gray-900">10 Oct 2025</div>
          </div>
        </div>
      </VoiceSessionBanner>
    ),
  },
  {
    id: 4,
    name: "Contingency Preferences",
  status: "Scheduled for Pickup",
    strikePallets: false,
    capacity: { percent: 84, note: "84% of safe threshold" },
    bannerKey: "warn-pref",
    banner: (
      <VoiceSessionBanner tone="info">
        <div className="mb-1 font-medium">Product Substitution Preferences</div>
        <ul className="list-disc ml-5 space-y-1">
          <li className="text-base">If Premium Hydraulic Oil ISO VG 32 unavailable → use Synthetic 32</li>
          <li className="text-base">If FleetGuard 15W-40 unavailable → omit pallet</li>
        </ul>
      </VoiceSessionBanner>
    ),
  },
  {
    id: 5,
    name: "Final Confirmation",
  status: "Scheduled for Pickup",
    strikePallets: false,
    capacity: { percent: 84, note: "84% of safe threshold" },
    bannerKey: "info-final",
    banner: <VoiceSessionBanner tone="success">✅ All updates verified</VoiceSessionBanner>,
  },
];

export const VOICE_SESSION_TIMELINE: TimelineEvent[] = [
  {
    id: "finalized",
    minStepId: 5,
    title: "All updates verified and finalized",
    timestamp: "Oct 7, 2025 • 9:45 AM",
    dotClass: "bg-green-500",
  },
  {
    id: "contingency",
    minStepId: 4,
    title: "Set contingency preferences",
    timestamp: "Oct 7, 2025 • 9:40 AM",
    dotClass: "bg-blue-500",
  },
  {
    id: "pickup-confirmed",
    minStepId: 3,
    title: "Pickup confirmed by BlueBridge Freight",
    timestamp: "Oct 7, 2025 • 9:32 AM",
    dotClass: "bg-green-500",
  },
  {
    id: "pickup-requested",
    minStepId: 2,
    title: "Pickup confirmation requested",
    timestamp: "Oct 7, 2025 • 9:25 AM",
    dotClass: "bg-blue-500",
  },
  {
    id: "initial",
    minStepId: 1,
    title: "Order created and reviewed",
    timestamp: "Oct 7, 2025 • 9:00 AM",
    dotClass: "bg-blue-500",
  },
];
