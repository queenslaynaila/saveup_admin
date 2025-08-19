import { css } from "@linaria/atomic";
import { useEffect, useState } from "react";
import type { UserWithPublicAttributes } from "../types/user.types";
import { BORDER_COLOR, THEME_COLOR } from "../styles/colors";
import { UserDetailCard } from "../components/Cards/UserDetailCard";
import { Header } from "../components/Layout/Header";
import { searchUser, unlockUserAccount } from "../api/users";
import Loader from "../components/Loader";
import type { Transaction, TransactionType } from "../types/transaction.types";
import Toast from "../components/Cards/Toast";
import useToasts from "../hooks/useToast";
import { normalizePhoneNumber } from "../utils/normalisePhone";
import { getTransactions } from "../api/transaction";
import { UNLOCK_NOTE } from "../constants/strings";
import DashboardLayout from "../components/Layout/DashboardLayout";
import Table, {
  type TableColumnConfig,
  type TableFilterConfig,
  type TablePaginationConfig,
} from "../components/Tables/Table";
import { formatDate } from "../utils/formartDate";
import { EmptyStateMessage } from "./Moderators";
import { SectionHeader } from "../components/Cards/SectionHeader";
import { GrTransaction } from "react-icons/gr";
import { CiSearch } from "react-icons/ci";

const containerStyles = css`
  padding: 24px; width: 100%; 
  @media (max-width: 768px) { 
    padding: 16px; 
  }
`;

const searchContainerStyles = css`
  display: flex; 
  gap: 1rem; 
  margin-bottom: 2rem; 
  @media (max-width: 768px) {
    flex-direction: column; 
  }
`;

const searchWrapperStyles = css`
  position: relative; 
  flex: 1;
`;

const searchInputStyles = css`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid ${BORDER_COLOR};
  border-radius: 0.5rem;
  font-size: 0.95rem;
  background-color: white;
  &:focus { 
    outline: none; 
    border-color: ${THEME_COLOR}; 
    box-shadow: 0 0 0 3px ${THEME_COLOR}15; 
  }
`;

const searchIconStyles = css`
  position: absolute; 
  left: 1rem; 
  top: 50%; 
  transform: translateY(-50%); 
  color: #64748b; 
  width: 18px; 
  height: 18px;
`;

const miniListStyles = css`
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid ${BORDER_COLOR};
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  z-index: 10;
  max-height: 260px;
  overflow-y: auto;
`;

const miniListItemStyles = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid ${BORDER_COLOR};
  font-size: 0.97rem;
  background: #fff;
  transition: background 0.15s;
  &:hover {
    background: #f5f7fa;
  }
  &:last-child {
    border-bottom: none;
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

type UserSearchBarProps = {
  value: string;
  onChange: (v: string) => void;
  isLoading: boolean;
  suggestions: UserWithPublicAttributes[];
  onSuggestionSelect: (user: UserWithPublicAttributes) => void;
  showSuggestions: boolean;
  placeholder: string
};

export const UserSearchBar: React.FC<UserSearchBarProps> = ({
  value,
  onChange,
  suggestions,
  onSuggestionSelect,
  showSuggestions,
  placeholder,
}) => (
  <div className={searchContainerStyles}>
    <div className={searchWrapperStyles}>
      <CiSearch className={searchIconStyles} />
      <input
        type="text"
        className={searchInputStyles}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className={miniListStyles}>
          {suggestions.slice(0, 10).map(user => (
            <div
              key={user.id}
              className={miniListItemStyles}
              onClick={() => onSuggestionSelect(user)}
            >
              <span>{user.phone_number}</span>
              <span style={{ color: '#64748b' }}>{user.full_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

interface UseUserTransactionsResult {
  transactions: Transaction[];
  isFetching: boolean;
}

const useUserTransactions = (userId?: number): UseUserTransactionsResult => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) return setTransactions([]);
    setIsFetching(true);
    getTransactions(userId)
      .then(setTransactions)
      .finally(() => setIsFetching(false));
  }, [userId]);

  return { transactions, isFetching };
}

const transactionTypes: Array<TransactionType | "All"> = [
  "All",
  "Saving",
  "Donations",
  "Interest",
  "Withdrawal",
  "Penalty",
  "TransferIn",
  "TransferOut",
  "Loan",
  "Repayment",
]

const Users: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<TransactionType | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearchedQuery, setLastSearchedQuery] = useState("");
  const [matchedUsers, setMatchedUsers] = useState<UserWithPublicAttributes[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithPublicAttributes | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { transactions, isFetching: isFetchingTransactions } = useUserTransactions(selectedUser?.id);
  const { toasts, addToast, removeToast } = useToasts();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages= Math.ceil(transactions.length / pageSize);

  const columns: TableColumnConfig<Transaction>[] = [
    {
      key:    "pocket",
      header: "Pocket",
      render: (transaction) => transaction.pocket_name,
    },
    {
      key:    "reference",
      header: "Reference",
      render: (transaction) => transaction.reference_id.toUpperCase(),
    },
    {
      key:    "type",
      header: "Type",
      render: (transaction) => transaction.slug,
    },
    {
      key:    "delta",
      header: "Delta",
      render: (transaction) => (
        <span className={transaction.delta > 0 ? "text-green-600" : "text-red-600"}>
          {transaction.delta > 0 ? "+" : ""}
          {transaction.delta.toFixed(2)}
        </span>
      ),
    },
    {
      key:    "balance",
      header: "Balance",
      render: (transaction) => <span style={{ color: "green" }}>{transaction.balance.toFixed(2)}</span>,
    },
    {
      key:    "date",
      header: "Date",
      align:  "right",
      render: (transaction) => <span style={{ color: "gray" }}>{formatDate(transaction.created_at)}</span>,
    },
  ];

  const filters: TableFilterConfig[] = [
    {
      key:    "type",
      label:  "Transaction Type",
      value:  typeFilter,
      onChange: (value) => setTypeFilter(value as TransactionType | "All"),
      options: transactionTypes.map((type) => ({ value: type, label: type })),
    },
  ];

  const handleClearFilters = (): void => {
    setTypeFilter("All");
  };

  const pagination: TablePaginationConfig = {
    currentPage,
    totalPages,
    onPageChange: setCurrentPage,
  };
  

  const isLoading = isSearching || isFetchingTransactions;
  const showSearchResults = lastSearchedQuery && !isLoading;

  useEffect(() => {
    if (searchQuery === "") {
      setMatchedUsers([]);
      setLastSearchedQuery("");
      setSelectedUser(null);
      return;
    }

    setIsSearching(true);
    setLastSearchedQuery(searchQuery);
    setSelectedUser(null);

    const normalizedQuery = normalizePhoneNumber(searchQuery);

    searchUser(normalizedQuery)
      .then((users) => {
        setMatchedUsers(users);
        if (users.length === 1) setSelectedUser(users[0]);
      })
      .finally(() => setIsSearching(false));
  }, [searchQuery]);

  const handleUserUnlock = (user: UserWithPublicAttributes) => {
    unlockUserAccount(user.id, UNLOCK_NOTE)
      .then(() => addToast(
        `Account for ${user.full_name} has been unlocked successfully.`, "success"
      ))
      .catch((error) => {
        if (error?.response?.status === 404 && 
            error?.response?.data?.message === "ERR_ACCOUNT_IS_NOT_LOCKED"
          ) {
          addToast("The requested account is not locked.", "information");
        } else {
          addToast("Failed to unlock account. Please try again.", "error");
        }
      });
  };

  return (
    <DashboardLayout>
      <div className={containerStyles}>
        <Header heading="Users" description="Manage and view user details and activity." />
        <UserSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          isLoading={isLoading}
          placeholder="Search by phone or id number"
          suggestions={matchedUsers}
          onSuggestionSelect={user => {
            setSelectedUser(user);
          }}
          showSuggestions={!selectedUser}
        />

        {showSearchResults && (
          <>
            {selectedUser && (
              <UserDetailCard user={selectedUser} onUnlock={handleUserUnlock} />
            )}

           {selectedUser && transactions.length > 0  && (
              <div className={cardStyles}>
                <SectionHeader 
                  icon={<GrTransaction className={iconStyles}/>} 
                  title="Transactions">
                </SectionHeader>
                <Table
                  data={transactions}
                  columns={columns}
                  filters={filters}
                  pagination={pagination}
                  onClearFilters={handleClearFilters}             
                />
              </div>
           )}

            {matchedUsers.length === 0 && (
              <EmptyStateMessage
                title="No users found"
                message="No users match your search criteria. Try a different search term."
              />
            )}

            {selectedUser && transactions.length === 0 && (
              <EmptyStateMessage
                title="No transactions found"
                message="Adjust your search criteria to find transactions."
              />
            )}
          </>
        )}

        {isLoading && <Loader />}
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

export default Users;
