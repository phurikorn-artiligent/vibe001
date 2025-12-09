"use client";

import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface Transaction {
  id: number;
  action: string;
  date: Date;
  notes: string | null;
  asset: {
    code: string;
    name: string;
    type: {
      name: string;
    };
  };
  employee: {
    firstName: string;
    lastName: string;
  };
}

interface RecentActivityProps {
  transactions: Transaction[];
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Action</TableHead>
            <TableHead>Asset</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No recent activity
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {transaction.action === "CHECK_OUT" ? (
                    <Badge variant="default" className="gap-1">
                      <ArrowUpCircle className="h-3 w-3" />
                      Out
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <ArrowDownCircle className="h-3 w-3" />
                      In
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{transaction.asset.code}</p>
                    <p className="text-xs text-muted-foreground">{transaction.asset.name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {transaction.employee.firstName} {transaction.employee.lastName}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{transaction.asset.type.name}</Badge>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
