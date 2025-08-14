import { css } from "@linaria/atomic"
import { Layout } from "../components/Layout/DashboardLayout"

const container = css`
  padding: 24px;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`

export default function NexOfKins() {
  return (
    <Layout>
      <div className={container}></div>
    </Layout>
  )
}
