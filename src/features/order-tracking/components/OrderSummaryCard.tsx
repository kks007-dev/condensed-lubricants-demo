import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Skeleton from "@/components/common/Skeleton";

import OrderProductsTable from "./OrderProductsTable";
import type { LoadingSections, Step } from "../types";

const STATUS_BADGE_CLASSES: Record<Step["status"], string> = {
  Pending: "bg-gray-100 text-gray-800",
  Unfillable: "bg-amber-100 text-amber-800",
  "Ready for Scheduling": "bg-gray-100 text-gray-800",
  "Scheduled for Pickup": "bg-green-100 text-green-800",
};

type OrderSummaryCardProps = {
  step: Step;
  loadingSections: LoadingSections;
};

export default function OrderSummaryCard({ step, loadingSections }: OrderSummaryCardProps) {
  const statusBadgeClass = STATUS_BADGE_CLASSES[step.status] ?? STATUS_BADGE_CLASSES.Pending;

  return (
    <Card className="rounded-md">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-8">
            <div>
              <div className="font-bold text-gray-900">ACME Corporation</div>
              <div className="text-base text-gray-600">Order #028472</div>
            </div>

            <div className="flex items-start gap-8 text-base">
              <div>
                <div className="mb-1 text-base tracking-wide text-gray-500">Status</div>
                <div>
                  {loadingSections.status ? (
                    <Skeleton className="h-6 w-20 rounded" />
                  ) : (
                    <span className={`inline-flex rounded px-2 py-1 text-base font-medium ${statusBadgeClass}`}>
                      {step.status}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="mb-1 text-base tracking-wide text-gray-500">Ship Date</div>
                <div className="text-base text-gray-900">10 Dec 2025</div>
              </div>
              <div>
                <div className="mb-1 text-base tracking-wide text-gray-500">Freight Forwarder</div>
                {step.id >= 3 ? (
                  <div className="text-base text-gray-900">BlueBridge Freight</div>
                ) : (
                  <div className="text-base text-gray-900">&nbsp;</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
    <OrderProductsTable loading={loadingSections.products} />

        <section>
          <h2 className="mb-2 font-semibold">Shipping Details</h2>
          <div className="rounded-md border bg-white p-4">
            <div className="grid grid-cols-4 gap-6">
              <div>
                <div className="mb-1 text-base tracking-wide text-gray-500">Pickup Date</div>
                <div className="text-base text-gray-900">10 Dec 2025</div>
              </div>
              <div>
                <div className="mb-1 text-base tracking-wide text-gray-500">Origin Port</div>
                <div className="text-base text-gray-900">Port Arthur, USA</div>
              </div>
              <div>
                <div className="mb-1 text-base tracking-wide text-gray-500">Destination Port</div>
                <div className="text-base text-gray-900">Cartagena, CO</div>
              </div>
              <div>
                <div className="mb-1 text-base tracking-wide text-gray-500">Freight Forwarder</div>
                {step.id >= 3 ? (
                  <div className="text-base text-gray-900">BlueBridge Freight</div>
                ) : (
                  <div className="text-base font-semibold text-red-600">Unconfirmed</div>
                )}
              </div>
              <div>
                <div className="mb-1 text-base tracking-wide text-gray-500">Container Type</div>
                <div className="text-base text-gray-900">20 ft Standard</div>
              </div>
              <div>
                <div className="mb-1 text-base tracking-wide text-gray-500">Est. Delivery</div>
                <div className="text-base text-gray-900">22 Dec 2025</div>
              </div>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
