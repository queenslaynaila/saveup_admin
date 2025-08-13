import { css, cx } from "@linaria/core"
import { BORDER_COLOR, TEXT_PRIMARY, THEME_COLOR } from "../../styles/colors"
import { useLocation } from "wouter"
import { useState } from "react"
import useToasts from "../../hooks/useToast"
import type { LoginData } from "../../types/user.types"
import { signIn } from "../../api/api/auth"
import { errorTextStyles, fontSizeStyles } from "../../styles/commonStyles"
import Toast from "../Cards/Toast"

const formStyles = css`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const inputGroupStyles = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const labelStyles = css`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${TEXT_PRIMARY};
`

const inputStyles = css`
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

const buttonStyles = css`
  background-color: ${THEME_COLOR};
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #00b89a;
  }
  
  &:active {
    transform: translateY(1px);
  }
`

export function LoginForm() {
  const [, setLocation] = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toasts, addToast, removeToast } = useToasts()

  const [values, setValues] = useState<LoginData>({
    phone_number: "",
    pin: "",
  })

  const [formErrors, setFormErrors] = useState({
    phone_number: "",
    pin: "",
  })

  const handleInputChange = (
    field: string,
    value: string,
    error: string | null
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: error }))
  }

  const isValid = !formErrors.phone_number && !formErrors.pin;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    signIn(values)
      .then((result) => {
        if (result === "success") {
          setLocation("/admin/users")
        }
      })
      .catch((error) => {
        const remAttempts = error.response.data.remaining_attempts

        if (remAttempts <= 3 && remAttempts >= 1) {
          addToast(
            `Invalid Credentials. You have ${remAttempts} remaining attempt(s)`,
            "error"
          )
        } else {
          addToast("Attempts exhausted. Kindly reset your pin", "error")
        }
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
   <>
    <form className={formStyles}  onSubmit={handleSubmit}>
      <div className={inputGroupStyles}>
        <label className={labelStyles}>Phone Number</label>
        <input
            type="tel"
            className={inputStyles}
            placeholder="0712345678"
            pattern="[0-9]{10}"
            title="Please enter exactly 10 digits"
            value={values.phone_number}
            maxLength={10}
            required
            onChange={(e) => {
              const value = e.target.value
              const error = value.length !== 10 ? "Must be 10 digits" : null
              handleInputChange("phone_number", value, error)
            }}
          />
          {formErrors.phone_number && (
            <p className={cx(fontSizeStyles, errorTextStyles)}>
              {formErrors.phone_number}
            </p>
          )}
      </div>

      <div className={inputGroupStyles}>
        <label className={labelStyles}>Password</label>
        <input
          type="password"
          className={inputStyles}
          placeholder="Enter your pin"
          maxLength={4}
          value={values.pin}
          required
          onChange={(e) => {
            const value = e.target.value
            const error = value.length !== 4 ? "Must be 4 digits" : null
            handleInputChange("pin", value, error)
          }}
        />
        {formErrors.phone_number && (
          <p className={cx(fontSizeStyles, errorTextStyles)}>{formErrors.pin}</p>
        )}
      </div>

      <button
          type="submit"
          className={buttonStyles}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
      </button>

    </form>
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
