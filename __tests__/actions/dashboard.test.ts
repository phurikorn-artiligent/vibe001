import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getDashboardStats, getRecentTransactions } from '@/app/actions/dashboard'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    asset: {
      count: vi.fn(),
    },
    transaction: {
      findMany: vi.fn(),
    },
  },
}))

import prisma from '@/lib/prisma'

describe('Dashboard Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getDashboardStats', () => {
    it('should return asset statistics', async () => {
      // Mock the count calls
      vi.mocked(prisma.asset.count)
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(50)  // available
        .mockResolvedValueOnce(30)  // in use
        .mockResolvedValueOnce(10)  // maintenance

      const result = await getDashboardStats()

      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        totalAssets: 100,
        available: 50,
        inUse: 30,
        maintenance: 10,
      })
    })

    it('should handle errors gracefully', async () => {
      vi.mocked(prisma.asset.count).mockRejectedValue(new Error('Database error'))

      const result = await getDashboardStats()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to fetch dashboard stats')
    })
  })

  describe('getRecentTransactions', () => {
    const mockTransactions = [
      {
        id: 1,
        action: 'CHECK_OUT',
        date: new Date('2025-12-09'),
        notes: null,
        assetId: 1,
        employeeId: 1,
        asset: {
          id: 1,
          code: 'LAP-001',
          name: 'MacBook Pro',
          type: { id: 1, name: 'Laptop', description: null },
        },
        employee: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          department: 'IT',
        },
      },
    ]

    it('should return recent transactions with default limit', async () => {
      vi.mocked(prisma.transaction.findMany).mockResolvedValue(mockTransactions as any)

      const result = await getRecentTransactions()

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockTransactions)
      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        take: 10,
        orderBy: { date: 'desc' },
        include: {
          asset: {
            include: { type: true },
          },
          employee: true,
        },
      })
    })

    it('should accept custom limit', async () => {
      vi.mocked(prisma.transaction.findMany).mockResolvedValue(mockTransactions as any)

      await getRecentTransactions(5)

      expect(prisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 5 })
      )
    })

    it('should handle errors gracefully', async () => {
      vi.mocked(prisma.transaction.findMany).mockRejectedValue(new Error('Database error'))

      const result = await getRecentTransactions()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to fetch recent transactions')
    })
  })
})
