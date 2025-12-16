import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('lib/utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('px-2 py-1', 'px-4')
      expect(result).toContain('px-4')
      expect(result).toContain('py-1')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toContain('base-class')
      expect(result).toContain('active-class')
    })

    it('should filter out falsy values', () => {
      const result = cn('class1', false, 'class2', null, 'class3', undefined)
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })
  })
})
