import { css } from "@linaria/atomic"
import type { Transaction } from "../../types/transaction.types"
import { formatDate } from "../../utils/formartDate"

const tableWrapper = css`
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid #E5E7EB;
  background-color: white;
`

const tableContainer = css`
  width: 100%;
  border-radius: 0.5rem;
  border-collapse: collapse;
  overflow: hidden;
`

const tableHeader = css`
  background-color: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
`

const tableHeaderCell = css`
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: rgb(45, 47, 49);
`

const tableRow = css`
  border-bottom: 1px solid #E5E7EB;
  &:hover {
    background-color: #F9FAFB;
  }
  &:last-child {
    border-bottom: none;
  }
`

const tableCell = css`
  padding: 1rem;
  color: #111827;
  font-size: 14px;
`

interface UserTransactionsTableProps {
  transactions: Transaction[]
}

export function UserTransactionsTable({ transactions }: UserTransactionsTableProps) {
  return (
    <div className={tableWrapper}>
      <table className={tableContainer}>
        <thead>
          <tr className={tableHeader}>
            <th className={tableHeaderCell}>Pocket</th>
            <th className={tableHeaderCell}>Reference</th>
            <th className={tableHeaderCell}>Type</th>
            <th className={tableHeaderCell}>Amount</th>
            <th className={tableHeaderCell}>Balance</th>
            <th className={tableHeaderCell}>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className={tableRow}>
              <td className={tableCell}>{transaction.pocket_name}</td>
              <td className={tableCell}>{transaction.reference_id}</td>
              <td className={tableCell}>{transaction.slug}</td>
              <td className={tableCell}> 
                {transaction.currency} {transaction.delta}
              </td>
              <td className={tableCell}> 
                {transaction.currency} {transaction.balance}
              </td>
              <td className={tableCell}> 
                {formatDate(transaction.created_at)}
              </td>
            </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  )
}
