import { css } from "@linaria/core"
import { TEXT_PRIMARY, BORDER_COLOR, LIGHT_THEME_COLOR } from "../../styles/colors"

const sidebarStyles = css`
  width: 260px;
  border-right: 1px solid ${BORDER_COLOR};
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  
  @media (max-width: 768px) {
    position: fixed;
    top: 64px;
    left: 0;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    
    &.open {
      transform: translateX(0);
    }
  }
`

const navStyles = css`
  flex: 1;
  padding: 0;
  overflow-y: auto;
`

const navItemStyles = css`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: ${TEXT_PRIMARY};
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  text-align: left;
  
  &:hover {
    background-color: ${LIGHT_THEME_COLOR};
  }
  
  &.active {
    background-color:${LIGHT_THEME_COLOR};
    font-weight: 500;
  }
  
  .icon {
    margin-right: 0.75rem;
    font-size: 1.2rem;
    width: 20px;
    display: flex;
    justify-content: center;
  }
  
  .label {
    font-size: 0.95rem;
  }
`

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navItems = [
    { icon: "📊", label: "Dashboard", href: "/dashboard", active: true },
    { icon: "👥", label: "Users", href: "/users" },
    { icon: "💰", label: "Savings", href: "/savings" },
    { icon: "🎯", label: "Goals", href: "/goals" },
    { icon: "📈", label: "Analytics", href: "/analytics" },
    { icon: "⚙️", label: "Settings", href: "/settings" },
  ]

  return (
    <div className={`${sidebarStyles} ${isOpen ? "open" : ""}`}>
      <nav className={navStyles}>
        {navItems.map((item, index) => (
          <button key={index} className={`${navItemStyles} ${item.active ? "active" : ""}`} onClick={onClose}>
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
