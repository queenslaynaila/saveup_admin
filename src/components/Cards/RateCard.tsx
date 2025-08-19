import React, { useEffect } from "react";
import { FiEdit2, FiSettings } from "react-icons/fi";
import { SectionHeader } from "./SectionHeader";
import { ActionButton } from "./ActionButton";
import { css } from "@linaria/atomic";

const cardStyles = css`
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const iconStyles = css`
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  color: #374151;
`;

const ratesGridStyles = css`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const rateCardStyles = css`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const rateHeaderStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const rateInfoStyles = css`
  display: flex;
  align-items: center;
  span {
    font-weight: 500;
    color: #111827;
    text-transform: capitalize;
  }
`;

const editFormStyles = css`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const inputRowStyles = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const rateInputStyles = css`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  outline: none;
 
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const percentLabelStyles = css`
  font-size: 0.875rem;
  color: #6b7280;
`;

const buttonRowStyles = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const rateDisplayStyles = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

type PocketType = "Standard" | "Locked";


type InterestRate = {
  pocket_type: PocketType;
  rate: number;
};

const fetchInterestRates = async (): Promise<InterestRate[]> => {
  return [
    { pocket_type: "Standard", rate: 2.5 },
    { pocket_type: "Locked", rate: 4.75 },
  ]
}

const updateInterestRate = async (pocket_type: PocketType, rate: number): Promise<void> => {
  console.log(`Updating ${pocket_type} rate to ${rate}%`)
  await new Promise((resolve) => setTimeout(resolve, 1000))
}


const RateCard: React.FC = () => {
  const [interestRates, setInterestRates] = React.useState<InterestRate[]>([]);
  const [editingRate, setEditingRate] = React.useState<PocketType | null>(null);
  const [newRate, setNewRate] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const rates = await fetchInterestRates();
        setInterestRates(rates);
      } finally {
        setLoading(false)
      }
    };
    fetchRates();
  }, []);

  const startEditing = (pocket_type: PocketType, currentRate: number) => {
    setEditingRate(pocket_type);
    setNewRate(currentRate.toString());
  };

  const cancelEditing = () => {
    setEditingRate(null);
    setNewRate("");
  };

  const handleUpdateRate = async (pocket_type: PocketType) => {
    if (!newRate || isNaN(Number.parseFloat(newRate))) return;
    try {
      await updateInterestRate(pocket_type, Number.parseFloat(newRate));
      setInterestRates((prev) =>
        prev.map((rate) =>
          rate.pocket_type === pocket_type
            ? { ...rate, rate: Number.parseFloat(newRate) }
            : rate
        )
      );
      setEditingRate(null);
      setNewRate("");
    } catch (error) {
     console.log(error)
    }
  };

  return (
    <div className={cardStyles}>
      <SectionHeader
        icon={<FiSettings className={iconStyles} />}
        title="Interest Rates"
      />

      <div className={ratesGridStyles}>
        {interestRates.map((rate) => (
          <div key={rate.pocket_type} className={rateCardStyles}>
            <div className={rateHeaderStyles}>
              <p className={rateInfoStyles}>{rate.pocket_type} Pocket </p>
              <ActionButton
                onClick={() => startEditing(rate.pocket_type, rate.rate)}
                variant="icon"
              >
                <FiEdit2 />
              </ActionButton>
            </div>

            {editingRate === rate.pocket_type && (
              <div className={editFormStyles}>
                <div className={inputRowStyles}>
                  <input
                    type="number"
                    step="0.01"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className={rateInputStyles}
                    placeholder="Enter rate"
                  />
                  <span className={percentLabelStyles}>%</span>
                </div>
                <div className={buttonRowStyles}>
                  <ActionButton
                    onClick={() => handleUpdateRate(rate.pocket_type)}
                    variant="success"
                    size="sm"
                  >
                    Update
                  </ActionButton>
                  <ActionButton
                    onClick={cancelEditing}
                    variant="secondary"
                    size="sm"
                  >
                    Cancel
                  </ActionButton>
                </div>
              </div>
            )}
            <div className={rateDisplayStyles}>
                {loading ? "Loading..." : `${rate.rate}%`}
            </div> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default RateCard;
