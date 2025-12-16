import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getAssetTypes,
  createAssetType,
  updateAssetType,
  deleteAssetType,
} from '@/app/actions/asset-types'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    assetType: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

// Mock Next.js revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

describe('Asset Type Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAssetTypes', () => {
    it('should return all asset types with asset count', async () => {
      const mockTypes = [
        { id: 1, name: 'Laptop', description: 'Portable computers', _count: { assets: 5 } },
        { id: 2, name: 'Desktop', description: 'Desktop computers', _count: { assets: 3 } },
      ]

      vi.mocked(prisma.assetType.findMany).mockResolvedValue(mockTypes as any)

      const result = await getAssetTypes()

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockTypes)
      expect(prisma.assetType.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
        include: { _count: { select: { assets: true } } },
      })
    })

    it('should handle database errors', async () => {
      vi.mocked(prisma.assetType.findMany).mockRejectedValue(new Error('DB Error'))

      const result = await getAssetTypes()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to fetch asset types')
    })
  })

  describe('createAssetType', () => {
    it('should create a new asset type', async () => {
      const formData = new FormData()
      formData.append('name', 'Printer')
      formData.append('description', 'Office printers')

      const mockCreated = { id: 3, name: 'Printer', description: 'Office printers' }
      vi.mocked(prisma.assetType.create).mockResolvedValue(mockCreated as any)

      const result = await createAssetType(formData)

      expect(result.success).toBe(true)
      expect(prisma.assetType.create).toHaveBeenCalledWith({
        data: {
          name: 'Printer',
          description: 'Office printers',
        },
      })
      expect(revalidatePath).toHaveBeenCalledWith('/settings/asset-types')
    })

    it('should require name field', async () => {
      const formData = new FormData()
      formData.append('description', 'Test description')

      const result = await createAssetType(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Name is required')
    })

    it('should handle unique constraint violation', async () => {
      const formData = new FormData()
      formData.append('name', 'Laptop')

      vi.mocked(prisma.assetType.create).mockRejectedValue({ code: 'P2002' })

      const result = await createAssetType(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Asset type with this name already exists')
    })
  })

  describe('updateAssetType', () => {
    it('should update an existing asset type', async () => {
      const formData = new FormData()
      formData.append('name', 'Updated Laptop')
      formData.append('description', 'Updated description')

      vi.mocked(prisma.assetType.update).mockResolvedValue({} as any)

      const result = await updateAssetType(1, formData)

      expect(result.success).toBe(true)
      expect(prisma.assetType.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Updated Laptop',
          description: 'Updated description',
        },
      })
      expect(revalidatePath).toHaveBeenCalledWith('/settings/asset-types')
    })

    it('should require name field', async () => {
      const formData = new FormData()

      const result = await updateAssetType(1, formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Name is required')
    })
  })

  describe('deleteAssetType', () => {
    it('should delete asset type with no associated assets', async () => {
      vi.mocked(prisma.assetType.findUnique).mockResolvedValue({
        id: 1,
        name: 'Test',
        description: null,
        _count: { assets: 0 },
      } as any)

      vi.mocked(prisma.assetType.delete).mockResolvedValue({} as any)

      const result = await deleteAssetType(1)

      expect(result.success).toBe(true)
      expect(prisma.assetType.delete).toHaveBeenCalledWith({ where: { id: 1 } })
      expect(revalidatePath).toHaveBeenCalledWith('/settings/asset-types')
    })

    it('should prevent deletion of asset type with associated assets', async () => {
      vi.mocked(prisma.assetType.findUnique).mockResolvedValue({
        id: 1,
        name: 'Laptop',
        description: null,
        _count: { assets: 5 },
      } as any)

      const result = await deleteAssetType(1)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Cannot delete asset type heavily used by assets.')
      expect(prisma.assetType.delete).not.toHaveBeenCalled()
    })

    it('should handle database errors', async () => {
      vi.mocked(prisma.assetType.findUnique).mockRejectedValue(new Error('DB Error'))

      const result = await deleteAssetType(1)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to delete asset type')
    })
  })
})
