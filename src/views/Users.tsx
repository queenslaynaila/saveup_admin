import { css, cx } from "@linaria/atomic";
import { Layout } from "../components/Layout/DashboardLayout";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "../types/user.types";
import { BORDER_COLOR, TEXT_PRIMARY, THEME_COLOR } from "../styles/colors";
import UserTable from "../components/Tables/UserTable";
import { UserDetailCard } from "../components/Cards/UserDetailCard";
import { Header } from "../components/Layout/Header";
import { searchUser, unlockUserAccount } from "../api/users";
import { UserTransactionsTable } from "../components/Tables/UserTransactionsTable";
import Loader from "../components/Loader";
import type { Transaction } from "../types/transaction.types";
import Toast from "../components/Cards/Toast";
import useToasts from "../hooks/useToast";
import { normalizePhoneNumber } from "../utils/normalisePhone";
import { getTransactions } from "../api/transaction";


const containerStyles = css`
  padding: 24px; width: 100%; 
  @media (max-width: 768px) { 
    padding: 16px; 
  }
`;

const backButtonStyles = css`
  margin-bottom: 1rem;
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

const searchButtonStyles = css`
  background-color: ${THEME_COLOR};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none; 
  border-radius: 0.5rem;
  font-size: 0.95rem; 
  font-weight: 500;
  cursor: pointer; 
  transition: all 0.2s ease;
  &:hover { 
    background-color: ${THEME_COLOR}; 
  }
  @media (max-width: 768px) { 
    width: 100%; 
    justify-content: center; 
  }
`;

const emptyStateStyles = css`
  margin-top: 2rem; 
  text-align: center; 
  padding: 1rem;
  background-color: white; 
  border: 1px solid ${BORDER_COLOR}; 
  border-radius: 0.5rem;
  h3 { 
    font-size: 1.25rem; 
    font-weight: 600; 
    color: ${TEXT_PRIMARY}; 
    margin-bottom: 0.5rem; 
  }
  p { 
    color: #64748b; 
    margin-bottom: 1.5rem; 
  }
`;

const EmptyStateMessage = ({ title, message }: { title: string; message: string }) => (
  <div className={emptyStateStyles}>
    <h3>{title}</h3>
    <p>{message}</p>
  </div>
);

const UserSearchBar = ({ value, onChange, onSearch, isLoading }: { 
  value: string; 
  onChange: (v: string) => void; 
  onSearch: () => void; 
  isLoading: boolean; 
}) => (
  <div className={searchContainerStyles}>
    <div className={searchWrapperStyles}>
      <Search className={searchIconStyles} />
      <input
        type="text"
        className={searchInputStyles}
        placeholder="Search by phone number or ID number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
    <button className={searchButtonStyles} onClick={onSearch} disabled={isLoading}>
      Search
    </button>
  </div>
);

function useUserTransactions(userId?: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!userId) return setTransactions([]);
    setIsFetching(true);
    getTransactions(userId)
      .then(setTransactions)
      .finally(() => setIsFetching(false));
  }, [userId]);

  return { transactions, isFetching };
}


export type UserWithPublicAttributes = User & { last_login: string };

export default function Users() {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [lastSearchValue, setLastSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<UserWithPublicAttributes[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithPublicAttributes | null>(null);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);

  const { transactions, isFetching: isFetchingTransactions } = useUserTransactions(selectedUser?.id);
  const { toasts, addToast, removeToast } = useToasts();

  const isLoading = isFetchingUsers || isFetchingTransactions;
  const isBackButtonVisible = selectedUser && searchResults.length > 1;
  const showSearchResults = lastSearchValue && !isLoading;

  const handleUserSearch = () => {
    setIsFetchingUsers(true);
    setLastSearchValue(searchInputValue);
    setSelectedUser(null);

    const normalizedQuery = normalizePhoneNumber(searchInputValue);
    searchUser(normalizedQuery)
      .then((users) => {
        setSearchResults(users);
        if (users.length === 1) setSelectedUser(users[0]);
      })
      .finally(() => setIsFetchingUsers(false));
  };

  const handleUnlockAccount = (user: UserWithPublicAttributes) => {
    unlockUserAccount(user.id, "Account unlocked by admin")
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
    <Layout>
      <div className={containerStyles}>
        <Header heading="Users" description="Manage and view user details and activity." />

        {isBackButtonVisible && (
          <button onClick={() => setSelectedUser(null)} className={cx(backButtonStyles, containerStyles)}>
            Back
          </button>
        )}

        <UserSearchBar
          value={searchInputValue}
          onChange={setSearchInputValue}
          onSearch={handleUserSearch}
          isLoading={isLoading}
        />

        {showSearchResults && (
          <>
            {selectedUser && (
              <UserDetailCard user={selectedUser} onUnlock={handleUnlockAccount} />
            )}

            {!selectedUser && searchResults.length > 0 && (
              <UserTable
                users={searchResults}
                onViewUserTransactions={(user) => {
                  setSelectedUser(user);
                  setSearchInputValue(user.phone_number);
                }}
                onUnlock={handleUnlockAccount}
              />
            )}

            {selectedUser && transactions.length > 0 && (
              <UserTransactionsTable transactions={transactions} />
            )}

            {searchResults.length === 0 && (
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
    </Layout>
  );
}
