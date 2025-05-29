import { css } from "@linaria/core"
import { THEME_COLOR, TEXT_PRIMARY, BORDER_COLOR } from "../../styles/colors"

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

const forgotLinkStyles = css`
  text-align: center;
  margin-top: 1rem;
  
  a {
    color: ${THEME_COLOR};
    text-decoration: none;
    font-size: 0.9rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

export function LoginForm() {
  return (
    <form className={formStyles}>
      <div className={inputGroupStyles}>
        <label className={labelStyles}>Email Address</label>
        <input type="email" className={inputStyles} placeholder="admin@saveup.com" required />
      </div>

      <div className={inputGroupStyles}>
        <label className={labelStyles}>Password</label>
        <input type="password" className={inputStyles} placeholder="Enter your password" required />
      </div>

      <button type="submit" className={buttonStyles}>
        Sign In
      </button>

      <div className={forgotLinkStyles}>
        <a href="#">Forgot your password?</a>
      </div>
    </form>
  )
}
