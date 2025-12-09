"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createAssetType, updateAssetType } from "@/app/actions/asset-types";

interface AssetTypeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetType?: {
    id: number;
    name: string;
    description: string | null;
  } | null;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : isEditing ? "Save Changes" : "Create Type"}
    </Button>
  );
}

export function AssetTypeForm({ open, onOpenChange, assetType }: AssetTypeFormProps) {    
  const isEditing = !!assetType;

  async function clientAction(formData: FormData) {
    const result = isEditing 
        ? await updateAssetType(assetType!.id, formData)
        : await createAssetType(formData);

    if (result.success) {
      toast.success(isEditing ? "Asset type updated" : "Asset type created");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Asset Type" : "New Asset Type"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of the asset category."
              : "Create a new category for classifying assets."}
          </DialogDescription>
        </DialogHeader>
        
        <form action={clientAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
                id="name" 
                name="name" 
                placeholder="e.g. Laptop, Monitor" 
                defaultValue={assetType?.name}
                required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
                id="description" 
                name="description" 
                placeholder="Optional description..."
                defaultValue={assetType?.description || ""} 
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
