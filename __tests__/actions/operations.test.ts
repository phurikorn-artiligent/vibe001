import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkOutAsset, checkInAsset, getAvailableAssets, getAssetsInUse } from '@/app/actions/operations'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    $transaction: vi.fn(),
    asset: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    transaction: {
      create: vi.fn(),
    },
  },
}))

// Mock Next.js revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

describe('Operations Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('checkOutAsset', () => {
    it('should successfully check out an available asset', async () => {
      const formData = new FormData()
      formData.append('assetId', '1')
      formData.append('employeeId', '1')
      formData.append('date', '2025-12-09')
      formData.append('notes', 'Test checkout')

      // Mock transaction callback
      vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
        const mockTx = {
          asset: {
            findUnique: vi.fn().mockResolvedValue({
              id: 1,
              status: 'AVAILABLE',
            }),
            update: vi.fn().mockResolvedValue({}),
          },
          transaction: {
            create: vi.fn().mockResolvedValue({}),
          },
        }
        return callback(mockTx)
      })

      const result = await checkOutAsset(formData)

      expect(result.success).toBe(true)
      expect(revalidatePath).toHaveBeenCalledWith('/operations')
      expect(revalidatePath).toHaveBeenCalledWith('/assets')
    })

    it('should fail if asset is not available', async () => {
      const formData = new FormData()
      formData.append('assetId', '1')
      formData.append('employeeId', '1')

      vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
        const mockTx = {
          asset: {
            findUnique: vi.fn().mockResolvedValue({
              id: 1,
              status: 'IN_USE',
            }),
          },
        }
        return callback(mockTx)
      })

      const result = await checkOutAsset(formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('not available')
    })

    it('should require assetId and employeeId', async () => {
      const formData = new FormData()
      formData.append('assetId', '1')

      const result = await checkOutAsset(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Asset and Employee are required')
    })
  })

  describe('checkInAsset', () => {
    it('should successfully check in an asset in use', async () => {
      const formData = new FormData()
      formData.append('assetId', '1')
      formData.append('employeeId', '1')
      formData.append('newStatus', 'AVAILABLE')
      formData.append('date', '2025-12-09')
      formData.append('notes', 'Good condition')

      vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
        const mockTx = {
          asset: {
            findUnique: vi.fn().mockResolvedValue({
              id: 1,
              status: 'IN_USE',
            }),
            update: vi.fn().mockResolvedValue({}),
          },
          transaction: {
            create: vi.fn().mockResolvedValue({}),
          },
        }
        return callback(mockTx)
      })

      const result = await checkInAsset(formData)

      expect(result.success).toBe(true)
      expect(revalidatePath).toHaveBeenCalledWith('/operations')
      expect(revalidatePath).toHaveBeenCalledWith('/assets')
    })

    it('should fail if asset is not in use', async () => {
      const formData = new FormData()
      formData.append('assetId', '1')
      formData.append('employeeId', '1')
      formData.append('newStatus', 'AVAILABLE')

      vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
        const mockTx = {
          asset: {
            findUnique: vi.fn().mockResolvedValue({
              id: 1,
              status: 'AVAILABLE',
            }),
          },
        }
        return callback(mockTx)
      })

      const result = await checkInAsset(formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('not currently in use')
    })

    it('should require all fields', async () => {
      const formData = new FormData()
      formData.append('assetId', '1')

      const result = await checkInAsset(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Asset, Employee, and New Status are required')
    })
  })

  describe('getAvailableAssets', () => {
    it('should return only available assets', async () => {
      const mockAssets = [
        {
          id: 1,
          code: 'LAP-001',
          name: 'MacBook Pro',
          status: 'AVAILABLE',
          price: 1200,
          type: { id: 1, name: 'Laptop' },
        },
      ]

      vi.mocked(prisma.asset.findMany).mockResolvedValue(mockAssets as any)

      const result = await getAvailableAssets()

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(result.data?.[0].price).toBe(1200) // Converted to number
      expect(prisma.asset.findMany).toHaveBeenCalledWith({
        where: { status: 'AVAILABLE' },
        include: { type: true },
        orderBy: { code: 'asc' },
      })
    })
  })

  describe('getAssetsInUse', () => {
    it('should return assets in use with holder info', async () => {
      const mockAssets = [
        {
          id: 1,
          code: 'LAP-001',
          status: 'IN_USE',
          price: 1200,
          type: { id: 1, name: 'Laptop' },
          transactions: [
            {
              action: 'CHECK_OUT',
              employee: { firstName: 'John', lastName: 'Doe' },
            },
          ],
        },
      ]

      vi.mocked(prisma.asset.findMany).mockResolvedValue(mockAssets as any)

      const result = await getAssetsInUse()

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(prisma.asset.findMany).toHaveBeenCalledWith({
        where: { status: 'IN_USE' },
        include: {
          type: true,
          transactions: {
            where: { action: 'CHECK_OUT' },
            orderBy: { date: 'desc' },
            take: 1,
            include: { employee: true },
          },
        },
        orderBy: { code: 'asc' },
      })
    })
  })
})
