
import { css, cx } from "@linaria/atomic"
import type React from "react"
import { useState, useEffect } from "react"
import { FiPlus, FiTrash2 } from "react-icons/fi"
import { ActionButton } from "../Cards/ActionButton"

const containerStyles = css`
   margin-top: 1rem;
`;

const headerContainerStyles = css`
  display: flex;
  align-items: center;
  align-items:center;
  gap: 0.5rem;
   margin-bottom: 1rem;
`;

const labelStyles = css`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const tableContainerStyles = css`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow-x: auto;
  width: 100%;
  max-width: 100%;
`;

const tableStyles = css`
  width: 100%;
  min-width: 300px;
  
  @media (min-width: 640px) {
    min-width: 400px;
  }
  
  @media (min-width: 768px) {
    min-width: 500px;
  }
`;

const tableHeaderStyles = css`
  background-color: #f9fafb;
`

const tableHeaderCellStyles = css`
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  @media (min-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const tableCellStyles = css`
  padding: 0.5rem 0.75rem;
  
  @media (min-width: 768px) {
    padding: 0.75rem 1rem;
  }
`


const tableBodyStyles = css`
  & > tr + tr {
    border-top: 1px solid #e5e7eb;
  }
`

const tableRowStyles = css`
  &:hover {
    background-color: #f9fafb;
  }
`
 

const rangeTextStyles = css`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
`

const inputStyles = css`
  width: 100%;
  min-width: 60px;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  
  @media (min-width: 640px) {
    min-width: 70px;
  }
  
  @media (min-width: 768px) {
    min-width: 80px;
  }
  
  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 1px #000000;
  }
`

const examplesContainerStyles = css`
  background-color: #d7d9dc;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
`

const examplesHeaderStyles = css`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`

const examplesListStyles = css`
  & > * + * {
    margin-top: 0.25rem;
  }
`

const exampleTextStyles = css`
  font-size: 0.75rem;
  color: #4b5563;
`

interface WithdrawalTier {
  threshold: number
  charge: number
}

interface WithdrawalChargesEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export const WithdrawalChargesEditor: React.FC<WithdrawalChargesEditorProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [tiers, setTiers] = useState<WithdrawalTier[]>([])

  useEffect(() => {
    if (!value || !value.includes("steps;")) {
      setTiers([{ threshold: 0, charge: 0 }])
      return
    }

    try {
      const stepsSection = value.split("steps;")[1]?.trim()
      if (!stepsSection) {
        setTiers([{ threshold: 0, charge: 0 }])
        return
      }

      const parsedTiers = stepsSection.split(",").map((tier) => {
        const [threshold, charge] = tier.split(":").map(Number)
        return { threshold: threshold || 0, charge: charge || 0 }
      })

      setTiers(parsedTiers.length > 0 ? parsedTiers : [{ threshold: 0, charge: 0 }])
    } catch (error) {
      console.error("Error parsing withdrawal charges:", error)
      setTiers([{ threshold: 0, charge: 0 }])
    }
  }, [value])

  const updateValue = (newTiers: WithdrawalTier[]) => {
    const sortedTiers = [...newTiers].sort((a, b) => a.threshold - b.threshold)
    const tiersString = sortedTiers.map((tier) => `${tier.threshold}:${tier.charge}`).join(",")
    onChange(`steps; ${tiersString}`)
  }

  const addTier = () => {
    const newTiers = [...tiers, { threshold: 0, charge: 0 }]
    setTiers(newTiers)
    updateValue(newTiers)
  }

  const removeTier = (index: number) => {
    if (tiers.length <= 1) return
    const newTiers = tiers.filter((_, i) => i !== index)
    setTiers(newTiers)
    updateValue(newTiers)
  }

  const updateTier = (index: number, field: "threshold" | "charge", value: number) => {
    const newTiers = tiers.map((tier, i) => (i === index ? { ...tier, [field]: value } : tier))
    setTiers(newTiers)
    updateValue(newTiers)
  }


  const getTierRange = (index: number) => {
    const sortedTiers = [...tiers].sort((a, b) => a.threshold - b.threshold)
    const currentTier = sortedTiers[index]
    const nextTier = sortedTiers[index + 1]

    if (!currentTier) return ""

    if (nextTier) {
      return `${currentTier.threshold.toLocaleString()} - ${(nextTier.threshold - 1).toLocaleString()}`
    } else {
      return `${currentTier.threshold.toLocaleString()}+`
    }
  }

  const generateRangeExamples = () => {
    const sortedTiers = [...tiers].sort((a, b) => a.threshold - b.threshold)
    const examples = []

    for (let i = 0; i < Math.min(3, sortedTiers.length); i++) {
      const currentTier = sortedTiers[i]
      const nextTier = sortedTiers[i + 1]

      if (nextTier) {
        const rangeStart = currentTier.threshold
        const rangeEnd = nextTier.threshold - 1
        examples.push({
          range: `${rangeStart.toLocaleString()} to ${rangeEnd.toLocaleString()}`,
          charge: currentTier.charge,
        })
      } else {
         
        examples.push({
          range: `${currentTier.threshold.toLocaleString()}+`,
          charge: currentTier.charge,
        })
      }
    }

    return examples
  }

  return (
    <div className={cx(containerStyles, className)}>
       
        <div className={headerContainerStyles}>
          <label className={labelStyles}>Withdrawal Charge Tiers</label>
          <ActionButton onClick={addTier} variant="secondary" size="sm" icon={FiPlus}>
            Add Tier
          </ActionButton>
        </div>

        <div className={tableContainerStyles}>
          <table className={tableStyles}>
            <thead className={tableHeaderStyles}>
              <tr>
                <th className={tableHeaderCellStyles}>Amount Range</th>
                <th className={tableHeaderCellStyles}>Threshold</th>
                <th className={tableHeaderCellStyles}>Charge</th>
                <th className={tableHeaderCellStyles}>Actions</th>
              </tr>
            </thead>
            <tbody className={tableBodyStyles}>
              {[...tiers]
                .sort((a, b) => a.threshold - b.threshold)
                .map((tier, index) => {
                  const originalIndex = tiers.findIndex(
                    (t) => t.threshold === tier.threshold && t.charge === tier.charge,
                  )
                  return (
                    <tr key={originalIndex} className={tableRowStyles}>
                      <td className={tableCellStyles}>
                        <div className={rangeTextStyles}>{getTierRange(index)}</div>
                      </td>
                      <td className={tableCellStyles}>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={tier.threshold}
                          onChange={(e) =>
                            updateTier(originalIndex, "threshold", Number.parseFloat(e.target.value) || 0)
                          }
                          className={inputStyles}
                          placeholder="0"
                        />
                      </td>
                      <td className={tableCellStyles}>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={tier.charge}
                          onChange={(e) => updateTier(originalIndex, "charge", Number.parseFloat(e.target.value) || 0)}
                          className={inputStyles}
                          placeholder="0"
                        />
                      </td>
                      <td className={tableCellStyles}>
                        {tiers.length > 1 && (
                          <ActionButton
                            onClick={() => removeTier(originalIndex)}
                            variant="danger"
                            size="sm"
                            icon={FiTrash2}
                          />
                        )}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        <div className={examplesContainerStyles}>
          <h4 className={examplesHeaderStyles}>Examples:</h4>
           <div className={examplesListStyles}>
            {generateRangeExamples().map((example, index) => (
              <div key={index} className={exampleTextStyles}>
                Withdraw between {example.range}  Charge: {example.charge} 
              </div>
            ))}
          </div>
        </div>
      
    </div>
  )
}
