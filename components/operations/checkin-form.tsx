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
import { Badge } from "@/components/ui/badge";
import { checkInAsset } from "@/app/actions/operations";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CheckInFormProps {
  assetsInUse: any[];
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Processing..." : "Confirm Return"}
    </Button>
  );
}

export function CheckInForm({ assetsInUse }: CheckInFormProps) {
  const router = useRouter();
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  async function clientAction(formData: FormData) {
    const result = await checkInAsset(formData);

    if (result.success) {
      toast.success("Asset checked in successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to check in asset");
    }
  }

  const handleAssetChange = (assetId: string) => {
    const asset = assetsInUse.find(a => a.id.toString() === assetId);
    setSelectedAsset(asset);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check-in Asset</CardTitle>
        <CardDescription>
          Return an asset and update its status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={clientAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assetId">Select Asset *</Label>
            <Select name="assetId" required onValueChange={handleAssetChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an asset in use" />
              </SelectTrigger>
              <SelectContent>
                {assetsInUse.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No assets currently in use
                  </div>
                ) : (
                  assetsInUse.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id.toString()}>
                      {asset.code} - {asset.name} 
                      {asset.transactions[0]?.employee && (
                        <span className="text-muted-foreground ml-2">
                          (Held by: {asset.transactions[0].employee.firstName} {asset.transactions[0].employee.lastName})
                        </span>
                      )}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedAsset && selectedAsset.transactions[0]?.employee && (
            <>
              <input 
                type="hidden" 
                name="employeeId" 
                value={selectedAsset.transactions[0].employee.id} 
              />
              <div className="rounded-lg border p-3 bg-muted/50">
                <div className="text-sm">
                  <span className="text-muted-foreground">Current Holder:</span>
                  <span className="ml-2 font-medium">
                    {selectedAsset.transactions[0].employee.firstName} {selectedAsset.transactions[0].employee.lastName}
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="newStatus">New Status *</Label>
            <Select name="newStatus" required>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Available</Badge>
                    <span className="text-xs text-muted-foreground">Ready for use</span>
                  </div>
                </SelectItem>
                <SelectItem value="MAINTENANCE">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Maintenance</Badge>
                    <span className="text-xs text-muted-foreground">Needs repair</span>
                  </div>
                </SelectItem>
                <SelectItem value="RETIRED">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Retired</Badge>
                    <span className="text-xs text-muted-foreground">No longer in service</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Return Date</Label>
            <Input 
              id="date" 
              name="date" 
              type="date" 
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Condition / Notes</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              placeholder="Describe the condition of the asset..."
              rows={3}
            />
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
