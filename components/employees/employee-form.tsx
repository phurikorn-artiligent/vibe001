"use client";

import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createEmployee, updateEmployee } from "@/app/actions/employees";

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: any;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : isEditing ? "Save Changes" : "Create Employee"}
    </Button>
  );
}

export function EmployeeForm({ open, onOpenChange, employee }: EmployeeFormProps) {
  const isEditing = !!employee;

  async function clientAction(formData: FormData) {
    const result = isEditing 
        ? await updateEmployee(employee.id, formData)
        : await createEmployee(formData);

    if (result.success) {
      toast.success(isEditing ? "Employee updated" : "Employee created");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Operation failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          <DialogDescription>
            Enter the employee details below.
          </DialogDescription>
        </DialogHeader>
        
        <form action={clientAction} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                    id="firstName" 
                    name="firstName" 
                    placeholder="John" 
                    defaultValue={employee?.firstName} 
                    required 
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                    id="lastName" 
                    name="lastName" 
                    placeholder="Doe"
                    defaultValue={employee?.lastName} 
                    required 
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
                id="email" 
                name="email" 
                type="email"
                placeholder="john.doe@example.com" 
                defaultValue={employee?.email}
                required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input 
                id="department" 
                name="department" 
                placeholder="IT, HR, Finance..."
                defaultValue={employee?.department} 
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <SubmitButton isEditing={isEditing} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
