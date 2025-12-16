import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { formatDistanceToNow } from 'date-fns'

// Mock date-fns
vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn((date, options) => '2 hours ago'),
}))

describe('RecentActivity Component', () => {
  const mockTransactions = [
    {
      id: 1,
      action: 'CHECK_OUT',
      date: new Date('2025-12-09T14:00:00'),
      notes: 'Test checkout',
      asset: {
        code: 'LAP-001',
        name: 'MacBook Pro',
        type: {
          name: 'Laptop',
        },
      },
      employee: {
        firstName: 'John',
        lastName: 'Doe',
      },
    },
    {
      id: 2,
      action: 'CHECK_IN',
      date: new Date('2025-12-09T12:00:00'),
      notes: 'Test checkin',
      asset: {
        code: 'LAP-002',
        name: 'Dell XPS',
        type: {
          name: 'Laptop',
        },
      },
      employee: {
        firstName: 'Jane',
        lastName: 'Smith',
      },
    },
  ]

  it('should render transaction list', () => {
    render(<RecentActivity transactions={mockTransactions} />)

    expect(screen.getByText('LAP-001')).toBeInTheDocument()
    expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('LAP-002')).toBeInTheDocument()
    expect(screen.getByText('Dell XPS')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('should display CHECK_OUT badge correctly', () => {
    render(<RecentActivity transactions={[mockTransactions[0]]} />)

    const outBadge = screen.getByText('Out')
    expect(outBadge).toBeInTheDocument()
  })

  it('should display CHECK_IN badge correctly', () => {
    render(<RecentActivity transactions={[mockTransactions[1]]} />)

    const inBadge = screen.getByText('In')
    expect(inBadge).toBeInTheDocument()
  })

  it('should display asset type badges', () => {
    render(<RecentActivity transactions={mockTransactions} />)

    const typeBadges = screen.getAllByText('Laptop')
    expect(typeBadges).toHaveLength(2)
  })

  it('should display relative time', () => {
    render(<RecentActivity transactions={mockTransactions} />)

    const timeElements = screen.getAllByText('2 hours ago')
    expect(timeElements).toHaveLength(2)
  })

  it('should render empty state when no transactions', () => {
    render(<RecentActivity transactions={[]} />)

    expect(screen.getByText('No recent activity')).toBeInTheDocument()
  })

  it('should render table headers', () => {
    render(<RecentActivity transactions={mockTransactions} />)

    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Asset')).toBeInTheDocument()
    expect(screen.getByText('Employee')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Time')).toBeInTheDocument()
  })
})
