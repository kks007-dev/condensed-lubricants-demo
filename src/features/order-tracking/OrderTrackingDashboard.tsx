import { useState } from "react";
import OrderTrackingHeader from "./components/OrderTrackingHeader";
import OrderSummaryCard from "./components/OrderSummaryCard";
import VoiceSessionPanel from "./components/VoiceSessionPanel";
import { ORDER_TRACKING_STEPS } from "./data/orderTrackingData";
import { useStepController } from "./hooks/useStepController";

export default function OrderTrackingDashboard() {
  const [realtimeMode, setRealtimeMode] = useState(false);
  const { step, loadingSections, isConnected, wsError } = useStepController(ORDER_TRACKING_STEPS, realtimeMode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <OrderTrackingHeader />

      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-base text-gray-500">Orders / Order #028472</div>
          
          {/* Real-time mode toggle */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={realtimeMode}
                onChange={(e) => setRealtimeMode(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Real-time Mode</span>
            </label>
            
            {/* Connection status indicator */}
            {realtimeMode && (
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-500">
                  {isConnected ? 'Connected' : wsError || 'Disconnected'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
          <OrderSummaryCard step={step} loadingSections={loadingSections} />
          <VoiceSessionPanel step={step} loadingSections={loadingSections} />
        </div>
      </main>
    </div>
  );
}
