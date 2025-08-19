import React from "react";
import { css, cx } from "@linaria/atomic";
import type { PaginationConfig } from "./Table";

const paginationContainerStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
  padding-bottom: 0.5rem;
`;

const paginationButtonStyles = css`
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  background-color: white;
  color: #374151;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  &:disabled {
    color: #9ca3af;
    border-color: #d1d5db;
    cursor: not-allowed;
    background-color: #f3f4f6;
  }
`;

const activePaginationButtonStyles = css`
  background-color: #f9fafb;
  font-weight: 700;
  border-color: #374151;
`;


interface RenderPaginationProps {
  pagination: PaginationConfig;
}

const RenderPagination: React.FC<RenderPaginationProps> = ({ pagination }) => {

  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className={paginationContainerStyles}>
      <button
        className={cx(paginationButtonStyles)}
        onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1}
      >
        Prev
      </button>
      {Array.from({ length: pagination.totalPages }, (_, i) => (
        <button
          key={i}
          className={cx(
            paginationButtonStyles,
            pagination.currentPage === i + 1 ? activePaginationButtonStyles : null,
          )}
          onClick={() => pagination.onPageChange(i + 1)}
          disabled={pagination.currentPage === i + 1}
        >
          {i + 1}
        </button>
      ))}
      <button
        className={cx(paginationButtonStyles)}
        onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default RenderPagination;
