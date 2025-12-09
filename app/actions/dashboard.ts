"use server";

import prisma from "@/lib/prisma";

export type DashboardStats = {
  totalAssets: number;
  available: number;
  inUse: number;
  maintenance: number;
};

export async function getDashboardStats() {
  try {
    const [totalAssets, available, inUse, maintenance] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: "AVAILABLE" } }),
      prisma.asset.count({ where: { status: "IN_USE" } }),
      prisma.asset.count({ where: { status: "MAINTENANCE" } }),
    ]);

    return {
      success: true,
      data: {
        totalAssets,
        available,
        inUse,
        maintenance,
      },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard stats" };
  }
}

export async function getRecentTransactions(limit: number = 10) {
  try {
    const transactions = await prisma.transaction.findMany({
      take: limit,
      orderBy: { date: "desc" },
      include: {
        asset: {
          include: { type: true },
        },
        employee: true,
      },
    });

    return { success: true, data: transactions };
  } catch (error) {
    console.error("Failed to fetch recent transactions:", error);
    return { success: false, error: "Failed to fetch recent transactions" };
  }
}
