import { useState, useEffect } from "react"
import { mockUsers } from "../api/mockUsers"
import type { User } from "../types/user.types"
import { css } from "@linaria/atomic"
import { Layout } from "../components/Layout/DashboardLayout"
import { Header } from "../components/Layout/Header"
import { Phone } from "lucide-react"
import { BORDER_COLOR, TEXT_PRIMARY, THEME_COLOR } from "../styles/colors"

const container = css`
  padding: 24px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }
`

const tableWrapper = css`
  background-color: white;
  border: 1px solid ${BORDER_COLOR};
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px; 
`

const table = css`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid ${BORDER_COLOR};
    font-size: 0.95rem;
  }

  th {
    background-color: #f9fafb;
    font-weight: 600;
    color: ${TEXT_PRIMARY};
  }

  td {
    color: #334155;
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: ${THEME_COLOR}20;
    color: ${THEME_COLOR};
    font-weight: 600;
    font-size: 0.85rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    flex-shrink: 0;
  }

  .phone {
    display: flex;
    align-items: center;
    gap: 6px;

    svg {
      width: 14px;
      height: 14px;
      color: ${THEME_COLOR};
    }

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    accent-color: ${THEME_COLOR};
    cursor: pointer;
  }
`

const emptyState = css`
  text-align: center;
  padding: 40px 20px;
  background-color: white;
  border: 1px solid ${BORDER_COLOR};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;  

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${TEXT_PRIMARY};
    margin-bottom: 8px;
  }

  p {
    color: #64748b;
    font-size: 0.95rem;
  }
`

const sectionTitle = css`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${TEXT_PRIMARY};
  margin-top: 32px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-top: 24px;
    margin-bottom: 12px;
  }
`

type UserWithExtras = User & {
  deposit_count: number
  last_login: string
  last_deposit: string | null
}

type PreviouslyCalledUser = User & {
  feedback: "Unanswered" | "Successful" | "Rejected" | "Callback"
  call_date: string
}

export default function Campaigns() {
  const [filterType, setFilterType] = useState<"no_deposits" | "inactive_6_months">("no_deposits")
  const [filteredUsers, setFilteredUsers] = useState<UserWithExtras[]>([])
  const [calledStatus, setCalledStatus] = useState<{ [key: number]: boolean }>({})
  const [previouslyCalledUsers, setPreviouslyCalledUsers] = useState<PreviouslyCalledUser[]>([])
  const [, setFilteredCalledUsers] = useState<PreviouslyCalledUser[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [fromDate, setFromDate] = useState<string>("")
  const [toDate, setToDate] = useState<string>("")

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const usersWithExtras = mockUsers.map((user) => {
    const deposit_count = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 3)
    const last_login = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    const last_deposit =
      deposit_count > 0 ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString() : null
    return { ...user, deposit_count, last_login, last_deposit }
  })

  useEffect(() => {
    const stored = localStorage.getItem("calledStatus")
    if (stored) {
      setCalledStatus(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("calledStatus", JSON.stringify(calledStatus))
  }, [calledStatus])

  useEffect(() => {
    const feedbackOptions: PreviouslyCalledUser["feedback"][] = ["Unanswered", "Successful", "Rejected", "Callback"]
    const generateRandomDate = () => {
      const start = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // 1 year ago
      const end = new Date()
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString()
    }

    const shuffledUsers = [...mockUsers].sort(() => 0.5 - Math.random())
    const numPreviouslyCalled = Math.floor(Math.random() * (mockUsers.length / 2)) + 3 // 3 to half of total users
    const mockPreviouslyCalled = shuffledUsers.slice(0, numPreviouslyCalled).map((user) => ({
      ...user,
      feedback: feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)],
      call_date: generateRandomDate(),
    }))
    setPreviouslyCalledUsers(mockPreviouslyCalled)
  }, [])

  const logUserCalled = (user: User) => {
    console.log(`User called: ${user.full_name} (${user.phone_number})`)
  }

  const handleCheckboxChange = (user: User, isChecked: boolean) => {
    setCalledStatus((prev) => ({
      ...prev,
      [user.id]: isChecked,
    }))
    if (isChecked) logUserCalled(user)
  }

  const filterNoDeposits = (users: UserWithExtras[]) =>
    users
      .filter((u) => u.deposit_count === 0)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  const filterInactive6Months = (users: UserWithExtras[]) =>
    users.filter((u) => {
      const lastLoginDate = new Date(u.last_login)
      const lastDepositDate = u.last_deposit ? new Date(u.last_deposit) : null
      return lastLoginDate < sixMonthsAgo || (lastDepositDate && lastDepositDate < sixMonthsAgo) || !u.last_deposit
    })

  const handleSearch = () => {
    let result: UserWithExtras[] = []

    if (filterType === "no_deposits") {
      result = filterNoDeposits(usersWithExtras)
    } else if (filterType === "inactive_6_months") {
      result = filterInactive6Months(usersWithExtras)
    }

    setFilteredUsers(result)
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  const applyCalledFilters = () => {
  const from = fromDate ? new Date(fromDate) : null
  const to = toDate ? new Date(toDate) : null

  const filtered = previouslyCalledUsers.filter((user) => {
    const matchesStatus = statusFilter ? user.feedback === statusFilter : true
    const callDate = new Date(user.call_date)

    const withinFrom = from ? callDate >= from : true
    const withinTo = to ? callDate <= to : true

    return matchesStatus && withinFrom && withinTo
  })

  setFilteredCalledUsers(filtered)
}


  return (
    <Layout>
      <div className={container}>
        <Header heading="Campaigns" description="Manage and track outreach to dormant users." />
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${BORDER_COLOR}` }}
          >
            <option value="no_deposits">Signed Up, No Deposits</option>
            <option value="inactive_6_months">Inactive 6+ Months</option>
          </select>

          <button
            onClick={handleSearch}
            style={{
              padding: "8px 16px",
              backgroundColor: THEME_COLOR,
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>

        {filteredUsers.length === 0 ? (
          <div className={emptyState}>
            <h3>No users match your criteria.</h3>
            <p>Try changing your filter to find users.</p>
          </div>
        ) : (
          <div className={tableWrapper}>
            <table className={table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Phone</th>
                  <th>Called</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div className="avatar">{getInitials(user.full_name)}</div>
                        {user.full_name}
                      </div>
                    </td>
                    <td>
                      <div className="phone">
                        <Phone />
                        <span>{user.phone_number}</span>
                      </div>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={calledStatus[user.id] || false}
                        onChange={(e) => handleCheckboxChange(user, e.target.checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2 className={sectionTitle}>Previously Called Users</h2>
        <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 12 }}>
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${BORDER_COLOR}` }}
            >
                <option value="">All Statuses</option>
                <option value="Unanswered">Unanswered</option>
                <option value="Successful">Successful</option>
                <option value="Rejected">Rejected</option>
                <option value="Callback">Callback</option>
            </select>
            <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${BORDER_COLOR}` }}
            />
            <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${BORDER_COLOR}` }}
            />
            <button
                onClick={applyCalledFilters}
                style={{
                padding: "8px 16px",
                backgroundColor: THEME_COLOR,
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                }}
            >
                Apply Filters
            </button>
        </div>
        
        {previouslyCalledUsers.length === 0 ? (
          <div className={emptyState}>
            <h3>No previously called users found.</h3>
            <p>Once users are called, they will appear here.</p>
          </div>
        ) : (
          <div className={tableWrapper}>
            <table className={table}>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Phone Number</th>
                  <th>Feedback</th>
                  <th>Call Date</th>
                </tr>
              </thead>
              <tbody>
                {previouslyCalledUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div className="avatar">{getInitials(user.full_name)}</div>
                        {user.full_name}
                      </div>
                    </td>
                    <td>
                      <div className="phone">
                        <Phone />
                        <span>{user.phone_number}</span>
                      </div>
                    </td>
                    <td>{user.feedback}</td>
                    <td>{user.call_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
