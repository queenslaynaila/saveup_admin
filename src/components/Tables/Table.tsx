import { css, cx } from "@linaria/atomic"
import { type ReactNode } from "react"
import RenderFilters from "./RenderFilters"
import RenderPagination from "./RenderPagination"
 
const containerStyles = css`
  margin-top: 2rem;
  overflow-x: auto;
  border-radius: 0.5rem;
  background-color: white;
`;

const tableStyles = css`
  width: 100%;
  border-radius: 0.5rem;
  border-collapse: collapse;
  overflow: hidden;
`;

const tableRowStyles = css`
  border-bottom: 1px solid #e5e7eb;
`;

const tableHeaderCellStyles = css`
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: #1f2937;
`;

const tableRowBaseStyles = css`
  border-bottom: 1px solid #d1d5db; 
  &:last-child { 
    border-bottom: none; 
  }
  &:hover {
    background-color: #f9fafb;
  }
`;

const tableCellBaseStyles = css`
  padding: 0.75rem;
  color: #111827;
  font-size: 0.875rem;
`;

const borderlessStyle = css`
  table, td, tr {
    border: none !important;
    background: transparent;
  }
  th {
    border-bottom: 1px solid #e5e7eb; 
  }
`;


export type TableColumnConfig<T> = {
  key: string
  header: string
  render: (item: T) => ReactNode
  align?: "left" | "center" | "right"
}

export type FilterOption = {
  value: string
  label: string
}

export type TableFilterConfig = {
  key: string
  label: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

export type TablePaginationConfig = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export type TableProps<T> = {
  data: T[]
  columns: TableColumnConfig<T>[]
  filters?: TableFilterConfig[]
  pagination?: TablePaginationConfig
  loading?: boolean
  error?: string | null
  emptyMessage?: string
  onClearFilters?: () => void
  isBorderless?: boolean
}

const Table = <T,>({
  data,
  columns,
  filters = [],
  pagination,
  onClearFilters,
  isBorderless = false,
}: TableProps<T>) => {
  
  const getActiveFilterCount = (filter: TableFilterConfig) => {
    if (filter.value === "All") return null
    return data.length
  }

  return (
    <div>
      <RenderFilters
        filters={filters}
        getFilteredCount={getActiveFilterCount}
        onClearFilters={onClearFilters}
      />

      <div className={cx(containerStyles, isBorderless && borderlessStyle)}>
        <table className={tableStyles}>
          <thead>
            <tr className={tableRowStyles}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={tableHeaderCellStyles}
                  style={{ textAlign: column.align || "left" }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={tableRowBaseStyles}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={tableCellBaseStyles}
                    style={{ textAlign: column.align || "left" }}
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {pagination && <RenderPagination pagination={pagination} />}
      </div>
    </div>
  )
}

export default Table;
