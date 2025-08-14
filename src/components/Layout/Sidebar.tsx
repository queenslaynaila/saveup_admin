import { css, cx } from "@linaria/core"
import { Link, useLocation } from "wouter"
import { FiUsers, FiPocket, FiTarget } from "react-icons/fi"
import { ImStatsBars2 } from "react-icons/im";
import { MdManageAccounts } from "react-icons/md";
import { RiAwardLine } from "react-icons/ri";

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

type SidebarNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
};

const sidebarNavItems: SidebarNavItem[] = [
  { href: "/admin/users", label: "Users", icon: FiUsers },
  { href: "/admin/stats", label: "Stats", icon: ImStatsBars2 },
  { href: "/admin/commissions", label: "Commissions", icon: RiAwardLine },
  { href: "/admin/moderators", label: "CSR", icon: MdManageAccounts },
  { href: "/admin/pockets", label: "Pockets", icon: FiPocket },
  { href: "/admin/campaigns", label: "Campaigns", icon: FiTarget }
];

const Sidebar: React.FC = () => {
  const [currentLocation] = useLocation();

  const isNavItemActive = (path: string) => currentLocation === path;

  return (
    <aside className={sidebarContainerStyles}>
      <ul className={navListStyles}>
        {sidebarNavItems.map((item) => (
          <li key={item.href} 
              className={cx(
                navItemStyles,isNavItemActive(item.href) 
                && activeNavItemStyles
              )}
            >
            <Link href={item.href} className={navLinkStyles}>
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;