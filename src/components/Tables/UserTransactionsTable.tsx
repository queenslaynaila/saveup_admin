import { css, cx } from "@linaria/atomic"
import { useState, useEffect } from "react"
import type { Transaction, TransactionType } from "../../types/transaction.types"
import { formatDate } from "../../utils/formartDate"
import { LIGHT_THEME_COLOR, THEME_COLOR } from "../../styles/colors"
import { getTransactions } from "../../api/transaction"

const cardWrapperStyles = css`
  width: 100%;
  margin-top: 2rem; 
  border-radius: 0.5rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
`

interface UserTransactionsTableProps {
  userId: number;
}

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
  min-width: 4.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 0.375rem;
  background-color: #3b82f6;
  color: #fff;
  font-size: 1rem;
 
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  box-shadow: 0 1px 2px rgba(59,130,246,0.08);
  &:hover:not(:disabled) {
    background-color: #2563eb;
    color: #fff;
  }
  &:disabled {
    background-color: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }
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

export const UserTransactionsTable: React.FC<UserTransactionsTableProps> = ({ userId }) => {
  const [typeFilter, setTypeFilter] = useState<TransactionType | "All">("All")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const PAGE_SIZE = 10;
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);
  const [lastQuery, setLastQuery] = useState<{ 
    after?: number; 
    before?: number; 
    reset?: boolean 
  }>({ reset: true });
  const [initialMaxXid, setInitialMaxXid] = useState<number | null>(null);

  const fetchTransactions = async (params: { before?: number; after?: number; reset?: boolean } = {}) => {
    setLoading(true)
    setError(null)
    const slug = typeFilter !== 'All' ? typeFilter as TransactionType : undefined;
    getTransactions(userId, params.before, params.after, slug)
      .then((transactions) => {
        setTransactions(transactions)
        if (params.reset || (!params.after && !params.before)) {
          if (transactions.length > 0) {
            setInitialMaxXid(Number(transactions[0].xid));
          } else {
            setInitialMaxXid(null);
          }
        }
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setLastQuery({ reset: true });
    fetchTransactions({ reset: true })
  }, [userId, typeFilter])

  const handleClearFilters = (): void => {
    setTypeFilter("All")
  }

  const handlePrevPage = (): void => {
    if (transactions.length > 0) {
      const after = transactions[0].xid;
      setLastQuery({ after });
      fetchTransactions({ after });
    }
  }

  const handleNextPage = (): void => {
    if (transactions.length > 0) {
      const before = transactions[transactions.length - 1].xid;
      setLastQuery({ before });
      fetchTransactions({ before });
    }
  }

  useEffect(() => {
    if (transactions.length > 0 && initialMaxXid !== null) {
      setIsFirstPage(transactions[0].xid === initialMaxXid);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    } else {
      setIsLastPage(transactions.length < PAGE_SIZE);
    }
  }, [transactions, lastQuery, initialMaxXid]);

  return (
    <div className={cardWrapperStyles}>
      <div>
        <h2 className={cardTitleStyles}>User Transactions</h2>
      </div>

      <div className={cardContentStyles}>
        <div className={filtersContainerStyles}>
          <div>
            <select
              className={selectBaseStyles}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TransactionType | "All")}
            >
              {transactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <button
            className={buttonBaseStyles}
            onClick={handleClearFilters}
            type="button"
          >
            Clear Filters
          </button>
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : (
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
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <tr key={transaction.reference_id || index} className={tableRowStyles}>
                      <td className={tableCellStyles}>{transaction.pocket_name}</td>
                      <td className={tableCellStyles}>{transaction.reference_id.toUpperCase()}</td>
                      <td className={tableCellStyles}>{transaction.slug}</td>
                      <td className={cx(
                        tableCellStyles,
                        transaction.delta > 0 ? textGreenStyles : textRedStyles
                      )}>
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
                  ))
                ) : (
                  <tr className={tableRowStyles}>
                    <td colSpan={6} className={emptyStateCellStyles}>
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className={paginationContainerStyles}>
          <button
            className={paginationButtonStyles}
            onClick={handlePrevPage}
            disabled={loading || isFirstPage}
            type="button"
            aria-label="Previous page"
          >
            {"PREV"}
          </button>
          <button
            className={paginationButtonStyles}
            onClick={handleNextPage}
            disabled={loading || isLastPage}
            type="button"
            aria-label="Next page"
          >
            {"NEXT"}
          </button>
        </div>
      </div>
    </div>
  )
}
