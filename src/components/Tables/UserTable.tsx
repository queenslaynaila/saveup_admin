import { css } from "@linaria/atomic"
import type { User } from "../../types/user.types"
import { AlertCircle, MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { getPocketsBalance } from "../../data/api/pockets"

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

const additionalInfo = css`
  color: #6B7280;
  font-size: 0.875rem;
  margin-top: 2px;
`

const actionButton = css`
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

const actionsHeader = css`
  padding: 12px 16px;
  font-weight: 700;
  font-size: 14px;
  color: black;
`

const actionItem = css`
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

const actionItemDanger = css`
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

const actionIcon = css`
  margin-right: 8px;
  display: flex;
  align-items: center;
`

const actionSeparator = css`
  height: 1px;
  background-color: #E5E7EB;
  margin: 4px 0;
`

const actionsOverlay = css`
  position: fixed;
  width: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
  overflow: hidden;
  border: 1px solid #E5E7EB;
`


export function UserTable({ users }: { users: User[] }) {
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

  return (
    <div className={tableWrapper}>
      <table className={tableContainer}>
        <thead>
          <tr className={tableHeader}>
            <th className={tableHeaderCell}>Phone</th>
            <th className={tableHeaderCell}>Country</th>
            <th className={tableHeaderCell}>Id</th>
            <th className={tableHeaderCell}>Total Balance</th>
            <th className={tableHeaderCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className={tableRow}>
              <td className={tableCell}>{user.phone_number}</td>
              <td className={tableCell}>{user.country}</td>
              <td className={tableCell}>
                <div>{user.id_type}</div>
                <div className={additionalInfo}>{user.id_number}</div>
              </td>
              <td className={tableCell}> 
                {balances.find(b => b.userId === user.id)?.balance ?? 'Loading...'}
              </td>
              <td className={tableCell}>
                <button className={actionButton} onClick={(e) => toggleMenu(index, e)}>
                  <MoreHorizontal size={20} />
                  {activeMenu === index && (
                    <div
                      className={actionsOverlay}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: "fixed",
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                        transform: "translate(-90%, 10px)",
                      }}>
                      <div className={actionsHeader}>Actions</div>
                      <div className={actionItem}>
                        View Activity
                      </div>
                      <div className={actionItem}>
                        Unlock
                      </div>
                      <div className={actionSeparator}></div>
                        <div className={actionItemDanger}>
                          <span className={actionIcon}>
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
