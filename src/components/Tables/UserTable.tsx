import { css } from "@linaria/atomic"
import { AlertCircle, MoreHorizontal } from "lucide-react"
import { useEffect, useState, type FC } from "react"
import { formatDate } from "../../utils/formartDate"
import { getPocketsBalance } from "../../api/pockets"
import type { UserWithPublicAttributes } from "../../types/user.types"

const tableWrapperStyles = css`
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid #E5E7EB;
  background-color: white;
`

const tableContainerStyles = css`
  width: 100%;
  border-radius: 0.5rem;
  border-collapse: collapse;
  overflow: hidden;
`

const tableHeaderStyles = css`
  background-color: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
`

const tableHeaderCellStyles = css`
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: rgb(45, 47, 49);
`

const tableRowStyles = css`
  border-bottom: 1px solid #E5E7EB;
  &:hover {
    background-color: #F9FAFB;
  }
  &:last-child {
    border-bottom: none;
  }
`

const tableCellStyles = css`
  padding: 1rem;
  color: #111827;
  font-size: 14px;
`

const additionalInfoStyles = css`
  color: #6B7280;
  font-size: 0.875rem;
  margin-top: 2px;
`

const actionButtonStyles = css`
  background: none;
  border: none;
  cursor: pointer;
  color: #6B7280;
  padding: 4px;
  border-radius: 4px;
  &:hover {
    color: #374151;
  }
  position: relative;
`

const actionsHeaderStyles = css`
  padding: 12px 16px;
  font-weight: 700;
  font-size: 14px;
  color: black;
`

const actionItemStyles = css`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font-size: 14px;
  color: black;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: #F9FAFB;
  }
`

const actionItemDangerStyles = css`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  color: #EF4444;
  &:hover {
    background-color: #FEF2F2;
  }
`

const actionIconStyles = css`
  margin-right: 8px;
  display: flex;
  align-items: center;
`

const actionSeparatorStyles = css`
  height: 1px;
  background-color: #E5E7EB;
  margin: 4px 0;
`

const actionsOverlayStyles = css`
  position: fixed;
  width: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
  overflow: hidden;
  border: 1px solid #E5E7EB;
`

type UserTableProps = {
  users: UserWithPublicAttributes[]
  onViewUserTransactions: (user: UserWithPublicAttributes) => void
  onUnlock: (user: UserWithPublicAttributes) => void
}

const UserTable: FC<UserTableProps> = ({ users, onViewUserTransactions, onUnlock}) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const [balances, setBalances] = useState<{ userId: number; balance: number }[]>([])

  const toggleMenu = (index: number, event: React.MouseEvent) => {
    event.stopPropagation()
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    setMenuPosition({ top: rect.bottom, left: rect.right })
    setActiveMenu(activeMenu === index ? null : index)
  }

  useEffect(() => {
    async function fetchBalances() {
      const balances = await Promise.all(
        users.map(user =>
          getPocketsBalance(user.id).then(balance => ({
            userId: user.id,
            balance
          }))
        )
      )
      setBalances(balances)
    }
    fetchBalances()
  }, [users])

  const handleViewTransactions = (user: UserWithPublicAttributes) => {
    setActiveMenu(null)
    onViewUserTransactions(user)
  }

  return (
    <div className={tableWrapperStyles}>
      <table className={tableContainerStyles}>
        <thead>
          <tr className={tableHeaderStyles}>
            <th className={tableHeaderCellStyles}>Name</th>
            <th className={tableHeaderCellStyles}>Phone</th>
            <th className={tableHeaderCellStyles}>Country</th>
            <th className={tableHeaderCellStyles}>Id</th>
            <th className={tableHeaderCellStyles}>Total Balance</th>
            <th className={tableHeaderCellStyles}>Last Login</th>
            <th className={tableHeaderCellStyles}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className={tableRowStyles}>
              <td className={tableCellStyles}>{user.full_name}</td>
              <td className={tableCellStyles}>{user.phone_number}</td>
              <td className={tableCellStyles}>{user.country}</td>
              <td className={tableCellStyles}>
                <div>{user.id_type}</div>
                <div className={additionalInfoStyles}>{user.id_number}</div>
              </td>
              <td className={tableCellStyles}>
                {balances.find(b => b.userId === user.id)?.balance ?? 'Loading...'}
              </td>
              <td className={tableCellStyles}>
                {formatDate(user.last_login, 'full')}
              </td>
              <td className={tableCellStyles}>
                <button 
                  className={actionButtonStyles} 
                  onClick={(e) => toggleMenu(index, e)}
                >
                  <MoreHorizontal size={20} />
                  {activeMenu === index && (
                    <div
                      className={actionsOverlayStyles}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: "fixed",
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                        transform: "translate(-90%, 10px)"
                      }}
                    >
                      <div className={actionsHeaderStyles}>Actions</div>
                      <div 
                        className={actionItemStyles}
                        onClick={() => handleViewTransactions(user)}
                      >
                        View Transactions
                      </div>
                      <div className={actionItemStyles} onClick={() => {
                        onUnlock(user)
                      }}>
                        Unlock
                      </div>
                      <div className={actionSeparatorStyles} />
                      <div className={actionItemDangerStyles}>
                        <span className={actionIconStyles}>
                          <AlertCircle size={16} /> 
                        </span>
                        Deactivate
                      </div>
                    </div>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable