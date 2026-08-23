import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}

function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <header className="page-heading">
      <div>
        {eyebrow && <span className="page-heading__eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="page-heading__action">{action}</div>}
    </header>
  )
}

export default PageHeader
