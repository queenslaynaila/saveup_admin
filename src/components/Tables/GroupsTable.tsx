import { css } from "@linaria/atomic"
import { useState} from "react"
import type { Group } from "../../types/groups.types"
import { formatDate } from "../../utils/formartDate"

const cardWrapperStyles = css`
  width: 100%;
  margin-top: 2rem; 
  border-radius: 0.5rem;
  background-color: white;
`

const cardHeaderStyles = css`
  padding: 1.5rem; 
  border-bottom: 1px solid #e5e7eb;
`

const cardTitleStyles = css`
  font-size: 1.25rem; 
  font-weight: 600;
  color: #1f2937; 
`

const cardContentStyles = css`
  padding: 1.5rem;
`

const tableWrapperStyles = css`
  overflow-x: auto;
  border-radius: 0.375rem;  
  border: 1px solid #e5e7eb;  
  background-color: white;
`

const tableContainerStyles = css`
  width: 100%;
  border-collapse: collapse;
`

const tableHeaderStyles = css`
  background-color: #f9fafb;
`

const tableHeaderCellStyles = css`
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 500; 
  color: #374151; 
`

const tableRowStyles = css`
  border-bottom: 1px solid #e5e7eb;
  &:last-child {
    border-bottom: none; 
  }
  &:hover {
    background-color: #f9fafb;
  }
`

const tableCellStyles = css`
  padding: 0.75rem 1rem;  
  color: #111827; 
  font-size: 0.875rem;
`

const emptyStateCellStyles = css`
  height: 6rem; 
  text-align: center;
  color: #6b7280;
`

const paginationContainerStyles = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;  
  margin-top: 1.5rem;  
  padding: 0.75rem 0; 
`

const paginationButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;  
  height: 2.5rem;  
  border: 1px solid #e5e7eb;  
  border-radius: 0.375rem;  
  background-color: white;
  color: #3b82f6; 
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #f9fafb; 
  }
  &:disabled {
    color: #9ca3af; 
    cursor: not-allowed;
    background-color: white;
  }
`

const currentPageIndicatorStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;  
  border: 1px solid #e5e7eb; 
  border-radius: 0.375rem;  
  background-color: white;
  color: #1f2937; 
  font-weight: 500;  
`

interface GroupsTableProps {
  groups: Group[]
}

export function GroupsTable({ groups }: GroupsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(groups.length / itemsPerPage)
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className={cardWrapperStyles}>
      <div className={cardHeaderStyles}>
        <h2 className={cardTitleStyles}>Groups</h2>
      </div>

      <div className={cardContentStyles}>

        <div className={tableWrapperStyles}>
          <table className={tableContainerStyles}>
            <thead>
              <tr className={tableHeaderStyles}>
                <th className={tableHeaderCellStyles}>Name</th>
                <th className={tableHeaderCellStyles}>CreatedBy</th>
                <th className={tableHeaderCellStyles}>CreatedAt</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group, index) => (
                <tr key={index} className={tableRowStyles}>
                  <td className={tableCellStyles}>
                    {group.name}
                  </td>
                  <td className={tableCellStyles}>
                    {group.created_by}
                  </td>         
                  <td className={tableCellStyles}>
                    {formatDate(group.created_at)}
                  </td>
                </tr>
              ))}
              {groups.length === 0 && (
                <tr className={tableRowStyles}>
                  <td colSpan={6} className={emptyStateCellStyles}>
                     Selected user has no groups.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={paginationContainerStyles}>
          <button 
            className={paginationButtonStyles}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          <span className={currentPageIndicatorStyles}>
            {currentPage}
          </span>
          <button 
            className={paginationButtonStyles}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  )
}
