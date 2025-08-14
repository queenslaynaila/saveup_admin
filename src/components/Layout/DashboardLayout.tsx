import { useState } from "react"
import type React from "react"
import { css, cx } from "@linaria/core"
import { Menu } from "lucide-react"
import Sidebar from "./Sidebar"
import { 
  BG_CARD_COLOR, 
  BORDER_COLOR, 
  SHADOW_MEDIUM, 
  TEXT_PRIMARY, 
  THEME_COLOR 
} from "../../styles/colors"
import { FlexBetweenCenter, FlexCenter } from "../../styles/commonStyles"
import { useLocation } from "wouter"
import { getUserData, signOut } from "../../api/auth"

const layoutContainerStyles = css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F9FAFB;
`

const dashheaderStyles = css`
  padding: 0 24px;
  height: 64px;
  border-bottom: 1px solid #E5E7EB;
  background-color: #fff;
`

const menuButtonStyles = css`
  background: none;
  border: none;
  cursor: pointer;
  display: none;
  padding: 0;
  color: #111827;
  
  @media (max-width: 768px) {
    display: flex;
  }
`

const headerTitleStyles = css`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  line-height: 24px;

`

const mainContentStyles = css`
  display: flex;
  flex: 1;
  position: relative;
`

const sidebarWrapperStyles = css`
  width: 240px;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 64px;
    left: -240px;
    height: calc(100vh - 64px);
    z-index: 50;
    transition: left 0.3s ease;
  }
`

const sidebarVisibleStyles = css`
  left: 0;
`

const pageContentStyles = css`
  flex: 1;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`
const avatarContainerStyles = css`
  position: relative;
`

const avatarStyles = css`
  font-weight: 500;
  background-color:${THEME_COLOR};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  justify-content: center;
  border:none;
`

const dropdownMenuStyles = css`
  position: absolute;
  top: calc(100% + 0.5rem); 
  right: 0;
  background-color: ${BG_CARD_COLOR};
  border: 1px solid ${BORDER_COLOR};
  border-radius: 0.5rem;
  box-shadow: ${SHADOW_MEDIUM};
  min-width: 120px;
  z-index: 50; 
  overflow: hidden;
`

const dropdownMenuItemStyles = css`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  color: ${TEXT_PRIMARY};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
`
type LayoutProps = {
  children: React.ReactNode;
};

const getUserInitials = (name: string) => name ? name.slice(0, 2).toUpperCase() : "AD";

const UserAvatarMenu: React.FC<{
  userName: string;
  isDropdownOpen: boolean;
  onToggleDropdown: () => void;
  onSignOut: (e: React.MouseEvent) => void;
}> = ({ userName, isDropdownOpen, onToggleDropdown, onSignOut }) => (
  <div className={avatarContainerStyles}>
    <button className={avatarStyles} onClick={onToggleDropdown}>
      {getUserInitials(userName)}
    </button>
    {isDropdownOpen && (
      <div className={dropdownMenuStyles}>
        <button className={dropdownMenuItemStyles} onClick={onSignOut}>
          Sign Out
        </button>
      </div>
    )}
  </div>
);

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const [, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userName = getUserData()!.full_name;

  const handleSignOutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    signOut().then((status) => {
      if (status === 204) {
        setLocation("/log-in");
      }
    });
  };

  const handleToggleDropdown = () => setIsDropdownOpen((open) => !open);

  return (
    <div className={layoutContainerStyles}>
      <header className={cx(dashheaderStyles, FlexBetweenCenter)}>
        <div className={FlexCenter} style={{ gap: "8px" }}>
          <button
            className={menuButtonStyles}
            onClick={() => setIsSidebarOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <h2 className={headerTitleStyles}>Admin Dashboard</h2>
        </div>
        <UserAvatarMenu
          userName={userName}
          isDropdownOpen={isDropdownOpen}
          onToggleDropdown={handleToggleDropdown}
          onSignOut={handleSignOutClick}
        />
      </header>
      <div className={mainContentStyles}>
        <div className={cx(sidebarWrapperStyles, isSidebarOpen && sidebarVisibleStyles)}>
          <Sidebar />
        </div>
        <main className={pageContentStyles}>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;