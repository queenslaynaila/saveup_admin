import { css } from "@linaria/atomic"
import { Layout } from "../components/Layout/DashboardLayout"
import { Header } from "../components/Layout/Header"

const container = css`
  padding: 24px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }
`

export default function Pockets() {
  return (
    <Layout>
      <div className={container}>
        <Header heading="Pockets" description="Manage and view pockets." />      
      </div>
    </Layout>
  )
}
