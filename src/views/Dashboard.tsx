import { css } from "@linaria/core"
import { BG_SECONDARY, TEXT_PRIMARY } from "../styles/colors"
import { DashboardLayout } from "../components/Layout/DashboardLayout"
import { StatsCard } from "../components/Cards/StatsCard"
import { SavingsChart } from "../components/Charts/SavingsChart"
import { UserGrowthCard } from "../components/Charts/UserGrowthChart"

const dashboardStyles = css`
  min-height: 100vh;
  background-color: ${BG_SECONDARY};
  color: ${TEXT_PRIMARY};
`

const contentStyles = css`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

const headerStyles = css`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: ${TEXT_PRIMARY};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #64748b;
    font-size: 1rem;
  }
`

const gridStyles = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const chartsGridStyles = css`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export function Dashboard() {
  const statsData = [
    {
      title: "Total Savings",
      value: "$2,847,392",
      change: "+12.5%",
      trend: "up" as const,
      icon: "💰",
    },
    {
      title: "Active Users",
      value: "8,429",
      change: "+8.2%",
      trend: "up" as const,
      icon: "👥",
    },
    {
      title: "Savings Goals",
      value: "1,247",
      change: "+15.3%",
      trend: "up" as const,
      icon: "🎯",
    },
    {
      title: "Avg. Monthly Save",
      value: "$342",
      change: "-2.1%",
      trend: "down" as const,
      icon: "📈",
    },
  ]

  return (
    <DashboardLayout>
      <div className={dashboardStyles}>
        <div className={contentStyles}>
    

          {/* <div className={gridStyles}>
            {statsData.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          <div className={chartsGridStyles}>
            <SavingsChart />
            <UserGrowthCard />
          </div> */}

        </div>
      </div>
    </DashboardLayout>
  )
}
