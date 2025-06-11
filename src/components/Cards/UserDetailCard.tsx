import { css } from "@linaria/atomic"
import { Phone, MapPin, User, CreditCard } from "lucide-react"
import { BORDER_COLOR, TEXT_PRIMARY } from "../../styles/colors"
import type { User as UserType } from "../../types/user.types"
import { useEffect, useState } from "react"
import { getPocketsBalance } from "../../data/api/pockets"
import useToasts from "../../hooks/useToast"
import formatCurrency from "../../utils/formartCurrency"
import Toast from "./Toast"

const cardStyles = css`
  background-color: white;
  border: 1px solid ${BORDER_COLOR};
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const userNameHeading = css`
  font-size: 1.875rem;  
  font-weight: 700;
  color: ${TEXT_PRIMARY};
  margin-bottom: 1rem;  
  text-align: center;  

  @media (min-width: 768px) {
    text-align: left;
  }
`

const detailsSection = css`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding-bottom: 1.5rem; 
  border-bottom: 1px solid ${BORDER_COLOR};

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const detailItem = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: ${TEXT_PRIMARY};

  svg {
    color: #64748b;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  span {
    font-weight: 500;
  }
`

const buttonContainer = css`
  width: 100%;
  display: flex;
  flex-direction: row;  
  gap: 1rem;
   
  @media (min-width: 768px) {
    justify-content: flex-end;
  }
`

const deactivateButton = css`
  background-color: #ef4444;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%; 

  &:hover {
    background-color: #dc2626;
  }

  &:active {
    transform: translateY(1px);
  }

  @media (min-width: 768px) {
    width: auto;
  }
`

const unlockButton = css`
  background-color: #22c55e;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background-color: #16a34a;
  }

  &:active {
    transform: translateY(1px);
  }

  @media (min-width: 768px) {
    width: auto;
  }
`

interface UserDetailCardProps {
  user: UserType
}

export function UserDetailCard({ user }: UserDetailCardProps) {
  const [totalBalance, setTotalBalance] = useState<number>(0)
  const { toasts, addToast, removeToast } = useToasts()

  const handleDeactivate = () => {
    addToast(`User ${user.full_name} has been deactivated (simulated).`, 'information')
  }

  const handleUnlockAccount = () => {
    addToast(`Account for ${user.full_name} has been unlocked (simulated).`, 'information')
  }
  
  useEffect(()=>{
    getPocketsBalance(user.id)
    .then(response=> {
      setTotalBalance(response)
    }).catch(()=>{
      addToast("Problem getting overall Balance.Try again.", "error")
    })
  }, [user.id, addToast])

  return (
    <>
      <div className={cardStyles}>
        <h2 className={userNameHeading}>{user.full_name}</h2>

        <div className={detailsSection}>
          <div className={detailItem}>
            <Phone />
            <span>{user.phone_number}</span>
          </div>
          <div className={detailItem}>
            <CreditCard />
            <span>Overall Balance: KES {formatCurrency(totalBalance)}</span>
          </div>
          <div className={detailItem}>
            <MapPin />
            <span>Country: {user.country}</span>
          </div>
          <div className={detailItem}>
            <User />
            <span>ID Type: {user.id_type}</span>
          </div>
          <div className={detailItem}>
            <User />
            <span>ID Number: {user.id_number}</span>
          </div>
        </div>

        <div className={buttonContainer}>
          <button className={unlockButton} onClick={handleUnlockAccount}>
            Unlock
          </button>
          <button className={deactivateButton} onClick={handleDeactivate}>
            Deactivate
          </button>
        </div>
      </div>
       {toasts.map((toast, i) => (
        <Toast
          key={toast.id}
          index={i}
          message={toast}
          onRemove={removeToast}
          isSuccess={toast.type === "success"}
        />
      ))}
    </>
  )
}

