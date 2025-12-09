"use client";

import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import { AssetStatus, AssetType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { deleteAsset } from "@/app/actions/assets";
import { AssetForm } from "./asset-form";
import { useRouter, useSearchParams } from "next/navigation";

// Define a type that matches the return of getAssets
interface AssetWithRelations {
  id: number;
  code: string;
  name: string;
  serialNumber: string | null;
  status: AssetStatus;
  typeId: number;
  price: any; // Decimal
  purchaseDate: Date | null;
  type: AssetType;
  transactions: any[];
}

interface AssetTableProps {
    data: AssetWithRelations[];
    assetTypes: AssetType[];
}

const statusColors: Record<AssetStatus, "default" | "secondary" | "destructive" | "outline"> = {
    AVAILABLE: "default", // emerald in customization? using default for now or I can classes
    IN_USE: "secondary",
    MAINTENANCE: "destructive", // amber? using destructive for warn/error
    RETIRED: "outline"
};

const statusLabels: Record<AssetStatus, string> = {
    AVAILABLE: "Available",
    IN_USE: "In Use",
    MAINTENANCE: "Maintenance",
    RETIRED: "Retired"
};


export function AssetTable({ data, assetTypes }: AssetTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetWithRelations | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<AssetWithRelations | null>(null);

  // Search/Filter State
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set("q", term);
    else params.delete("q");
    router.replace(`/assets?${params.toString()}`);
  }

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== "ALL") params.set("status", status);
    else params.delete("status");
    router.replace(`/assets?${params.toString()}`);
  }

  const handleAdd = () => {
    setEditingAsset(null);
    setIsFormOpen(true);
  };

  const handleEdit = (asset: AssetWithRelations) => {
    setEditingAsset(asset);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAsset) return;
    
    const result = await deleteAsset(deletingAsset.id);
    if (result.success) {
      toast.success("Asset deleted");
    } else {
      toast.error(result.error);
    }
    setDeletingAsset(null);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 items-center flex-1">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, code, serial..."
                    className="pl-8"
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get("q") || ""}
                />
            </div>
            <Select onValueChange={handleStatusFilter} defaultValue={searchParams.get("status") || "ALL"}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    {Object.keys(statusLabels).map(s => (
                        <SelectItem key={s} value={s}>{statusLabels[s as AssetStatus]}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            New Asset
          </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Serial No.</TableHead>
              <TableHead>Holder</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        No assets found.
                    </TableCell>
                </TableRow>
            ) : (
                data.map((asset) => (
                    <TableRow key={asset.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium font-mono">{asset.code}</TableCell>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{asset.type.name}</TableCell>
                        <TableCell>
                            <Badge variant={statusColors[asset.status]}>
                                {statusLabels[asset.status]}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{asset.serialNumber || "-"}</TableCell>
                        <TableCell>
                             {/* Logic to show current holder if In Use */}
                             {asset.status === 'IN_USE' && asset.transactions[0]?.employee ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                        {asset.transactions[0].employee.firstName} {asset.transactions[0].employee.lastName}
                                    </span>
                                </div>
                             ) : (
                                <span className="text-muted-foreground">-</span>
                             )}
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleEdit(asset)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                    onClick={() => setDeletingAsset(asset)}
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

      <AssetForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        asset={editingAsset}
        assetTypes={assetTypes}
      />

      <AlertDialog open={!!deletingAsset} onOpenChange={(open) => !open && setDeletingAsset(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete asset <span className="font-bold">{deletingAsset?.code}</span>. 
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
