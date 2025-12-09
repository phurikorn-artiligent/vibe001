"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Edit2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { deleteAssetType } from "@/app/actions/asset-types";
import { AssetTypeForm } from "./asset-type-form";

interface AssetType {
  id: number;
  name: string;
  description: string | null;
  _count: {
    assets: number;
  };
}

export function AssetTypeList({ data }: { data: AssetType[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<AssetType | null>(null);
  const [deletingType, setDeletingType] = useState<AssetType | null>(null);

  const handleAdd = () => {
    setEditingType(null);
    setIsFormOpen(true);
  };

  const handleEdit = (type: AssetType) => {
    setEditingType(type);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (type: AssetType) => {
      setDeletingType(type);
  }

  const handleConfirmDelete = async () => {
    if (!deletingType) return;
    
    const result = await deleteAssetType(deletingType.id);
    if (result.success) {
      toast.success("Asset type deleted");
    } else {
      toast.error(result.error);
    }
    setDeletingType(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Asset Types</h2>
        <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Type
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px] text-center">Assets</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No asset types found. Create one to get started.
                    </TableCell>
                </TableRow>
            ) : (
                data.map((type) => (
                    <TableRow key={type.id}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell className="text-muted-foreground">{type.description || "-"}</TableCell>
                        <TableCell className="text-center">
                            <Badge variant="secondary" className="rounded-full">
                                {type._count.assets}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEdit(type)}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                onClick={() => handleDeleteClick(type)}
                                disabled={type._count.assets > 0}
                                title={type._count.assets > 0 ? "Cannot delete type with associated assets" : "Delete"}
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

      <AssetTypeForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        assetType={editingType} 
      />

      <AlertDialog open={!!deletingType} onOpenChange={(open) => !open && setDeletingType(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the 
                    <span className="font-semibold text-foreground"> "{deletingType?.name}" </span>
                    category.
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
