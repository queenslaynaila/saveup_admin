import React from "react"
import { FiEdit2 } from "react-icons/fi"
import { css, cx } from "@linaria/atomic"
import type { Config } from "../types/configurations.types"
import { ActionButton } from "./Cards/ActionButton"

const tableContainerStyles = css`
  overflow-x: auto;
`

const tableStyles = css`
  width: 100%;
`

const tableHeaderStyles = css`
  border-bottom: 1px solid #e5e7eb;
`

const tableHeaderCellStyles = css`
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: #374151;
`

const tableRowStyles = css`
  border-bottom: 1px solid #f3f4f6;
  
  &:hover {
    background-color: #f9fafb;
  }
`

const tableCellStyles = css`
  padding: 0.75rem 1rem;
`

const countryInfoStyles = css`
  .country-name {
    font-weight: 500;
    color: #111827;
  }
  
  .country-code {
    font-size: 0.875rem;
    color: #6b7280;
  }
`

const textSmallStyles = css`
  font-size: 0.875rem;
`

const chargesDisplayStyles = css`
  font-size: 0.875rem;
  color: #111827;
  
  .charges-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .charge-tier {
    font-size: 0.75rem;
  }
  
  .more-indicator {
    font-size: 0.75rem;
    color: #6b7280;
  }
`

const textPrimaryStyles = css`
  color: #111827;
`

const buttonGroupStyles = css`
  display: flex;
  gap: 0.75rem;
`

type Props = {
  filteredConfigurations: Config[]
  handleEdit: (config: Config) => void
}

 const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

const ConfigurationsTable: React.FC<Props> = ({
  filteredConfigurations,
  handleEdit
}) => (
  <div className={tableContainerStyles}>
    <table className={tableStyles}>
      <thead>
        <tr className={tableHeaderStyles}>
          <th className={tableHeaderCellStyles}>Country</th>
          <th className={tableHeaderCellStyles}>Currency</th>
          <th className={tableHeaderCellStyles}>Calling Code</th>
          <th className={tableHeaderCellStyles}>Languages</th>
          <th className={tableHeaderCellStyles}>Deposit Limits</th>
          <th className={tableHeaderCellStyles}>Withdrawal Limits</th>
          <th className={tableHeaderCellStyles}>Charges</th>
          <th className={tableHeaderCellStyles}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredConfigurations.map((config) => (
          <tr key={config.id} className={tableRowStyles}>
            <td className={tableCellStyles}>
              <div className={countryInfoStyles}>
                <div className="country-name">{config.country_name}</div>
                <div className="country-code">{config.calling_code}</div>
              </div>
            </td>
            <td className={cx(tableCellStyles, textPrimaryStyles)}>{config.currency}</td>
            <td className={cx(tableCellStyles, textPrimaryStyles)}>+{config.calling_code}</td>
            <td className={tableCellStyles}>
              <div className={cx(textSmallStyles, textPrimaryStyles)}>{config.languages.join(", ")}</div>
            </td>
            <td className={tableCellStyles}>
              <div className={textSmallStyles}>
                <div className={textPrimaryStyles}>
                  {formatCurrency(config.min_deposit)} - {formatCurrency(config.max_deposit)}
                </div>
              </div>
            </td>
            <td className={tableCellStyles}>
              <div className={textSmallStyles}>
                <div className={textPrimaryStyles}>
                  {formatCurrency(config.min_withdrawal)} - {formatCurrency(config.max_withdrawal)}
                </div>
              </div>
            </td>
            <td className={tableCellStyles}>
              <div className={chargesDisplayStyles}>
                {config.withdrawal_charges.includes("steps;") ? (
                  <div className="charges-list">
                    {config.withdrawal_charges
                      .split("steps;")[1]
                      ?.split(",")
                      .slice(0, 3)
                      .map((tier, idx) => {
                        const [threshold, charge] = tier.split(":")
                        return (
                          <div key={idx} className="charge-tier">
                            ${threshold}+ → ${charge}
                          </div>
                        )
                      })}
                    {config.withdrawal_charges.split("steps;")[1]?.split(",").length > 3 && (
                      <div className="more-indicator">
                        +{config.withdrawal_charges.split("steps;")[1]?.split(",").length - 3} more...
                      </div>
                    )}
                  </div>
                ) : (
                  config.withdrawal_charges
                )}
              </div>
            </td>
            <td className={tableCellStyles}>
              <div className={buttonGroupStyles}>
                <ActionButton onClick={() => handleEdit(config)} variant="secondary" size="sm" icon={FiEdit2}>
                  Edit
                </ActionButton>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default ConfigurationsTable
