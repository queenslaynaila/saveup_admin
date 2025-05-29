import { css } from "@linaria/core"
import { THEME_COLOR, BG_CARD_COLOR, TEXT_PRIMARY, BORDER_COLOR } from "../styles/colors"
import { LoginForm } from "../components/Forms/LoginForm"

const loginStyles = css`
  min-height: 100vh;
  background: linear-gradient(135deg, ${THEME_COLOR}15 0%, ${THEME_COLOR}05 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const containerStyles = css`
  background-color: ${BG_CARD_COLOR};
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  width: 100%;
  max-width: 400px;
  border: 1px solid ${BORDER_COLOR};
`

const headerStyles = css`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: ${TEXT_PRIMARY};
    margin-bottom: 0.5rem;
    
    .logo {
      color: ${THEME_COLOR};
    }
  }
  
  p {
    color: #64748b;
    font-size: 0.95rem;
  }
`

export function Login() {
  return (
    <div className={loginStyles}>
      <div className={containerStyles}>
        <div className={headerStyles}>
          <h1>
            <span className="logo">SaveUp</span> Admin
          </h1>
          <p>Sign in to access your dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
