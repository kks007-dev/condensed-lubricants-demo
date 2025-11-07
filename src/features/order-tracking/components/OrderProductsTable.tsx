 import Skeleton from "@/components/common/Skeleton";

type OrderProductsTableProps = {
  strikePallets: boolean;
  stepId: number;
  loading?: boolean;
};

export default function OrderProductsTable({ strikePallets, stepId, loading = false }: OrderProductsTableProps) {
  return (
    <section>
      <h2 className="mb-2 font-semibold">Products</h2>
      <div className="overflow-hidden rounded-md border">
        {loading ? (
          <div className="space-y-2 p-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-[92%]" />
            <Skeleton className="h-6 w-[88%]" />
          </div>
        ) : (
          <table className="w-full text-base">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-2">Code</th>
                <th className="p-2">Product</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Packaging</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-2">2048414</td>
                <td className="p-2">Premium Hydraulic Oil ISO VG 32</td>
                <td className="p-2">20 drums</td>
                <td className="p-2">Steel</td>
              </tr>
              <tr className={stepId === 2 ? "bg-red-50" : ""}>
                <td className="p-2">2048415</td>
                <td className="p-2">FleetGuard 15W-40</td>
                <td className="p-2">{strikePallets ? "4 pallets" : "1 pallet"}</td>
                <td className="p-2">Plastic</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
