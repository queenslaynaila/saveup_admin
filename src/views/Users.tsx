import { css, cx } from "@linaria/atomic";
import { Layout } from "../components/Layout/DashboardLayout";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserWithPublicAttributes } from "../types/user.types";
import { BORDER_COLOR, TEXT_PRIMARY, THEME_COLOR } from "../styles/colors";
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
import { UNLOCK_NOTE } from "../constants/strings";


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


const EmptyStateMessage = ({ title, message }: { title: string; message: string }) => (
  <div className={emptyStateStyles}>
    <h3>{title}</h3>
    <p>{message}</p>
  </div>
);


type UserSearchBarProps = {
  value: string;
  onChange: (v: string) => void;
  isLoading: boolean;
  suggestions: UserWithPublicAttributes[];
  onSuggestionSelect: (user: UserWithPublicAttributes) => void;
  showSuggestions: boolean;
};

const UserSearchBar: React.FC<UserSearchBarProps> = ({
   value, onChange, suggestions, onSuggestionSelect, showSuggestions
}) => (
  <div className={searchContainerStyles}>
    <div className={searchWrapperStyles}>
      <Search className={searchIconStyles} />
      <input
        type="text"
        className={searchInputStyles}
        placeholder="Search by phone number or ID number"
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


const Users: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearchedQuery, setLastSearchedQuery] = useState("");
  const [matchedUsers, setMatchedUsers] = useState<UserWithPublicAttributes[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithPublicAttributes | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { transactions, isFetching: isFetchingTransactions } = useUserTransactions(selectedUser?.id);
  const { toasts, addToast, removeToast } = useToasts();

  const isLoading = isSearching || isFetchingTransactions;
  const isBackButtonVisible = selectedUser && matchedUsers.length > 1;
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
    <Layout>
      <div className={containerStyles}>
        <Header heading="Users" description="Manage and view user details and activity." />

        {isBackButtonVisible && (
          <button onClick={() => setSelectedUser(null)} className={cx(backButtonStyles, containerStyles)}>
            Back
          </button>
        )}

        <UserSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          isLoading={isLoading}
          suggestions={matchedUsers}
          onSuggestionSelect={user => {
            setSelectedUser(user);
            setSearchQuery(user.phone_number);
          }}
          showSuggestions={!selectedUser}
        />

        {showSearchResults && (
          <>
            {selectedUser && (
              <UserDetailCard user={selectedUser} onUnlock={handleUserUnlock} />
            )}

            {selectedUser && transactions.length > 0 && (
              <UserTransactionsTable transactions={transactions} />
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
    </Layout>
  );
};

export default Users;
