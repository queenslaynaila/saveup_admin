import { css } from "@linaria/core"
import {
  BG_CARD_COLOR,
  TEXT_PRIMARY,
  THEME_COLOR,
  LIGHT_THEME_COLOR,
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
`

const headerStyles = css`
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${TEXT_PRIMARY};
    margin: 0 0 0.5rem 0;
  }
  
  p {
    color: #64748b;
    font-size: 0.875rem;
    margin: 0;
  }
`

const metricStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${BORDER_COLOR};
  
  &:last-child {
    border-bottom: none;
  }
`

const metricLabelStyles = css`
  font-size: 0.9rem;
  color: ${TEXT_PRIMARY};
  font-weight: 500;
`

const metricValueStyles = css`
  font-weight: 600;
  color: ${THEME_COLOR};
`

const progressBarStyles = css`
  width: 100%;
  height: 8px;
  background-color: ${BORDER_COLOR};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
`

const progressFillStyles = css`
  height: 100%;
  background: linear-gradient(90deg, ${THEME_COLOR}, ${LIGHT_THEME_COLOR});
  border-radius: 4px;
  transition: width 0.3s ease;
`

export function UserGrowthCard() {
  const metrics = [
    { label: "New Users", value: "+127", progress: 85 },
    { label: "Active Users", value: "8,429", progress: 92 },
    { label: "Retention Rate", value: "94%", progress: 94 },
    { label: "Goal Completion", value: "78%", progress: 78 },
  ]

  return (
    <div className={cardStyles}>
      <div className={headerStyles}>
        <h3>User Metrics</h3>
        <p>This month's performance</p>
      </div>

      {metrics.map((metric, index) => (
        <div key={index} className={metricStyles}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className={metricLabelStyles}>{metric.label}</span>
              <span className={metricValueStyles}>{metric.value}</span>
            </div>
            <div className={progressBarStyles}>
              <div className={progressFillStyles} style={{ width: `${metric.progress}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
