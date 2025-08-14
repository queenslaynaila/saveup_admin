import { css } from "@linaria/atomic"
import DashboardLayout from "../components/Layout/DashboardLayout"

const container = css`
  padding: 24px;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`

export default function NexOfKins() {
  return (
    <DashboardLayout>
      <div className={container}></div>
    </DashboardLayout>
  )
}
