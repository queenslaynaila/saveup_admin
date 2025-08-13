import { css } from "@linaria/core"
import { useLocation } from "wouter"
import { useState } from "react"
import useToasts from "../../hooks/useToast"
import type { LoginData } from "../../types/user.types"
import Toast from "../Cards/Toast"
import { signIn } from "../../api/auth"
import FormField from "./FormField"
import { THEME_COLOR } from "../../styles/colors"

const PHONE_NUMBER_LENGTH = 10
const PIN_LENGTH = 4

const formContainerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  console.log(`rem ${remainingAttempts}`)
  if (remainingAttempts > 0) {
    return `Invalid credentials. You have ${remainingAttempts} remaining attempt(s) left`
  }
  return "Attempts exhausted.Account is locked. Please reset your PIN"
}


export function LoginForm() {
  const [, navigateToLocation] = useLocation();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const { toasts, addToast, removeToast } = useToasts();

  const [formState, setFormState] = useState<LoginFormState>({
    phoneNumber: { value: "", error: "" },
    pin: { value: "", error: "" },
  });

  const updateField = (fieldName: keyof LoginFormState, value: string) => {
    let error = "";
    if (fieldName === "phoneNumber") error = validatePhoneNumber(value);
    else if (fieldName === "pin") error = validatePin(value);
    setFormState(prev => ({
      ...prev,
      [fieldName]: { value, error }
    }));
  };

  const isFormValid = (): boolean => {
    return (
      formState.phoneNumber.value.length === PHONE_NUMBER_LENGTH &&
      !formState.phoneNumber.error &&
      formState.pin.value.length === PIN_LENGTH &&
      !formState.pin.error
    );
  };

  const handleFormSubmission = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmittingForm || !isFormValid()) return;
    setIsSubmittingForm(true);

    const loginCredentials: LoginData = {
      phone_number: formState.phoneNumber.value,
      pin: formState.pin.value,
    };

    signIn(loginCredentials)
      .then((authResult) => {
        if (authResult === "success") {
          navigateToLocation("/admin/users");
        }
      })
      .catch((error) => {
        console.log(error);
        const remainingAttempts = error.response.data.remaining_attempts;
        const errorMessage = createAuthErrorMessage(remainingAttempts);
        addToast(errorMessage, "error");
      })
      .finally(() => {
        setIsSubmittingForm(false);
      });
  };

  return (
    <>
      <form className={formContainerStyles} onSubmit={handleFormSubmission}>
        <FormField
          name="phoneNumber"
          label="Phone Number"
          type="tel"
          placeholder="0712345678"
          maxLength={PHONE_NUMBER_LENGTH}
          value={formState.phoneNumber.value}
          error={formState.phoneNumber.error}
          onChange={e => updateField("phoneNumber", e.target.value)}
        />
        <FormField
          name="pin"
          label="PIN"
          type="password"
          placeholder="Enter your PIN"
          maxLength={PIN_LENGTH}
          value={formState.pin.value}
          error={formState.pin.error}
          onChange={e => updateField("pin", e.target.value)}
        />
        <button
          type="submit"
          className={submitButtonStyles}
          disabled={!isFormValid() || isSubmittingForm}
        >
          {isSubmittingForm ? "Signing In..." : "Sign In"}
        </button>
      </form>
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
  );
}