import { css } from "@linaria/atomic";
import { useEffect, useState } from "react";
import { Header } from "../components/Layout/Header";
import Loader from "../components/Loader";
import Toast from "../components/Cards/Toast";
import useToasts from "../hooks/useToast";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { StatusBadge } from "../components/Cards/StatusBadge";
import { FiAlertTriangle, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { ActionButton } from "../components/Cards/ActionButton";
import { SectionHeader } from "../components/Cards/SectionHeader";
import RateCard from "../components/Cards/RateCard";
import Table from "../components/Tables/Table";

const containerStyles = css`
  padding: 24px;
  width: 100%;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const cardStyles = css`
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const iconStyles = css`
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  color: #374151;
`;

const failureTimestampsStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #dc2626;
`;

const failuresContainerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const failureHeaderStyles = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const failureInfoStyles = css`
  div:first-child {
    font-weight: 500;
    color: #7f1d1d;
  }

  div:last-child {
    font-size: 0.875rem;
    color: #991b1b;
  }
`;

const retryCountStyles = css`
  font-size: 0.875rem;
  color: #dc2626;
`;

const errorMessageStyles = css`
  font-size: 0.875rem;
  color: #9f1239;
  margin-bottom: 0.5rem;

  strong {
    font-weight: 600;
  }
`;

const failureCardStyles = css`
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #fef2f2;
`;

type InterestJobSummary = {
  id: number;
  interest_date: string;
  standard_interest_rate: number;
  locked_interest_rate: number;
  eligible_pockets: number;
  awarded_pockets: number;
  skipped_pockets: number;
  failed_pockets: number;
  created_at: string;
};

type InterestJobFailure = {
  id: number;
  job_name: string | null;
  entity_id: number | null;
  pocket_id: number | null;
  standard_interest_rate: number | null;
  locked_interest_rate: number | null;
  error: string;
  retry_count: number;
  max_retries: number;
  resolved: boolean;
  created_at: string;
  next_attempt_at: string | null;
};


const fetchJobSummaries = async (limit = 10): Promise<InterestJobSummary[]> => {
  const summaries: InterestJobSummary[] = [];
  for (let i = 0; i < limit; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    summaries.push({
      id: i + 1,
      interest_date: date.toISOString().split("T")[0],
      standard_interest_rate: 2.5,
      locked_interest_rate: 4.75,
      eligible_pockets: 1250 - i * 10,
      awarded_pockets: 1240 - i * 8,
      skipped_pockets: 5 + i,
      failed_pockets: i < 3 ? i : 0,
      created_at: date.toISOString(),
    });
  }
  return summaries;
};

const Commissions: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toasts, addToast, removeToast } = useToasts();
  const [jobSummaries, setJobSummaries] = useState<InterestJobSummary[]>([]);
  const [jobFailures, setJobFailures] = useState<InterestJobFailure[]>([]);
  const [showFailures, setShowFailures] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const summaries = await fetchJobSummaries();
        setJobSummaries(summaries);
        setJobFailures([]); // No failures fetched in this mock
      } catch (error) {
        console.error(error);
        addToast("Error fetching daily runs", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [addToast]);

  


  interface JobSummaryColumn {
    key: keyof InterestJobSummary | "status";
    header: string;
    render: (summary: InterestJobSummary) => React.ReactNode;
  }

  const jobSummaryColumns: JobSummaryColumn[] = [
    {
      key: "interest_date",
      header: "Date",
      render: (summary: InterestJobSummary) => summary.interest_date,
    },
    {
      key: "standard_interest_rate",
      header: "Standard Rate",
      render: (summary: InterestJobSummary) => summary.standard_interest_rate,
    },
    {
      key: "locked_interest_rate",
      header: "Locked Rate",
      render: (summary: InterestJobSummary) => summary.locked_interest_rate,
    },
    {
      key: "eligible_pockets",
      header: "Eligible",
      render: (summary: InterestJobSummary) => summary.eligible_pockets,
    },
    {
      key: "awarded_pockets",
      header: "Awarded",
      render: (summary: InterestJobSummary) => summary.awarded_pockets,
    },
    {
      key: "skipped_pockets",
      header: "Skipped",
      render: (summary: InterestJobSummary) => summary.skipped_pockets,
    },
    {
      key: "failed_pockets",
      header: "Failed",
      render: (summary: InterestJobSummary) => summary.failed_pockets,
    },
    {
      key: "status",
      header: "Status",
      render: (summary: InterestJobSummary) =>
        summary.failed_pockets === 0 ? (
          <StatusBadge icon={<FiCheckCircle />} text="Healthy" variant="success" />
        ) : (
          <StatusBadge icon={<FiXCircle />} text="Issues" variant="error" />
        ),
    },
  ];

  return (
    <DashboardLayout>
      <div className={containerStyles}>
        <Header 
          heading="Commissions" 
          description="Manage and track inetrest awarded to user pockets." 
        />

        {isLoading && <Loader />}
        <RateCard />

        <div className={cardStyles}>
          <SectionHeader icon={<FiClock className={iconStyles} />} title="Daily Interest Job Monitoring">
            {jobSummaries.some((summary) => summary.failed_pockets > 0) && (
              <ActionButton
                onClick={() => setShowFailures(!showFailures)}
                variant="danger"
                size="sm"
              >
                <FiAlertTriangle />
                {jobSummaries.reduce((acc, summary) => acc + (summary.failed_pockets > 0 ? 1 : 0), 0)} Failures
              </ActionButton>
            )}
          </SectionHeader>

          <Table columns={jobSummaryColumns} data={jobSummaries} isBorderless={true} />
        </div>

        {showFailures && jobFailures.length > 0 && (
          <div className={cardStyles}>
            <SectionHeader
              icon={<FiAlertTriangle className={iconStyles} style={{ color: "red" }} />}
              title="Unresolved Job Failures"
            />

            <div className={failuresContainerStyles}>
              {jobFailures.map((failure) => (
                <div key={failure.id} className={failureCardStyles}>
                  <div className={failureHeaderStyles}>
                    <div className={failureInfoStyles}>
                      <div>Job: {failure.job_name || "Unknown"}</div>
                      {failure.pocket_id && (
                        <div>
                          Pocket ID: {failure.pocket_id} | Entity ID: {failure.entity_id}
                        </div>
                      )}
                    </div>
                    <div className={retryCountStyles}>
                      Retry {failure.retry_count}/{failure.max_retries}
                    </div>
                  </div>

                  <div className={errorMessageStyles}>
                    <strong>Error:</strong> {failure.error}
                  </div>

                  <div className={failureTimestampsStyles}>
                    <span>Failed: {new Date(failure.created_at).toLocaleString()}</span>
                    {failure.next_attempt_at && (
                      <span>Next attempt: {new Date(failure.next_attempt_at).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {toasts.map((toast, i) => (
        <Toast
          key={toast.id}
          index={i}
          message={toast}
          onRemove={removeToast}
          isSuccess={toast.type === "success"}
        />
      ))}
    </DashboardLayout>
  );
};

export default Commissions;