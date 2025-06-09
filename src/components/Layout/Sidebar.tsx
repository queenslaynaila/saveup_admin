import { css } from "@linaria/core"
import { Link, useLocation } from "wouter"
import { FaUserGroup } from "react-icons/fa6";
import { FiUsers, FiPocket, FiTarget } from "react-icons/fi"

const sidebarContainerStyles = css`
  width: 240px;
  background-color: #fff;
  border-right: 1px solid #E5E7EB;
  padding: 16px 0;
  height: 100%;
`

const navListStyles = css`
  list-style: none;
  padding: 0;
  margin: 0;
`

const navItemStyles = css`
  margin: 4px 0;
`

const activeNavItemStyles = css`
  a {
    background-color: #F3F4F6;
    font-weight: 500;
  }
`

const navLinkStyles = css`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #111827;
  text-decoration: none;
  border-radius: 6px;
  margin: 0 8px;
  
  &:hover {
    background-color: #F3F4F6;
  }
  
  svg {
    color: #6B7280;
  }
`

export function Sidebar() {
  const [location] = useLocation()

  const isActive = (path: string) => {
    if (path === "/admin/dashboard" && location === path) {
      return true
    }
    return path !== "/admin/dashboard" && location.startsWith(path)
  }

  const navItems = [       
    { href: "/admin/users", label: "Users", icon: FiUsers },      
    { href: "/admin/groups", label: "Groups", icon: FaUserGroup },         
    { href: "/admin/pockets", label: "Pockets", icon: FiPocket },    
    { href: "/admin/campaigns", label: "Campaigns", icon: FiTarget }    
  ]

  return (
    <aside className={sidebarContainerStyles}>
      <ul className={navListStyles}>
        {navItems.map(({ href, label, icon: Icon }) => (
          <li key={href} className={`${navItemStyles} ${isActive(href) ? activeNavItemStyles : ""}`}>
            <Link href={href} className={navLinkStyles}>
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}