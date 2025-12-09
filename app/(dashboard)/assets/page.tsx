import { Suspense } from "react";
import { AssetStatus } from "@prisma/client";
import { getAssets } from "@/app/actions/assets";
import { getAssetTypes } from "@/app/actions/asset-types";
import { AssetTable } from "@/components/assets/asset-table";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = 'force-dynamic';

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string };
}) {
  const query = searchParams.q || "";
  const status = searchParams.status as AssetStatus | undefined;

  // Parallel data fetching
  const [assetsRes, typesRes] = await Promise.all([
    getAssets(query, status),
    getAssetTypes()
  ]);

  const assets = assetsRes.success ? assetsRes.data : [];
  const assetTypes = typesRes.success ? typesRes.data : [];

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Asset Inventory</h2>
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<AssetsSkeleton />}>
            <AssetTable 
                data={assets as any[]} // Type casting for ease with simple table props
                assetTypes={assetTypes || []} 
            />
        </Suspense>
      </div>
    </div>
  );
}

function AssetsSkeleton() {
    return (
        <div className="space-y-4">
             <div className="flex justify-between">
                <Skeleton className="h-10 w-[300px]" />
                <Skeleton className="h-10 w-[120px]" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
}
