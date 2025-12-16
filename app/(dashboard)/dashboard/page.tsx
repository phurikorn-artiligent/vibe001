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

  // Get current time for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex-1 space-y-6 p-8 fade-in">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight gradient-text">
          {greeting}, Admin! 👋
        </h2>
        <p className="text-muted-foreground text-lg">
          Here's your asset overview for today
        </p>
      </div>

      {/* Stats Grid */}
      <Suspense fallback={<StatsSkeleton />}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div style={{ animationDelay: '0ms' }}>
            <StatCard
              title="Total Assets"
              value={stats?.totalAssets || 0}
              iconName="package"
              description="All registered assets"
              href="/assets"
            />
          </div>
          <div style={{ animationDelay: '100ms' }}>
            <StatCard
              title="Available"
              value={stats?.available || 0}
              iconName="check-circle"
              description="Ready for assignment"
              href="/assets?status=AVAILABLE"
              color="emerald"
            />
          </div>
          <div style={{ animationDelay: '200ms' }}>
            <StatCard
              title="In Use"
              value={stats?.inUse || 0}
              iconName="user"
              description="Currently assigned"
              href="/assets?status=IN_USE"
              color="blue"
            />
          </div>
          <div style={{ animationDelay: '300ms' }}>
            <StatCard
              title="Maintenance"
              value={stats?.maintenance || 0}
              iconName="wrench"
              description="Under repair"
              href="/assets?status=MAINTENANCE"
              color="amber"
            />
          </div>
        </div>
      </Suspense>

      {/* Recent Activity */}
      <div className="space-y-4 fade-in" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Recent Activity</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Latest asset transactions
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Last 10 transactions
          </div>
        </div>
        <Suspense fallback={<ActivitySkeleton />}>
          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <RecentActivity transactions={transactions as any} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="shimmer rounded-lg h-32" />
      ))}
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="shimmer h-16 rounded" />
      ))}
    </div>
  );
}
