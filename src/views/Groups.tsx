import { css } from "@linaria/atomic"
import { Layout } from "../components/Layout/DashboardLayout"
import { Header } from "../components/Layout/Header"
import { useEffect, useState } from "react"
import Toast from "../components/Cards/Toast"
import useToasts from "../hooks/useToast"
import Loader from "../components/Loader"
import { getGroups } from "../data/api/groups"
import { useSearch } from "wouter"
import { GroupsTable } from "../components/Tables/GroupsTable"
import type { Group } from "../types/groups.types"
import { Search } from "lucide-react"
import { BORDER_COLOR, THEME_COLOR } from "../styles/colors"

const containerStyles = css`
  padding: 24px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }
`

const searchContainerStyles = css`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const searchWrapperStyles = css`
  position: relative;
  flex: 1;
`

const searchInputStyles = css`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid ${BORDER_COLOR};
  border-radius: 0.5rem;
  font-size: 0.95rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${THEME_COLOR};
    box-shadow: 0 0 0 3px ${THEME_COLOR}15;
  }
`

const searchIconStyles = css`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  width: 18px;
  height: 18px;
`

const searchButtonStyles = css`
  background-color: ${THEME_COLOR};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${THEME_COLOR};
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`


export default function Groups() {
  const search = useSearch();
  const [searchQuery, setSearchQuery] = useState("")
  const userId = new URLSearchParams(search).get('userId');
  const [loading, setLoading] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const { toasts, addToast, removeToast } = useToasts()

  const handleSearch = () => {
      
  }

  useEffect(() => {
    getGroups(parseInt(userId || "0"))
      .then((groups) => {
        if (groups.length === 0) {
          addToast("No groups found for the given user", "error");
        }
        setGroups(groups);
      })
      .catch(() => {
        addToast(`Error fetching groups`, "error");
      })
      .finally(() => {
        setLoading(false);
      }
    )
    }, [userId, addToast])
    
  return (
    <Layout>
      <div className={containerStyles}>
        <Header heading="Groups" description="Manage and view groups." />
        <div className={searchContainerStyles}>
          <div className={searchWrapperStyles}>
            <Search className={searchIconStyles} />
            <input
              type="text"
              className={searchInputStyles}
              placeholder="Search groups by member phone number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className={searchButtonStyles} onClick={handleSearch} disabled={loading}>
            Search
          </button>
        </div>      
        <GroupsTable groups={groups}/>
      </div>

      {loading && <Loader />}

      {toasts.map((toast, i) => (
        <Toast
          key={toast.id}
          index={i}
          message={toast}
          onRemove={removeToast}
          isSuccess={toast.type === "success"}
        />
      ))}
    </Layout>
  )
}
