"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type OperationState = {
  success: boolean;
  error?: string;
  data?: any;
};

// Check-out: Assign asset to employee
export async function checkOutAsset(formData: FormData) {
  const assetId = parseInt(formData.get("assetId") as string);
  const employeeId = parseInt(formData.get("employeeId") as string);
  const date = formData.get("date") ? new Date(formData.get("date") as string) : new Date();
  const notes = formData.get("notes") as string;

  if (!assetId || !employeeId) {
    return { success: false, error: "Asset and Employee are required" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.findUnique({ where: { id: assetId } });

      if (!asset) {
        throw new Error("Asset not found");
      }

      if (asset.status !== "AVAILABLE") {
        throw new Error("Asset is not available for checkout");
      }

      await tx.asset.update({
        where: { id: assetId },
        data: { status: "IN_USE" },
      });

      await tx.transaction.create({
        data: {
          assetId,
          employeeId,
          action: "CHECK_OUT",
          date,
          notes,
        },
      });
    });

    revalidatePath("/operations");
    revalidatePath("/assets");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to check out asset:", error);
    return { success: false, error: error.message || "Failed to check out asset" };
  }
}

// Check-in: Return asset
export async function checkInAsset(formData: FormData) {
  const assetId = parseInt(formData.get("assetId") as string);
  const employeeId = parseInt(formData.get("employeeId") as string);
  const newStatus = formData.get("newStatus") as string;
  const date = formData.get("date") ? new Date(formData.get("date") as string) : new Date();
  const notes = formData.get("notes") as string;

  if (!assetId || !employeeId || !newStatus) {
    return { success: false, error: "Asset, Employee, and New Status are required" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.findUnique({ where: { id: assetId } });

      if (!asset) {
        throw new Error("Asset not found");
      }

      if (asset.status !== "IN_USE") {
        throw new Error("Asset is not currently in use");
      }

      await tx.asset.update({
        where: { id: assetId },
        data: { status: newStatus as any },
      });

      await tx.transaction.create({
        data: {
          assetId,
          employeeId,
          action: "CHECK_IN",
          date,
          notes,
        },
      });
    });

    revalidatePath("/operations");
    revalidatePath("/assets");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to check in asset:", error);
    return { success: false, error: error.message || "Failed to check in asset" };
  }
}

// Get available assets for checkout
export async function getAvailableAssets() {
  try {
    const assets = await prisma.asset.findMany({
      where: { status: "AVAILABLE" },
      include: { type: true },
      orderBy: { code: "asc" },
    });

    const safeAssets = assets.map(asset => ({
      ...asset,
      price: asset.price ? Number(asset.price) : null
    }));

    return { success: true, data: safeAssets };
  } catch (error) {
    return { success: false, error: "Failed to fetch available assets" };
  }
}

// Get assets in use for check-in
export async function getAssetsInUse() {
  try {
    const assets = await prisma.asset.findMany({
      where: { status: "IN_USE" },
      include: {
        type: true,
        transactions: {
          where: { action: "CHECK_OUT" },
          orderBy: { date: "desc" },
          take: 1,
          include: { employee: true }
        }
      },
      orderBy: { code: "asc" },
    });

    const safeAssets = assets.map(asset => ({
      ...asset,
      price: asset.price ? Number(asset.price) : null
    }));

    return { success: true, data: safeAssets };
  } catch (error) {
    return { success: false, error: "Failed to fetch assets in use" };
  }
}
