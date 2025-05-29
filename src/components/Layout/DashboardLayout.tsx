import type React from "react"
import { useState } from "react"
import { css } from "@linaria/core"
import { BG_PRIMARY, BG_CARD_COLOR } from "../../styles/colors"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

const layoutStyles = css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${BG_PRIMARY};
`

const contentWrapperStyles = css`
  display: flex;
  flex: 1;
`

const mainStyles = css`
  flex: 1;
  min-width: 0;
  background-color: ${BG_CARD_COLOR};
`


interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className={layoutStyles}>
      <Header onMenuToggle={toggleMobileMenu} />

      <div className={contentWrapperStyles}>
        <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
        <main className={mainStyles}>{children}</main>
      </div>

      <div className={` ${isMobileMenuOpen ? "show" : ""}`} onClick={closeMobileMenu} />
    </div>
  )
}
