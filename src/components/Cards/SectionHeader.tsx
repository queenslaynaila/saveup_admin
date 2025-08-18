
import { css } from "@linaria/atomic"
import type { ReactNode } from "react"

const headerContainerStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`

const titleContainerStyles = css`
  display: flex;
  align-items: center;
`

const titleStyles = css`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`

interface SectionHeaderProps {
  icon: ReactNode
  title: string
  children?: ReactNode
}

export function SectionHeader({ icon, title, children }: SectionHeaderProps) {
  return (
    <div className={headerContainerStyles}>
      <div className={titleContainerStyles}>
        {icon}
        <h2 className={titleStyles}>{title}</h2>
      </div>
      {children}
    </div>
  )
}
