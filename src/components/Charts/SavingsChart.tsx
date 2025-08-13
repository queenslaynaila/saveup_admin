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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${TEXT_PRIMARY};
    margin: 0;
  }
`

const periodButtonsStyles = css`
  display: flex;
  gap: 0.5rem;
`

const periodButtonStyles = css`
  padding: 0.5rem 1rem;
  border: 1px solid ${BORDER_COLOR};
  background: none;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.active {
    background-color: ${THEME_COLOR};
    color: white;
    border-color: ${THEME_COLOR};
  }
  
  &:hover:not(.active) {
    background-color: ${LIGHT_THEME_COLOR}15;
  }
`

const chartContainerStyles = css`
  height: 300px;
  display: flex;
  align-items: end;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid ${BORDER_COLOR};
  margin-bottom: 1rem;
`

const barStyles = css`
  flex: 1;
  background: linear-gradient(to top, ${THEME_COLOR}, ${LIGHT_THEME_COLOR});
  border-radius: 4px 4px 0 0;
  min-height: 20px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
`

const summaryStyles = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  text-align: center;
`

const summaryItemStyles = css`
  .value {
    font-size: 1.1rem;
    font-weight: 700;
    color: ${TEXT_PRIMARY};
    margin-bottom: 0.25rem;
  }
  
  .label {
    font-size: 0.8rem;
    color: #64748b;
  }
`

export function SavingsChart() {
  const chartData = [
    { month: "Jan", value: 65 },
    { month: "Feb", value: 78 },
    { month: "Mar", value: 82 },
    { month: "Apr", value: 88 },
    { month: "May", value: 95 },
    { month: "Jun", value: 100 },
  ]

  return (
    <div className={cardStyles}>
      <div className={headerStyles}>
        <h3>Savings Growth</h3>
        <div className={periodButtonsStyles}>
          <button className={`${periodButtonStyles} active`}>6M</button>
          <button className={periodButtonStyles}>1Y</button>
          <button className={periodButtonStyles}>All</button>
        </div>
      </div>

      <div className={chartContainerStyles}>
        {chartData.map((data, index) => (
          <div
            key={index}
            className={barStyles}
            style={{ height: `${data.value}%` }}
            title={`${data.month}: ${data.value}%`}
          />
        ))}
      </div>

      <div className={summaryStyles}>
        <div className={summaryItemStyles}>
          <div className="value">$2.8M</div>
          <div className="label">Total Saved</div>
        </div>
        <div className={summaryItemStyles}>
          <div className="value">+15%</div>
          <div className="label">Growth</div>
        </div>
        <div className={summaryItemStyles}>
          <div className="value">1,247</div>
          <div className="label">Active Goals</div>
        </div>
      </div>
    </div>
  )
}
