import { css, cx } from "@linaria/atomic"
import type React from "react"
import { 
  FlexBetweenCenter, 
  FlexCenter, 
  FlexColumn 
} from "../../styles/commonStyles"

const dashBoardHeaderStyles = css`
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
`

const headerTitleStyles = css`
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #000000;
`

const headerTextStyles = css`
  color: #272b33;
`

const actionBtnStyles = css`
  gap: 8px;
  background-color: #111827;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: #1F2937;
  }
`
interface DashboardHeaderProps {
  heading: string
  description?: string
  actionLabel?: string
  actionIcon?: React.ReactNode
  onAction?: () => void
  children?: React.ReactNode
}


export function Header({
  heading,
  description,
  actionLabel,
  actionIcon,
  onAction,
  children
}: DashboardHeaderProps) {
  return (
    <div className={cx(dashBoardHeaderStyles, FlexBetweenCenter)}>
      <div className={FlexColumn}>
        <h1 className={headerTitleStyles}>{heading}</h1>
        {description && <p className={headerTextStyles}>{description}</p>}
      </div>

      {actionLabel && onAction && (
        <button className={cx(actionBtnStyles, FlexCenter)} onClick={onAction}>
          {actionIcon}
          {actionLabel}
        </button>
      )}

      {children}
    </div>
  )
}
