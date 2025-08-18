
import type React from "react"
import { useState, useEffect } from "react"
import { css } from "@linaria/atomic"
import DashboardLayout from "../components/Layout/DashboardLayout"
import {
  FiUsers,
  FiLogIn,
  FiAlertTriangle,
  FiLock,
  FiDollarSign,
  FiArrowDown,
  FiCalendar,
  FiFilter,
} from "react-icons/fi"
import { 
  getAuthenticationStats, 
  getExpensesStats, 
  getSavingStats, 
  getWithdrawalStats 
} from "../api/stats"
import type { AggregatedStats, AggregationType, AuthStats } from "../types/stats.types"
import { Header } from "../components/Layout/Header"

const containerStyles = css`
  padding: 24px; width: 100%; 
  @media (max-width: 768px) { 
    padding: 16px; 
  }
`;

const filtersSectionStyles = css`
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 32px;
`

const filtersGridStyles = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
`

const filterGroup = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const labelStyles = css`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  display: flex;
  align-items: center;
  gap: 6px;
`

const inputStyles = css`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background-color: #ffffff;
  color: #000000;
  
  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
`

const selectStyles = css`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background-color: #ffffff;
  color: #000000;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
`

const buttonStyles = css`
  padding: 10px 20px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #333333;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`

const statsGridStyles = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`

const statsCardStyles = css`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const cardHeaderStyles = css`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`

const cardIconStyles = css`
  width: 40px;
  height: 40px;
  background-color: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
`

const cardTitleStyles = css`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`

const statsRowStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`

const statLabelStyles = css`
  font-size: 14px;
  color: #666666;
  font-weight: 500;
`

const statValueStyles = css`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
`

const aggregatedValueStyles = css`
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  text-align: center;
  margin: 16px 0;
`

const loadingStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666666;
`

const errorStyles = css`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 12px;
  color: #dc2626;
  font-size: 14px;
  margin-top: 8px;
`

export const Stats: React.FC = () => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [aggregationType, setAggregationType] = useState<AggregationType>("sum")

  const [authStats, setAuthStats] = useState<AuthStats | null>(null)
  const [expensesStats, setExpensesStats] = useState<AggregatedStats>({})
  const [savingsStats, setSavingsStats] = useState<AggregatedStats>({})
  const [withdrawalStats, setWithdrawalStats] = useState<AggregatedStats>({})

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchAllStats = async () => {
    if (!startDate || !endDate) {
      setErrors({ general: "Please select both start and end dates" })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      // Fetch all stats in parallel
      const [authData, expensesData, savingsData, withdrawalData] = await Promise.allSettled([
        getAuthenticationStats(startDate, endDate),
        getExpensesStats(startDate, endDate),
        getSavingStats(startDate, endDate, aggregationType),
        getWithdrawalStats(startDate, endDate, aggregationType),
      ])

      // Handle auth stats
      if (authData.status === "fulfilled") {
        setAuthStats(authData.value)
      } else {
        setErrors((prev) => ({ ...prev, auth: "Failed to fetch authentication stats" }))
      }

      // Handle expenses stats
      if (expensesData.status === "fulfilled") {
        setExpensesStats(expensesData.value)
      } else {
        setErrors((prev) => ({ ...prev, expenses: "Failed to fetch expenses stats" }))
      }

      // Handle savings stats
      if (savingsData.status === "fulfilled") {
        setSavingsStats(savingsData.value)
      } else {
        setErrors((prev) => ({ ...prev, savings: "Failed to fetch savings stats" }))
      }

      // Handle withdrawal stats
      if (withdrawalData.status === "fulfilled") {
        setWithdrawalStats(withdrawalData.value)
      } else {
        setErrors((prev) => ({ ...prev, withdrawals: "Failed to fetch withdrawal stats" }))
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    setEndDate(today.toISOString().split("T")[0])
    setStartDate(thirtyDaysAgo.toISOString().split("T")[0])
  }, [])

  const formatNumber = (num: number | undefined): string => {
    if (num === undefined) return "0"
    return new Intl.NumberFormat().format(num)
  }

  const getAggregationLabel = (type: AggregationType): string => {
    const labels = {
      sum: "Total",
      avg: "Average",
      count: "Count",
      min: "Minimum",
      max: "Maximum",
    }
    return labels[type]
  }

  return (
    <DashboardLayout>
      <div className={containerStyles}>
        <Header heading="Statistics" description="Monitor your application metrics and financial data" />

        <div className={filtersSectionStyles}>
          <div className={filtersGridStyles}>
            <div className={filterGroup}>
              <label className={labelStyles}>
                <FiCalendar size={16} />
                Start Date
              </label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputStyles} />
            </div>

            <div className={filterGroup}>
              <label className={labelStyles}>
                <FiCalendar size={16} />
                End Date
              </label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputStyles} />
            </div>

            <div className={filterGroup}>
              <label className={labelStyles}>
                <FiFilter size={16} />
                Aggregation Type
              </label>
              <select
                value={aggregationType}
                onChange={(e) => setAggregationType(e.target.value as AggregationType)}
                className={selectStyles}
              >
                <option value="sum">Sum</option>
                <option value="avg">Average</option>
                <option value="count">Count</option>
                <option value="min">Minimum</option>
                <option value="max">Maximum</option>
              </select>
            </div>

            <div className={filterGroup}>
              <button onClick={fetchAllStats} disabled={loading || !startDate || !endDate} className={buttonStyles}>
                <FiFilter size={16} />
                {loading ? "Loading..." : "Apply Filters"}
              </button>
            </div>
          </div>

          {errors.general && <div className={errorStyles}>{errors.general}</div>}
        </div>

        <div className={statsGridStyles}>
          {/* Authentication Stats */}
          <div className={statsCardStyles}>
            <div className={cardHeaderStyles}>
              <div className={cardIconStyles}>
                <FiUsers size={20} />
              </div>
              <h3 className={cardTitleStyles}>Authentication Metrics</h3>
            </div>

            {loading ? (
              <div className={loadingStyles}>Loading authentication stats...</div>
            ) : errors.auth ? (
              <div className={errorStyles}>{errors.auth}</div>
            ) : authStats ? (
              <>
                <div className={statsRowStyles}>
                  <span className={statLabelStyles}>
                    <FiUsers size={16} style={{ marginRight: "6px", display: "inline" }} />
                    Total Registrations
                  </span>
                  <span className={statValueStyles}>{formatNumber(authStats.total_registrations)}</span>
                </div>
                <div className={statsRowStyles}>
                  <span className={statLabelStyles}>
                    <FiLogIn size={16} style={{ marginRight: "6px", display: "inline" }} />
                    Total Logins
                  </span>
                  <span className={statValueStyles}>{formatNumber(authStats.total_logins)}</span>
                </div>
                <div className={statsRowStyles}>
                  <span className={statLabelStyles}>
                    <FiAlertTriangle size={16} style={{ marginRight: "6px", display: "inline" }} />
                    Failed Logins
                  </span>
                  <span className={statValueStyles}>{formatNumber(authStats.total_failed_logins)}</span>
                </div>
                <div className={statsRowStyles}>
                  <span className={statLabelStyles}>
                    <FiLock size={16} style={{ marginRight: "6px", display: "inline" }} />
                    Locked Accounts
                  </span>
                  <span className={statValueStyles}>{formatNumber(authStats.locked_accounts)}</span>
                </div>
              </>
            ) : (
              <div className={loadingStyles}>No data available</div>
            )}
          </div>

          {/* Expenses Stats */}
          <div className={statsCardStyles}>
            <div className={cardHeaderStyles}>
              <div className={cardIconStyles}>
                <FiDollarSign size={20} />
              </div>
              <h3 className={cardTitleStyles}>Expenses Analytics</h3>
            </div>

            {loading ? (
              <div className={loadingStyles}>Loading expenses stats...</div>
            ) : errors.expenses ? (
              <div className={errorStyles}>{errors.expenses}</div>
            ) : (
              <>
                <div style={{ textAlign: "center", color: "#666666", fontSize: "14px", marginBottom: "8px" }}>
                  {getAggregationLabel(aggregationType)} Expenses
                </div>
                <div className={aggregatedValueStyles}>${formatNumber(expensesStats.aggregated_expenses)}</div>
              </>
            )}
          </div>

          {/* Savings Stats */}
          <div className={statsCardStyles}>
            <div className={cardHeaderStyles}>
              <div className={cardIconStyles}>
                <FiUsers size={20} />
              </div>
              <h3 className={cardTitleStyles}>Savings Analytics</h3>
            </div>

            {loading ? (
              <div className={loadingStyles}>Loading savings stats...</div>
            ) : errors.savings ? (
              <div className={errorStyles}>{errors.savings}</div>
            ) : (
              <>
                <div style={{ textAlign: "center", color: "#666666", fontSize: "14px", marginBottom: "8px" }}>
                  {getAggregationLabel(aggregationType)} Savings
                </div>
                <div className={aggregatedValueStyles}>${formatNumber(savingsStats.aggregated_savings)}</div>
              </>
            )}
          </div>

          {/* Withdrawal Stats */}
          <div className={statsCardStyles}>
            <div className={cardHeaderStyles}>
              <div className={cardIconStyles}>
                <FiArrowDown size={20} />
              </div>
              <h3 className={cardTitleStyles}>Withdrawal Analytics</h3>
            </div>

            {loading ? (
              <div className={loadingStyles}>Loading withdrawal stats...</div>
            ) : errors.withdrawals ? (
              <div className={errorStyles}>{errors.withdrawals}</div>
            ) : (
              <>
                <div style={{ textAlign: "center", color: "#666666", fontSize: "14px", marginBottom: "8px" }}>
                  {getAggregationLabel(aggregationType)} Withdrawals
                </div>
                <div className={aggregatedValueStyles}>${formatNumber(withdrawalStats.aggregated_withdrawals)}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Stats
