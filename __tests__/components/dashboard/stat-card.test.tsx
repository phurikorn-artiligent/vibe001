import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StatCard } from '@/components/dashboard/stat-card'
import { Package } from 'lucide-react'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('StatCard Component', () => {
  it('should render with basic props', () => {
    render(
      <StatCard
        title="Total Assets"
        value={42}
        iconName="package"
        description="All registered assets"
      />
    )

    expect(screen.getByText('Total Assets')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('All registered assets')).toBeInTheDocument()
  })

  it('should render without description', () => {
    render(
      <StatCard
        title="Total Assets"
        value={42}
        iconName="package"
      />
    )

    expect(screen.getByText('Total Assets')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('should render as a link when href is provided', () => {
    render(
      <StatCard
        title="Available"
        value={10}
        iconName="check-circle"
        href="/assets?status=AVAILABLE"
      />
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/assets?status=AVAILABLE')
  })

  it('should apply correct color classes', () => {
    const { container } = render(
      <StatCard
        title="Available"
        value={10}
        iconName="check-circle"
        color="emerald"
      />
    )

    const iconContainer = container.querySelector('.bg-emerald-100')
    expect(iconContainer).toBeInTheDocument()
  })

  it('should render correct icon based on iconName', () => {
    const { container: packageContainer } = render(
      <StatCard title="Test" value={1} iconName="package" />
    )
    expect(packageContainer.querySelector('svg')).toBeInTheDocument()

    const { container: checkContainer } = render(
      <StatCard title="Test" value={1} iconName="check-circle" />
    )
    expect(checkContainer.querySelector('svg')).toBeInTheDocument()
  })

  it('should use default icon for unknown iconName', () => {
    const { container } = render(
      <StatCard title="Test" value={1} iconName="unknown-icon" />
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('should display zero value correctly', () => {
    render(
      <StatCard
        title="Maintenance"
        value={0}
        iconName="wrench"
      />
    )

    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
