import { css } from "@linaria/atomic"
import { Phone, MapPin, User, CreditCard, LogIn, Check, ChevronDown, X } from "lucide-react"
import { BORDER_COLOR, TEXT_PRIMARY } from "../../styles/colors"
import type { User as UserType } from "../../types/user.types"
import { useEffect, useRef, useState } from "react"
import useToasts from "../../hooks/useToast"
import formatCurrency from "../../utils/formartCurrency"
import Toast from "./Toast"
import { formatDate } from "../../utils/formartDate"
import { updateUserAccountStatus } from "../../api/users"
import type { UserWithPublicAttributes } from "../../views/Users"
import { useLocation } from "wouter"
import { getPocketsBalance } from "../../api/pockets"

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

const userNameHeadingStyles = css`
  font-size: 1.875rem;  
  font-weight: 700;
  color: ${TEXT_PRIMARY};
  margin-bottom: 1rem;  
  text-align: center;  

  @media (min-width: 768px) {
    text-align: left;
  }
`

const detailsSectionStyles = css`
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

const detailItemStyles = css`
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

const buttonContainerStyles = css`
  width: 100%;
  display: flex;
  flex-direction: column;  
  gap: 1rem;
   
  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
`

const deactivateButtonStyles = css`
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

const unlockButtonStyles = css`
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
const modalActions = css`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const modalCancelButton = css`
  padding: 8px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  background-color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: #F9FAFB;
  }
  
  @media (max-width: 768px) {
    order: 1;
  }
`

const modalUpdateButton = css`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color:black;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`


const modalOverlay = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  padding: 16px;
`

const modalContent = css`
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  position: relative;
`

const modalHeader = css`
  margin-bottom: 24px;
`

const modalTitle = css`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

const modalCloseButton = css`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6B7280;
  padding: 4px;
  &:hover {
    color: #374151;
  }
`

const formGroup = css`
  margin-bottom: 24px;
`
const customSelectContainer = css`
  position: relative;
  width: 100%;
`

const customSelectButton = css`
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const customSelectDropdown = css`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 20;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #E5E7EB;
`

const customSelectOption = css`
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #F9FAFB;
  }
`

const customSelectOptionSelected = css`
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: #F3F4F6;
`
const checkIcon = css`
  margin-right: 8px;
  color: #111827;
`

const accountStatusOptions: Array<"Active" | "Inactive" | "Suspended"> = ['Active', 'Inactive', 'Suspended']

interface UserDetailCardProps {
  user: UserType & { last_login: string }
  onUnlock: (user: UserWithPublicAttributes) => void
}

export function UserDetailCard({ user, onUnlock}: UserDetailCardProps) {
  const [totalBalance, setTotalBalance] = useState<number>(0)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<"Active"|"Inactive"|"Suspended">("Active")
  const [isDropdownOpen, setIsDropdownOpen ] = useState(false)

  const { toasts, addToast, removeToast } = useToasts()

  const [, setLocation] = useLocation();

  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleAccountStatusChange = (
    user: UserWithPublicAttributes, 
    status: "Active" | "Inactive" | "Suspended", 
    reason?: string
  ) => {
    updateUserAccountStatus(user.id, status, reason)
      .then((message) => {
        addToast(`Account status updated to: ${message.status}`, 'success')  
      })
      .catch((error) => {
        if (error?.response?.status === 404 && error?.response?.data?.message === 'ERR_USER_NOT_FOUND') {
          addToast("User not found. Please try again.", 'error')
        } else {      
          addToast("Failed to update account status. Please try again.", 'error')
        }
      })
  }

  useEffect(() => {
    getPocketsBalance(user.id)
      .then(response => {
        setTotalBalance(response)
      })
      .catch(() => {
        addToast("Problem getting overall Balance. Try again.", "error")
      })
  }, [user.id, addToast])

  const userDetails = [
    { icon: Phone, label: user.phone_number },
    { icon: CreditCard, label: `Overall Balance: KES ${formatCurrency(totalBalance)}` },
    { icon: User, label: `ID Type: ${user.id_type}` },
    { icon: MapPin, label: `Country: ${user.country}` },
    { icon: User, label: `ID Number: ${user.id_number}` },
    { icon: User, label: `Member Since: ${formatDate(user.created_at, 'short')}` },
    { icon: LogIn, label: `Last Login: ${formatDate(user.last_login, 'full')}` },
  ]

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <>
      <div className={cardStyles}>
        <h2 className={userNameHeadingStyles}>{user.full_name}</h2>
        <div className={detailsSectionStyles}>
          {userDetails.map(({ icon: Icon, label }, index) => (
            <div key={index} className={detailItemStyles}>
              <Icon />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className={buttonContainerStyles}>
          <button
            className={unlockButtonStyles}
            style={{ backgroundColor: '#2563eb' }}
            onClick={() => setLocation(`/admin/pockets?userId=${user.id}`)}
          >
            Pockets
          </button>
           <button
            className={unlockButtonStyles}
            style={{backgroundColor: '#2563eb'}}
            onClick={() => setLocation(`/admin/groups?userId=${user.id}`)}
          >
            Groups
          </button>
          <button
            className={unlockButtonStyles}
            onClick={() => { onUnlock(user) }}
          >
            Unlock
          </button>
          <button
            className={deactivateButtonStyles}
            onClick={()=>setShowDeactivateModal(true)}
          >
            Deactivate
          </button>
        </div>
      </div>

      {showDeactivateModal && (
        <div className={modalOverlay}>
          <div className={modalContent}>
            <button className={modalCloseButton}>
              <X size={20} />
            </button>
            <div className={modalHeader}>
              <h3 className={modalTitle}>Update Account Status</h3>
            </div>
            <div className={formGroup}>
              <div className={customSelectContainer} ref={dropdownRef}>
                <button className={customSelectButton} onClick={toggleDropdown}  type="button">
                  {selectedStatus}
                  <ChevronDown size={16} />
                </button>
                {isDropdownOpen && (
                  <div className={customSelectDropdown}>
                    {accountStatusOptions.map((status) => (
                      <div
                        key={status}
                        className={status === selectedStatus ? customSelectOptionSelected : customSelectOption}
                        onClick={() => {setSelectedStatus(status)}}
                      >
                        {status === selectedStatus && (
                          <span className={checkIcon}>
                            <Check size={16} />
                          </span>
                        )}
                        {status}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={modalActions}>
              <button className={modalCancelButton} onClick={() => setShowDeactivateModal(false)}>
                Cancel
              </button>
              <button
                className={modalUpdateButton}
                onClick={() => handleAccountStatusChange(user, selectedStatus)}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

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