"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type EmployeeState = {
  success: boolean;
  error?: string;
  data?: any;
};

export async function getEmployees() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { lastName: "asc" },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });
    return { success: true, data: employees };
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    return { success: false, error: "Failed to fetch employees" };
  }
}

export async function getEmployeeById(id: number) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        transactions: {
          include: { asset: { include: { type: true } } },
          orderBy: { date: 'desc' }
        }
      }
    });
    return { success: true, data: employee };
  } catch (error) {
    return { success: false, error: "Failed to fetch employee details" };
  }
}

export async function createEmployee(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const department = formData.get("department") as string;

  if (!firstName || !lastName || !email) {
    return { success: false, error: "First name, last name, and email are required" };
  }

  try {
    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        department,
      },
    });

    revalidatePath("/employees");
    return { success: true, data: employee };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: `Employee with email '${email}' already exists.` };
    }
    console.error("Failed to create employee:", error);
    return { success: false, error: "Failed to create employee" };
  }
}

export async function updateEmployee(id: number, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const department = formData.get("department") as string;

  if (!firstName || !lastName || !email) {
    return { success: false, error: "First name, last name, and email are required" };
  }

  try {
    await prisma.employee.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        department,
      },
    });

    revalidatePath("/employees");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: `Employee with email '${email}' already exists.` };
    }
    console.error("Failed to update employee:", error);
    return { success: false, error: "Failed to update employee" };
  }
}

export async function deleteEmployee(id: number) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { _count: { select: { transactions: true } } },
    });

    if (employee && employee._count.transactions > 0) {
      return { success: false, error: "Cannot delete employee with transaction history." };
    }

    await prisma.employee.delete({ where: { id } });
    revalidatePath("/employees");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete employee" };
  }
}
