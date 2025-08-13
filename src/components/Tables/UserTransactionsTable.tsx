import { css, cx } from "@linaria/atomic"
import { useState} from "react"
import type { Transaction, TransactionType } from "../../types/transaction.types"
import { formatDate } from "../../utils/formartDate"
import { LIGHT_THEME_COLOR, THEME_COLOR } from "../../styles/colors"

const cardWrapperStyles = css`
  width: 100%;
  margin-top: 2rem; 
  border-radius: 0.5rem;
  background-color: white;
`

const cardHeaderStyles = css`
  padding: 1.5rem; 
  border-bottom: 1px solid #e5e7eb;
`

const cardTitleStyles = css`
  font-size: 1.25rem; 
  font-weight: 600;
  color: #1f2937; 
`

const cardContentStyles = css`
  padding: 1.5rem;
`

const filtersContainerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 1rem; 
  margin-bottom: 1.5rem;  

  @media (min-width: 640px) {
    flex-direction: row;
  }
`

const selectBaseStyles = css`
  width: 100%;
  padding: 0.625rem 1rem; 
  border: 1px solid #d1d5db; 
  border-radius: 0.375rem; 
  background-color: white;
  font-size: 0.875rem;  
  color: #1f2937;  

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #3b82f6; 
    border-color: #3b82f6; 
  }

  @media (min-width: 640px) { 
    width: 180px;
  }
`

const dateInputBaseStyles = css`
  padding: 0.625rem 1rem; 
  border: 1px solid #d1d5db; 
  border-radius: 0.375rem; 
  @media (min-width: 640px) { 
    width: 240px;
  }
`

const tableWrapperStyles = css`
  overflow-x: auto;
  border-radius: 0.375rem;  
  border: 1px solid #e5e7eb;  
  background-color: white;
`

const tableContainerStyles = css`
  width: 100%;
  border-collapse: collapse;
`

const tableHeaderStyles = css`
  background-color: #f9fafb;
`

const tableHeaderCellStyles = css`
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 500; 
  color: #374151; 
`

const tableRowStyles = css`
  border-bottom: 1px solid #e5e7eb;
  &:last-child {
    border-bottom: none; 
  }
  &:hover {
    background-color: #f9fafb;
  }
`

const tableCellStyles = css`
  padding: 0.75rem 1rem;  
  color: #111827; 
  font-size: 0.875rem;
`

const textGreenStyles = css`
  color: #16a34a;  
`

const textRedStyles = css`
  color: #dc2626;
`

const textRightStyles = css`
  text-align: right;
`

const textGrayStyles = css`
  color: #4b5563;
`

const emptyStateCellStyles = css`
  height: 6rem; 
  text-align: center;
  color: #6b7280;
`

const buttonBaseStyles = css`
  padding: 0.625rem 1rem;
  border: 1px solid #d1d5db;  
  border-radius: 0.375rem;  
  background-color: white;
  font-size: 0.875rem;
  color: #1f2937;
  cursor: pointer;
  &:hover {
    background-color: ${LIGHT_THEME_COLOR}; 
  }
  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #00ceaa;
    border-color: ${THEME_COLOR};
  }
`
const paginationContainerStyles = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;  
  margin-top: 1.5rem;  
  padding: 0.75rem 0; 
`

const paginationButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;  
  height: 2.5rem;  
  border: 1px solid #e5e7eb;  
  border-radius: 0.375rem;  
  background-color: white;
  color: #3b82f6; 
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #f9fafb; 
  }
  &:disabled {
    color: #9ca3af; 
    cursor: not-allowed;
    background-color: white;
  }
`

const currentPageIndicatorStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;  
  border: 1px solid #e5e7eb; 
  border-radius: 0.375rem;  
  background-color: white;
  color: #1f2937; 
  font-weight: 500;  
`

const transactionTypes: Array<TransactionType | "All"> = [
  "All",
  "Saving",
  "Donations",
  "Interest",
  "Withdrawal",
  "Penalty",
  "TransferIn",
  "TransferOut",
  "Loan",
  "Repayment",
]

interface UserTransactionsTableProps {
  transactions: Transaction[]
}

export function UserTransactionsTable({ transactions }: UserTransactionsTableProps) {
  const [typeFilter, setTypeFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = typeFilter === "All" || t.slug === typeFilter
    const matchesDate = !dateFilter || t.created_at.startsWith(dateFilter)
    return matchesType && matchesDate
  })

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  
  const handleClearFilters = () => {
    setTypeFilter("All")
    setDateFilter("")
    setCurrentPage(1)
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className={cardWrapperStyles}>
      <div className={cardHeaderStyles}>
        <h2 className={cardTitleStyles}>User Transactions</h2>
      </div>

      <div className={cardContentStyles}>
        <div className={filtersContainerStyles}>
          <div>
            <select 
              className={selectBaseStyles} 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {transactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="date"
              className={dateInputBaseStyles}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <button 
            className={buttonBaseStyles} 
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>

        <div className={tableWrapperStyles}>
          <table className={tableContainerStyles}>
            <thead>
              <tr className={tableHeaderStyles}>
                <th className={tableHeaderCellStyles}>Pocket</th>
                <th className={tableHeaderCellStyles}>Reference</th>
                <th className={tableHeaderCellStyles}>Type</th>
                <th className={tableHeaderCellStyles}>Delta</th>
                <th className={tableHeaderCellStyles}>Balance</th>
                <th className={cx(tableHeaderCellStyles, textRightStyles)}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index} className={tableRowStyles}>
                  <td className={tableCellStyles}>
                    {transaction.pocket_name}
                  </td>
                  <td className={tableCellStyles}>
                    {transaction.reference_id.toUpperCase()}
                  </td>
                  <td className={tableCellStyles}>
                    {transaction.slug}
                  </td>
                  <td className={cx(tableCellStyles, transaction.delta > 0 ? textGreenStyles : textRedStyles)}>
                    {transaction.delta > 0 ? "+" : ""}
                    {transaction.delta.toFixed(2)}
                  </td>
                  <td className={cx(tableCellStyles, textGreenStyles)}>
                    {transaction.balance.toFixed(2)}
                  </td>
                  <td className={cx(tableCellStyles, textRightStyles, textGrayStyles)}>
                    {formatDate(transaction.created_at)}
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr className={tableRowStyles}>
                  <td colSpan={6} className={emptyStateCellStyles}>
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={paginationContainerStyles}>
          <button 
            className={paginationButtonStyles}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          <span className={currentPageIndicatorStyles}>
            {currentPage}
          </span>
          <button 
            className={paginationButtonStyles}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  )
}
