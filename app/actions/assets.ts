"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AssetStatus } from "@prisma/client";

export type AssetState = {
  success: boolean;
  error?: string;
  data?: any;
};


// Hello world
// --- READ ---

export async function getAssets(query?: string, status?: AssetStatus, typeId?: number) {
  try {
    const where: any = {};

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { code: { contains: query, mode: "insensitive" } },
        { serialNumber: { contains: query, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (typeId) {
      where.typeId = typeId;
    }

    const assets = await prisma.asset.findMany({
      where,
      include: {
        type: true,
        transactions: {
          orderBy: { date: 'desc' },
          take: 1,
          include: { employee: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    // Convert Decimals to numbers/strings for client serialization
    const safeAssets = assets.map(asset => ({
      ...asset,
      price: asset.price ? Number(asset.price) : null
    }));

    return { success: true, data: safeAssets };
  } catch (error) {
    console.error("Failed to fetch assets:", error);
    return { success: false, error: "Failed to fetch assets" };
  }
}

export async function getAssetById(id: number) {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        type: true,
        transactions: {
          include: { employee: true },
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!asset) return { success: false, error: "Asset not found" };

    const safeAsset = {
      ...asset,
      price: asset.price ? Number(asset.price) : null
    };

    return { success: true, data: safeAsset };
  } catch (error) {
    return { success: false, error: "Failed to fetch asset details" };
  }
}

// --- CREATE ---

export async function createAsset(formData: FormData) {
  const code = formData.get("code") as string;
  const name = formData.get("name") as string;
  const typeId = parseInt(formData.get("typeId") as string);
  const serialNumber = formData.get("serialNumber") as string;
  const price = formData.get("price") ? parseFloat(formData.get("price") as string) : null;
  const purchaseDate = formData.get("purchaseDate") ? new Date(formData.get("purchaseDate") as string) : null;
  // Status is default AVAILABLE

  if (!code || !name || !typeId) {
    return { success: false, error: "Missing required fields (Code, Name, Type)" };
  }

  try {
    const asset = await prisma.asset.create({
      data: {
        code,
        name,
        typeId,
        serialNumber,
        price,
        purchaseDate,
        status: AssetStatus.AVAILABLE,
      },
    });

    revalidatePath("/assets");
    return { success: true, data: asset };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: `Asset with code '${code}' already exists.` };
    }
    console.error("Failed to create asset:", error);
    return { success: false, error: "Failed to create asset" };
  }
}

// --- UPDATE ---

export async function updateAsset(id: number, formData: FormData) {
  const code = formData.get("code") as string;
  const name = formData.get("name") as string;
  const typeId = parseInt(formData.get("typeId") as string);
  const serialNumber = formData.get("serialNumber") as string;
  const price = formData.get("price") ? parseFloat(formData.get("price") as string) : null;
  const purchaseDate = formData.get("purchaseDate") ? new Date(formData.get("purchaseDate") as string) : null;

  if (!code || !name || !typeId) {
    return { success: false, error: "Missing required fields (Code, Name, Type)" };
  }

  try {
    await prisma.asset.update({
      where: { id },
      data: {
        code,
        name,
        typeId,
        serialNumber,
        price,
        purchaseDate,
      },
    });

    revalidatePath("/assets");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: `Asset with code '${code}' already exists.` };
    }
    console.error("Failed to update asset:", error);
    return { success: false, error: "Failed to update asset" };
  }
}

// --- DELETE ---

export async function deleteAsset(id: number) {
  try {
    await prisma.asset.delete({ where: { id } });
    revalidatePath("/assets");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete asset" };
  }
}
