import { css } from "@linaria/atomic"
import { useState, type FC } from "react"
import type { User } from "../../types/user.types"

const tableWrapperStyles = css`
  margin-top: 2rem;
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid #E5E7EB;
  background-color: white;
`;

const tableContainerStyles = css`
  width: 100%;
  border-radius: 0.5rem;
  border-collapse: collapse;
  overflow: hidden;
`;

const tableHeaderStyles = css`
  background-color: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
`;

const tableHeaderCellStyles = css`
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: rgb(45, 47, 49);
`

const tableRowStyles = css`
  border-bottom: 1px solid #E5E7EB;
  &:hover {
    background-color: #F9FAFB;
  }
  &:last-child {
    border-bottom: none;
  }
`

const tableCellStyles = css`
  padding: 1rem;
  color: #111827;
  font-size: 14px;
`

const additionalInfoStyles = css`
  color: #6B7280;
  font-size: 0.875rem;
  margin-top: 2px;
`

const paginationContainerStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 16px 0 8px 0;
`;

const paginationButtonStyles = css`
  padding: 6px 12px;
  border: 1px solid #E5E7EB;
  background: white;
  color: #374151;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  &:disabled {
    color: #9CA3AF;
    border-color: #E5E7EB;
    cursor: not-allowed;
    background: #F3F4F6;
  }
  &.active {
    background: #F9FAFB;
    font-weight: bold;
    border-color: #374151;
  }
`;

type Moderator = Pick<User, 'id'|
  'id_type'|
  'id_number'|
  'country'|
  'role'|
  'gender'|
  'full_name'|
  'phone_number'|
  'created_at'>

type UserTableProps = {
  users: Moderator[]
}


const UserTable: FC<UserTableProps> = ({ users}) => {
  const [, setActiveMenu] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setActiveMenu(null);
  };

  return (
    <div className={tableWrapperStyles}>
      <table className={tableContainerStyles}>
        <thead>
          <tr className={tableHeaderStyles}>
            <th className={tableHeaderCellStyles}>Name</th>
            <th className={tableHeaderCellStyles}>Phone</th>
            <th className={tableHeaderCellStyles}>Country</th>
            <th className={tableHeaderCellStyles}>Gender</th>
            <th className={tableHeaderCellStyles}>Id</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user, index) => (
            <tr key={index + (currentPage - 1) * pageSize} className={tableRowStyles}>
              <td className={tableCellStyles}>{user.full_name}</td>
              <td className={tableCellStyles}>{user.phone_number}</td>
              <td className={tableCellStyles}>{user.country}</td>
              <td className={tableCellStyles}>{user.gender}</td>
              <td className={tableCellStyles}>
                <div>{user.id_type}</div>
                <div className={additionalInfoStyles}>{user.id_number}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className={paginationContainerStyles}>
          <button
            className={paginationButtonStyles}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={
                paginationButtonStyles + (currentPage === i + 1 ? ' active' : '')
              }
              onClick={() => handlePageChange(i + 1)}
              disabled={currentPage === i + 1}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={paginationButtonStyles}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default UserTable