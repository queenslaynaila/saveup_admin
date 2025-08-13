import React from "react";
import { css, cx } from "@linaria/core";
import { errorTextStyles, fontSizeStyles } from "../../styles/commonStyles";
import { BORDER_COLOR, TEXT_PRIMARY, THEME_COLOR } from "../../styles/colors";

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

interface FormFieldProps {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  maxLength: number;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type,
  placeholder,
  maxLength,
  value,
  error,
  onChange,
}) => (
  <div className={fieldGroupStyles}>
    <label className={fieldLabelStyles} htmlFor={name}>{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      className={fieldInputStyles}
      placeholder={placeholder}
      maxLength={maxLength}
      value={value}
      required
      onChange={onChange}
    />
    {error && (
      <p className={cx(fontSizeStyles, errorTextStyles)}>
        {error}
      </p>
    )}
  </div>
);

export default FormField;