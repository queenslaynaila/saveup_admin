import React from "react";
import { css } from "@linaria/atomic";
import type { TableFilter } from "./Table";

const filtersContainerStyles = css`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
`;

const filterGroupStyles = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const filterLabelStyles = css`
  font-weight: 800;
  color: #374151;
  font-size: 0.875rem;
`;

const filterSelectStyles = css`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  min-width: 150px;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

const filterCountStyles = css`
  color: #6b7280;
  font-size: 0.875rem;
`;

const clearFiltersButtonStyles = css`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    background-color: #f9fafb;
  }
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

type RenderFiltersProps = {
  filters: TableFilter[];
  getFilteredCount: (filter: TableFilter) => number | null;
  onClearFilters?: () => void;
}

const RenderFilters: React.FC<RenderFiltersProps> = ({ filters, getFilteredCount, onClearFilters }) => {

  if (filters.length === 0) return null;
  
  return (
    <div className={filtersContainerStyles}>

      {filters.map((filter) => {
        const filteredCount = getFilteredCount(filter);
        return (
          <div key={filter.key} className={filterGroupStyles}>
            <label htmlFor={`${filter.key}-filter`} className={filterLabelStyles}>
              {filter.label}:
            </label>
            <select
              id={`${filter.key}-filter`}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className={filterSelectStyles}
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {filteredCount !== null && (
              <span className={filterCountStyles}>
                ({filteredCount} item{filteredCount !== 1 ? "s" : ""})
              </span>
            )}
          </div>
        );
      })}

      {onClearFilters && (
        <button onClick={onClearFilters} className={clearFiltersButtonStyles} type="button">
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default RenderFilters;
