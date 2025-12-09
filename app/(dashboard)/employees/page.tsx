import { Suspense } from "react";
import { getEmployees } from "@/app/actions/employees";
import { EmployeeList } from "@/components/employees/employee-list";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = 'force-dynamic';

export default async function EmployeesPage() {
  const { data: employees } = await getEmployees();

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<EmployeesSkeleton />}>
            <EmployeeList data={employees || []} />
        </Suspense>
      </div>
    </div>
  );
}

function EmployeesSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
}
