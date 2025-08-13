import { css, cx } from "@linaria/core"
import { BORDER_COLOR, TEXT_PRIMARY, THEME_COLOR } from "../../styles/colors"
import { useLocation } from "wouter"
import { useState } from "react"
import useToasts from "../../hooks/useToast"
import type { LoginData } from "../../types/user.types"
import { errorTextStyles, fontSizeStyles } from "../../styles/commonStyles"
import Toast from "../Cards/Toast"
import { signIn } from "../../api/auth"

const PHONE_NUMBER_LENGTH = 10
const PIN_LENGTH = 4
const LOW_ATTEMPTS_THRESHOLD = 3


const formContainerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const fieldGroupStyles = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const fieldLabelStyles = css`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${TEXT_PRIMARY};
`

const fieldInputStyles = css`
  padding: 0.75rem 1rem;
  border: 1px solid ${BORDER_COLOR};
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${THEME_COLOR};
    box-shadow: 0 0 0 3px ${THEME_COLOR}15;
  }
`

const submitButtonStyles = css`
  background-color: ${THEME_COLOR};
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: #00b89a;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

interface FormField {
  value: string
  error: string
}

interface LoginFormState {
  phoneNumber: FormField
  pin: FormField
}

// Validation functions
const validatePhoneNumber = (value: string): string => {
  if (value.length === 0) return ""
  if (!/^\d+$/.test(value)) return "Phone number must contain only digits"
  if (value.length !== PHONE_NUMBER_LENGTH) return `Must be exactly ${PHONE_NUMBER_LENGTH} digits`
  return ""
}

const validatePin = (value: string): string => {
  if (value.length === 0) return ""
  if (!/^\d+$/.test(value)) return "PIN must contain only digits"
  if (value.length !== PIN_LENGTH) return `Must be exactly ${PIN_LENGTH} digits`
  return ""
}

const createAuthErrorMessage = (remainingAttempts: number): string => {
  if (remainingAttempts <= LOW_ATTEMPTS_THRESHOLD && remainingAttempts >= 1) {
    return `Invalid credentials. You have ${remainingAttempts} remaining attempt(s)`
  }
  return "Attempts exhausted. Please reset your PIN"
}

export function LoginForm() {
  const [, navigateToLocation] = useLocation()
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const { toasts, addToast, removeToast } = useToasts()

  const [formState, setFormState] = useState<LoginFormState>({
    phoneNumber: { value: "", error: "" },
    pin: { value: "", error: "" },
  })

  const updateField = (fieldName: keyof LoginFormState, value: string) => {
    const validator = fieldName === 'phoneNumber' ? validatePhoneNumber : validatePin
    const error = validator(value)
    
    setFormState(prevState => ({
      ...prevState,
      [fieldName]: { value, error }
    }))
  }

  const isFormValid = (): boolean => {
    const { phoneNumber, pin } = formState
    return phoneNumber.value.length === PHONE_NUMBER_LENGTH && 
           pin.value.length === PIN_LENGTH &&
           !phoneNumber.error && 
           !pin.error
  }

  const handleAuthError = (error) => {
    const remainingAttempts = error.response?.data?.remaining_attempts ?? 0
    const errorMessage = createAuthErrorMessage(remainingAttempts)
    addToast(errorMessage, "error")
  }

  const handleFormSubmission = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (isSubmittingForm || !isFormValid()) return

    setIsSubmittingForm(true)

    const loginCredentials: LoginData = {
      phone_number: formState.phoneNumber.value,
      pin: formState.pin.value,
    }

    try {
      const authResult = await signIn(loginCredentials)
      if (authResult === "success") {
        navigateToLocation("/admin/users")
      }
    } catch (error) {
      handleAuthError(error)
    } finally {
      setIsSubmittingForm(false)
    }
  }

  const renderFieldGroup = (
    fieldName: keyof LoginFormState,
    label: string,
    type: string,
    placeholder: string,
    maxLength: number
  ) => {
    const field = formState[fieldName]
    
    return (
      <div className={fieldGroupStyles}>
        <label className={fieldLabelStyles}>{label}</label>
        <input
          type={type}
          className={fieldInputStyles}
          placeholder={placeholder}
          maxLength={maxLength}
          value={field.value}
          required
          onChange={(e) => updateField(fieldName, e.target.value)}
        />
        {field.error && (
          <p className={cx(fontSizeStyles, errorTextStyles)}>
            {field.error}
          </p>
        )}
      </div>
    )
  }

  const renderToastNotifications = () => (
    <>
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          index={index}
          message={toast}
          onRemove={removeToast}
          isSuccess={toast.type === "success"}
        />
      ))}
    </>
  )

  return (
    <>
      <form className={formContainerStyles} onSubmit={handleFormSubmission}>
        {renderFieldGroup("phoneNumber", "Phone Number", "tel", "0712345678", PHONE_NUMBER_LENGTH)}
        {renderFieldGroup("pin", "PIN", "password", "Enter your PIN", PIN_LENGTH)}

        <button
          type="submit"
          className={submitButtonStyles}
          disabled={!isFormValid() || isSubmittingForm}
        >
          {isSubmittingForm ? "Signing In..." : "Sign In"}
        </button>
      </form>
      
      {renderToastNotifications()}
    </>
  )
}