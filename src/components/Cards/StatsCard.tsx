import { css } from "@linaria/core"
import {
  BG_CARD_COLOR,
  TEXT_PRIMARY,
  THEME_COLOR,
  BORDER_COLOR,
  BORDER_RADIUS_LARGE,
  SHADOW_MEDIUM,
} from "../../styles/colors"

const cardStyles = css`
  background-color: ${BG_CARD_COLOR};
  border-radius: ${BORDER_RADIUS_LARGE};
  padding: 1.5rem;
  border: 1px solid ${BORDER_COLOR};
  box-shadow: ${SHADOW_MEDIUM};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`

const headerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`

const iconStyles = css`
  font-size: 2rem;
  opacity: 0.8;
`

const titleStyles = css`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  margin: 0;
`

const valueStyles = css`
  font-size: 2rem;
  font-weight: 700;
  color: ${TEXT_PRIMARY};
  margin: 0.5rem 0;
`

const changeStyles = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  
  &.up {
    color: ${THEME_COLOR};
  }
  
  &.down {
    color: #ef4444;
  }
`

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: string
}

export function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  return (
    <div className={cardStyles}>
      <div className={headerStyles}>
        <div>
          <p className={titleStyles}>{title}</p>
          <h3 className={valueStyles}>{value}</h3>
        </div>
        <div className={iconStyles}>{icon}</div>
      </div>
      <div className={`${changeStyles} ${trend}`}>
        <span>{trend === "up" ? "↗️" : "↘️"}</span>
        {change} from last month
      </div>
    </div>
  )
}
