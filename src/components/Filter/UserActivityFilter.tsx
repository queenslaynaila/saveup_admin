"use client"

import { css } from "@linaria/atomic"
import { BORDER_COLOR, TEXT_PRIMARY, THEME_COLOR } from "../../styles/colors"
import type { ActivityType, TransactionSubType, NonTransactionSubType } from "../../data/mockActivity"

const filterBarStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background-color: white;
  border: 1px solid ${BORDER_COLOR};
  border-radius: 0.5rem;
  padding: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const filterGroupStyles = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 180px; /* Ensure minimum width for readability */

  @media (max-width: 768px) {
    min-width: unset;
    width: 100%;
  }
`

const labelStyles = css`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${TEXT_PRIMARY};
`

const selectStyles = css`
  padding: 0.75rem 1rem;
  border: 1px solid ${BORDER_COLOR};
  border-radius: 0.5rem;
  font-size: 0.95rem;
  background-color: white;
  color: ${TEXT_PRIMARY};
  appearance: none; /* Remove default arrow */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fillRule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clipRule='evenodd'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;

  &:focus {
    outline: none;
    border-color: ${THEME_COLOR};
    box-shadow: 0 0 0 3px ${THEME_COLOR}15;
  }
`

const dateInputStyles = css`
  padding: 0.75rem 1rem;
  border: 1px solid ${BORDER_COLOR};
  border-radius: 0.5rem;
  font-size: 0.95rem;
  background-color: white;
  color: ${TEXT_PRIMARY};

  &:focus {
    outline: none;
    border-color: ${THEME_COLOR};
    box-shadow: 0 0 0 3px ${THEME_COLOR}15;
  }
`

interface UserActivityFiltersProps {
  activityType: ActivityType
  transactionSubType: TransactionSubType | ""
  nonTransactionSubType: NonTransactionSubType | ""
  dateRange: { start: string; end: string }
  onActivityTypeChange: (type: ActivityType) => void
  onTransactionSubTypeChange: (subType: TransactionSubType | "") => void
  onNonTransactionSubTypeChange: (subType: NonTransactionSubType | "") => void
  onDateRangeChange: (range: { start: string; end: string }) => void
}

export function UserActivityFilters({
  activityType,
  transactionSubType,
  nonTransactionSubType,
  dateRange,
  onActivityTypeChange,
  onTransactionSubTypeChange,
  onNonTransactionSubTypeChange,
  onDateRangeChange,
}: UserActivityFiltersProps) {
  const transactionSubTypes: TransactionSubType[] = [
    "Saving",
    "Donation",
    "Interest",
    "Withdrawal",
    "Penalty",
    "TransferIn",
    "TransferOut",
    "Loan",
    "Repayment",
  ]

  const nonTransactionSubTypes: NonTransactionSubType[] = [
    "Pocket Creation",
    "Pocket Deletion",
    "Invitation Received",
    "Next of Kin Update",
    "Pin Reset",
  ]

  return (
    <div className={filterBarStyles}>
      <div className={filterGroupStyles}>
        <label htmlFor="activity-type" className={labelStyles}>
          Activity Type
        </label>
        <select
          id="activity-type"
          className={selectStyles}
          value={activityType}
          onChange={(e) => onActivityTypeChange(e.target.value as ActivityType)}
        >
          <option value="All">All</option>
          <option value="Transactions">Transactions</option>
          <option value="Non-Transactions">Non-Transactions</option>
        </select>
      </div>

      {activityType === "Transactions" && (
        <div className={filterGroupStyles}>
          <label htmlFor="transaction-subtype" className={labelStyles}>
            Transaction Type
          </label>
          <select
            id="transaction-subtype"
            className={selectStyles}
            value={transactionSubType}
            onChange={(e) => onTransactionSubTypeChange(e.target.value as TransactionSubType | "")}
          >
            <option value="">All Transaction Types</option>
            {transactionSubTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      {activityType === "Non-Transactions" && (
        <div className={filterGroupStyles}>
          <label htmlFor="non-transaction-subtype" className={labelStyles}>
            Non-Transaction Type
          </label>
          <select
            id="non-transaction-subtype"
            className={selectStyles}
            value={nonTransactionSubType}
            onChange={(e) => onNonTransactionSubTypeChange(e.target.value as NonTransactionSubType | "")}
          >
            <option value="">All Non-Transaction Types</option>
            {nonTransactionSubTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={filterGroupStyles}>
        <label htmlFor="date-start" className={labelStyles}>
          Date Range (Start)
        </label>
        <input
          id="date-start"
          type="date"
          className={dateInputStyles}
          value={dateRange.start}
          onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
        />
      </div>

      <div className={filterGroupStyles}>
        <label htmlFor="date-end" className={labelStyles}>
          Date Range (End)
        </label>
        <input
          id="date-end"
          type="date"
          className={dateInputStyles}
          value={dateRange.end}
          onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
        />
      </div>
    </div>
  )
}
