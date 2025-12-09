"use client";

import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checkOutAsset } from "@/app/actions/operations";
import { useRouter } from "next/navigation";

interface CheckOutFormProps {
  availableAssets: any[];
  employees: any[];
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Processing..." : "Confirm Assignment"}
    </Button>
  );
}

export function CheckOutForm({ availableAssets, employees }: CheckOutFormProps) {
  const router = useRouter();

  async function clientAction(formData: FormData) {
    const result = await checkOutAsset(formData);

    if (result.success) {
      toast.success("Asset checked out successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to check out asset");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check-out Asset</CardTitle>
        <CardDescription>
          Assign an available asset to an employee
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={clientAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assetId">Select Asset *</Label>
            <Select name="assetId" required>
              <SelectTrigger>
                <SelectValue placeholder="Choose an available asset" />
              </SelectTrigger>
              <SelectContent>
                {availableAssets.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No available assets
                  </div>
                ) : (
                  availableAssets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id.toString()}>
                      {asset.code} - {asset.name} ({asset.type.name})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeId">Select Employee *</Label>
            <Select name="employeeId" required>
              <SelectTrigger>
                <SelectValue placeholder="Choose an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No employees found
                  </div>
                ) : (
                  employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.firstName} {employee.lastName} ({employee.email})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Assignment Date</Label>
            <Input 
              id="date" 
              name="date" 
              type="date" 
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
