import { Suspense } from "react";
import { getAvailableAssets, getAssetsInUse } from "@/app/actions/operations";
import { getEmployees } from "@/app/actions/employees";
import { CheckOutForm } from "@/components/operations/checkout-form";
import { CheckInForm } from "@/components/operations/checkin-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = 'force-dynamic';

export default async function OperationsPage() {
  const [availableAssetsRes, assetsInUseRes, employeesRes] = await Promise.all([
    getAvailableAssets(),
    getAssetsInUse(),
    getEmployees()
  ]);

  const availableAssets = availableAssetsRes.success ? availableAssetsRes.data : [];
  const assetsInUse = assetsInUseRes.success ? assetsInUseRes.data : [];
  const employees = employeesRes.success ? employeesRes.data : [];

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Operations</h2>
          <p className="text-muted-foreground">Manage asset assignments and returns</p>
        </div>
      </div>
      
      <Suspense fallback={<OperationsSkeleton />}>
        <Tabs defaultValue="checkout" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="checkout">Check-out</TabsTrigger>
            <TabsTrigger value="checkin">Check-in</TabsTrigger>
          </TabsList>
          
          <TabsContent value="checkout" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <CheckOutForm 
                availableAssets={availableAssets || []} 
                employees={employees || []} 
              />
              <div className="rounded-lg border p-6 bg-muted/50">
                <h3 className="font-semibold mb-2">Available Assets</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {availableAssets?.length || 0} asset(s) ready for assignment
                </p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availableAssets && availableAssets.length > 0 ? (
                    availableAssets.map((asset: any) => (
                      <div key={asset.id} className="flex justify-between items-center p-2 rounded bg-background">
                        <div>
                          <p className="font-medium text-sm">{asset.code}</p>
                          <p className="text-xs text-muted-foreground">{asset.name}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700">
                          {asset.type.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No available assets</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="checkin" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <CheckInForm assetsInUse={assetsInUse || []} />
              <div className="rounded-lg border p-6 bg-muted/50">
                <h3 className="font-semibold mb-2">Assets In Use</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {assetsInUse?.length || 0} asset(s) currently assigned
                </p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {assetsInUse && assetsInUse.length > 0 ? (
                    assetsInUse.map((asset: any) => (
                      <div key={asset.id} className="flex justify-between items-start p-2 rounded bg-background">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{asset.code}</p>
                          <p className="text-xs text-muted-foreground">{asset.name}</p>
                          {asset.transactions[0]?.employee && (
                            <p className="text-xs text-blue-600 mt-1">
                              Held by: {asset.transactions[0].employee.firstName} {asset.transactions[0].employee.lastName}
                            </p>
                          )}
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                          {asset.type.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No assets in use</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  );
}

function OperationsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}
