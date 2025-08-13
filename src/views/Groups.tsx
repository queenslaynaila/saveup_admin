import { css } from "@linaria/atomic"
import { Layout } from "../components/Layout/DashboardLayout"
import { Header } from "../components/Layout/Header"
import { useEffect, useState } from "react"
import Toast from "../components/Cards/Toast"
import useToasts from "../hooks/useToast"
import Loader from "../components/Loader"
import { getGroups } from "../api/api/groups"
import { useSearch } from "wouter"
import { GroupsTable } from "../components/Tables/GroupsTable"
import type { Group } from "../types/groups.types"

const containerStyles = css`
  padding: 24px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }
`

export default function Groups() {
  const search = useSearch();
  const userId = new URLSearchParams(search).get('userId');
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const { toasts, addToast, removeToast } = useToasts();

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
