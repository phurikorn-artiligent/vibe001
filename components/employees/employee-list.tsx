"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Edit2, Trash2, Plus, Mail, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteEmployee } from "@/app/actions/employees";
import { EmployeeForm } from "./employee-form";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string | null;
  _count: {
    transactions: number;
  };
}

export function EmployeeList({ data }: { data: Employee[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const handleAdd = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingEmployee) return;
    
    const result = await deleteEmployee(deletingEmployee.id);
    if (result.success) {
      toast.success("Employee deleted");
    } else {
      toast.error(result.error);
    }
    setDeletingEmployee(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Employees</h2>
        <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="w-[100px] text-center">Transactions</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No employees found. Add one to get started.
                    </TableCell>
                </TableRow>
            ) : (
                data.map((employee) => (
                    <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                            {employee.firstName} {employee.lastName}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {employee.email}
                            </div>
                        </TableCell>
                        <TableCell>
                            {employee.department ? (
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-3 w-3 text-muted-foreground" />
                                    {employee.department}
                                </div>
                            ) : (
                                <span className="text-muted-foreground">-</span>
                            )}
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge variant="secondary" className="rounded-full">
                                {employee._count.transactions}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEdit(employee)}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                onClick={() => setDeletingEmployee(employee)}
                                disabled={employee._count.transactions > 0}
                                title={employee._count.transactions > 0 ? "Cannot delete employee with transaction history" : "Delete"}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      <EmployeeForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        employee={editingEmployee} 
      />

      <AlertDialog open={!!deletingEmployee} onOpenChange={(open) => !open && setDeletingEmployee(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete 
                    <span className="font-semibold text-foreground"> {deletingEmployee?.firstName} {deletingEmployee?.lastName}</span>.
                    This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
