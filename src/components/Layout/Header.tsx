"use client"

import { Menu } from "lucide-react"
import { css } from "@linaria/core"
import { TEXT_PRIMARY, BORDER_COLOR, THEME_COLOR } from "../../styles/colors"

const headerStyles = css`
  background-color: white;
  border-bottom: 1px solid ${BORDER_COLOR};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 64px;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const leftSectionStyles = css`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const menuButtonStyles = css`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
  color: ${TEXT_PRIMARY};
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const titleStyles = css`
  h3 {
    margin: 0;
    color: ${TEXT_PRIMARY};
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    h3 {
      font-size: 1.1rem;
    }
  }
`

const avatarStyles = css`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${THEME_COLOR};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
`

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <div className={headerStyles}>
      <div className={leftSectionStyles}>
        <button className={menuButtonStyles} onClick={onMenuToggle} aria-label="Toggle menu">
          <Menu size={24} />
        </button>
        <div className={titleStyles}>
          <h3>Admin Dashboard</h3>
        </div>
      </div>

      <div className={avatarStyles}>AD</div>
    </div>
  )
}
