import { css, cx } from "@linaria/atomic"
import type { ReactNode } from "react"

const badgeContainerStyles = css`
  display: flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
`

const successVariantStyles = css`
  color: #15803d;
  background-color: #dcfce7;
  &:hover {
    background-color: #bbf7d0;
  }
`

const errorVariantStyles = css`
  color: #dc2626;
  background-color: #fee2e2;
  &:hover {
    background-color: #fecaca;
  }
`

const warningVariantStyles = css`
  color: #a16207;
  background-color: #fef3c7;
  &:hover {
    background-color: #fde68a;
  }
`

const successIconStyles = css`
  color: #22c55e;
`

const errorIconStyles = css`
  color: #ef4444;
`

const warningIconStyles = css`
  color: #eab308;
`

const textContainerStyles = css`
  margin-left: 0.25rem;
`

const smallTextStyles = css`
  font-size: 0.75rem;
  line-height: 1rem;
`

const mediumTextStyles = css`
  font-size: 0.875rem;
  line-height: 1.25rem;
`

interface StatusBadgeProps {
  icon: ReactNode
  text: string
  variant: "success" | "error" | "warning"
  size?: "sm" | "md"
}

export function StatusBadge({ icon, text, variant, size = "sm" }: StatusBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return successVariantStyles
      case "error":
        return errorVariantStyles
      case "warning":
        return warningVariantStyles
    }
  }

  const getIconStyles = () => {
    switch (variant) {
      case "success":
        return successIconStyles
      case "error":
        return errorIconStyles
      case "warning":
        return warningIconStyles
    }
  }

  const getTextSizeStyles = () => {
    return size === "sm" ? smallTextStyles : mediumTextStyles
  }

  return (
    <div className={cx(badgeContainerStyles, getVariantStyles())}>
      <span className={getIconStyles()}>{icon}</span>
      <span className={cx(textContainerStyles, getTextSizeStyles())}>{text}</span>
    </div>
  )
}
