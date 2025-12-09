"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type AssetTypeState = {
  success: boolean;
  error?: string;
  data?: any;
};

export async function getAssetTypes() {
  try {
    const types = await prisma.assetType.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { assets: true },
        },
      },
    });
    return { success: true, data: types };
  } catch (error) {
    console.error("Failed to fetch asset types:", error);
    return { success: false, error: "Failed to fetch asset types" };
  }
}

export async function createAssetType(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) {
    return { success: false, error: "Name is required" };
  }

  try {
    await prisma.assetType.create({
      data: {
        name,
        description,
      },
    });
    revalidatePath("/settings/asset-types");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "Asset type with this name already exists" };
    }
    console.error("Failed to create asset type:", error);
    return { success: false, error: "Failed to create asset type" };
  }
}

export async function updateAssetType(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) {
    return { success: false, error: "Name is required" };
  }

  try {
    await prisma.assetType.update({
      where: { id },
      data: {
        name,
        description,
      },
    });
    revalidatePath("/settings/asset-types");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "Asset type with this name already exists" };
    }
    console.error("Failed to update asset type:", error);
    return { success: false, error: "Failed to update asset type" };
  }
}

export async function deleteAssetType(id: number) {
  try {
    // Check for existing assets first (Server-side validation)
    const type = await prisma.assetType.findUnique({
      where: { id },
      include: { _count: { select: { assets: true } } },
    });

    if (type && type._count.assets > 0) {
      return { success: false, error: "Cannot delete asset type heavily used by assets." };
    }

    await prisma.assetType.delete({
      where: { id },
    });
    revalidatePath("/settings/asset-types");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete asset type:", error);
    return { success: false, error: "Failed to delete asset type" };
  }
}
