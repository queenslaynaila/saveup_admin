import { css } from "@linaria/atomic"
import { Layout } from "../components/Layout/DashboardLayout"
import { Search } from "lucide-react"
import { useState } from "react"
import type { User } from "../types/user.types"
import { BORDER_COLOR, TEXT_PRIMARY, THEME_COLOR } from "../styles/colors"
import { UserTable } from "../components/Tables/UserTable"
import { UserDetailCard } from "../components/Cards/UserDetailCard"
import { Header } from "../components/Layout/Header"
import { searchUser } from "../data/api/users"

const container = css`
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
    background-color: ${THEME_COLOR}dd;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`

const emptyStateStyles = css`
  text-align: center;
  padding: 3rem 1rem;
  background-color: white;
  border: 1px solid ${BORDER_COLOR};
  border-radius: 0.5rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${TEXT_PRIMARY};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #64748b;
    margin-bottom: 1.5rem;
  }
`

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("")
  const [displayedSearchQuery, setDisplayedSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])

  const handleSearch = () => {
    setDisplayedSearchQuery(searchQuery)
    
    searchUser(searchQuery)
      .then((users)=>{
       setSearchResults(users)
      })   
  }


  return (
    <Layout>
      <div className={container}>
        <Header heading="Users" description="Manage and view user details and activity." />

        <div className={searchContainerStyles}>
          <div className={searchWrapperStyles}>
            <Search className={searchIconStyles} />
            <input
              type="text"
              className={searchInputStyles}
              placeholder="Search by phone number or ID number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className={searchButtonStyles} onClick={handleSearch}>
            Search
          </button>
        </div>

         {displayedSearchQuery && searchResults.length === 1 ? (
          <UserDetailCard user={searchResults[0]} />
        ) : (
          <UserTable users={searchResults} />
        )} 

        {displayedSearchQuery && searchResults.length === 0 && (
          <div className={emptyStateStyles}>
            <h3>No users found</h3>
            <p>No users match your search criteria. Try a different search term.</p>
          </div>
        )}

      </div>
    </Layout>
  )
}
