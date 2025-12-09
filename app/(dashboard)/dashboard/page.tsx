import { Suspense } from "react";
import { getDashboardStats, getRecentTransactions } from "@/app/actions/dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [statsRes, transactionsRes] = await Promise.all([
    getDashboardStats(),
    getRecentTransactions(10)
  ]);

  const stats = statsRes.success ? statsRes.data : {
    totalAssets: 0,
    available: 0,
    inUse: 0,
    maintenance: 0,
  };

  const transactions = transactionsRes.success ? transactionsRes.data : [];

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to the Fixed Asset Management System
          </p>
        </div>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Assets"
            value={stats?.totalAssets || 0}
            iconName="package"
            description="All registered assets"
            href="/assets"
          />
          <StatCard
            title="Available"
            value={stats?.available || 0}
            iconName="check-circle"
            description="Ready for assignment"
            href="/assets?status=AVAILABLE"
            color="emerald"
          />
          <StatCard
            title="In Use"
            value={stats?.inUse || 0}
            iconName="user"
            description="Currently assigned"
            href="/assets?status=IN_USE"
            color="blue"
          />
          <StatCard
            title="Maintenance"
            value={stats?.maintenance || 0}
            iconName="wrench"
            description="Under repair"
            href="/assets?status=MAINTENANCE"
            color="amber"
          />
        </div>
      </Suspense>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">
            Last 10 transactions
          </p>
        </div>
        <Suspense fallback={<ActivitySkeleton />}>
          <RecentActivity transactions={transactions as any} />
        </Suspense>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
