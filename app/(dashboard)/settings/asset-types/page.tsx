import { Suspense } from "react";
import { getAssetTypes } from "@/app/actions/asset-types";
import { AssetTypeList } from "@/components/assets/asset-type-list";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = 'force-dynamic';

export default async function AssetTypesPage() {
  const { data: assetTypes } = await getAssetTypes();

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<AssetTypesSkeleton />}>
            <AssetTypeList data={assetTypes || []} />
        </Suspense>
      </div>
    </div>
  );
}

function AssetTypesSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-28" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
}
