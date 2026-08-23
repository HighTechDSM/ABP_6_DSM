import type { ReactNode } from 'react'
import Icon from './Icon'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
  compact?: boolean
}

function EmptyState({ title, description, action, compact = false }: EmptyStateProps) {
  return (
    <div className={`empty-state${compact ? ' empty-state--compact' : ''}`}>
      <span className="empty-state__icon"><Icon name="inbox" size={24} /></span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  )
}

export default EmptyState
