"use client";

import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { AssetType } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAsset, updateAsset } from "@/app/actions/assets";

interface AssetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: any; // Avoiding full type for simplicity in this file, or import from Prisma
  assetTypes: AssetType[];
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : isEditing ? "Save Changes" : "Create Asset"}
    </Button>
  );
}

export function AssetForm({ open, onOpenChange, asset, assetTypes }: AssetFormProps) {
  const isEditing = !!asset;

  async function clientAction(formData: FormData) {
    const result = isEditing 
        ? await updateAsset(asset.id, formData)
        : await createAsset(formData);

    if (result.success) {
      toast.success(isEditing ? "Asset updated" : "Asset created");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Operation failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Asset" : "Register New Asset"}</DialogTitle>
          <DialogDescription>
            Enter the details of the asset below.
          </DialogDescription>
        </DialogHeader>
        
        <form action={clientAction} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="code">Asset Code *</Label>
                <Input 
                    id="code" 
                    name="code" 
                    placeholder="AST-001" 
                    defaultValue={asset?.code} 
                    required 
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input 
                    id="serialNumber" 
                    name="serialNumber" 
                    placeholder="SN-12345"
                    defaultValue={asset?.serialNumber} 
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Asset Name *</Label>
            <Input 
                id="name" 
                name="name" 
                placeholder="MacBook Pro M1" 
                defaultValue={asset?.name}
                required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="typeId">Asset Type *</Label>
                <Select name="typeId" defaultValue={asset?.typeId?.toString()} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        {assetTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                                {type.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00"
                    defaultValue={asset?.price} 
                />
             </div>
          </div>
          
           <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input 
                    id="purchaseDate" 
                    name="purchaseDate" 
                    type="date" 
                    defaultValue={asset?.purchaseDate ? new Date(asset.purchaseDate).toISOString().split('T')[0] : ''} 
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
