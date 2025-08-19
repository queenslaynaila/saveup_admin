import { css, cx } from "@linaria/atomic";
import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { Header } from "../components/Layout/Header";
import Loader from "../components/Loader";
import Toast from "../components/Cards/Toast";
import useToasts from "../hooks/useToast";
import { BORDER_COLOR, TEXT_PRIMARY } from "../styles/colors";
import type { User, UserWithPublicAttributes, UserRole } from "../types/user.types";
import { getModerators, searchUser, updateRole } from "../api/users";
import { UserSearchBar } from "./Users";
import { normalizePhoneNumber } from "../utils/normalisePhone";
import Table, {
  type TableColumnConfig,
  type TableFilterConfig,
  type TablePaginationConfig,
} from "../components/Tables/Table";
import { SectionHeader } from "../components/Cards/SectionHeader";
import { AiFillCustomerService } from "react-icons/ai";

const containerStyles = css`
  padding: 24px;
  width: 100%;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const userActionStyles = css`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0;
  flex-direction: row;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    > * {
      width: 100%;
      margin-bottom: 8px;
    }
    > *:last-child {
      margin-bottom: 0;
    }
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

const roleStyles = css`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${BORDER_COLOR};
`;

const updateBtnStyles = css`
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;   
  font-weight: 600;
`;

const disabledCursor = css`
  cursor: not-allowed;
`;

const pointerCursor = css`
  cursor: pointer;
`;

const idNumberStyles = css`
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.125rem;
`;


type UserRoleUpdateSectionProps = {
  user: UserWithPublicAttributes;
  selectedRole: UserRole | "";
  onRoleChange: (role: UserRole) => void;
  onUpdate: () => void;
  isUpdating: boolean;
};


const UserRoleUpdateSection = ({
  user,
  selectedRole,
  onRoleChange,
  onUpdate,
  isUpdating,
}: UserRoleUpdateSectionProps) => {
  return (
    <div className={userActionStyles}>
        <span>{user.full_name}: {user.phone_number}</span> 
        <span>Current Role: {user.role} </span>
        <select
            value={selectedRole}
            onChange={e => onRoleChange(e.target.value as UserRole)}
            className={
                cx(roleStyles, isUpdating || !selectedRole || selectedRole === user.role ? disabledCursor: pointerCursor)
            }
        >
        <option value="" disabled>
          Select new role
        </option>
        {(['Standard', 'Moderator', 'Admin'] as UserRole[])
          .filter(role => role !== user.role)
          .map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
      </select>
      <button
        onClick={onUpdate}
        disabled={isUpdating || !selectedRole || selectedRole === user.role}
        className={updateBtnStyles}
      >
        {isUpdating ? "Updating Role..." : "Update Role"}
      </button>
    </div>
  );
};

export const EmptyStateMessage = ({ title, message }: { title: string; message: string }) => (
  <div className={emptyStateStyles}>
    <h3>{title}</h3>
    <p>{message}</p>
  </div>
);

const Moderators: React.FC = () => {
  const [moderators, setModerators] = useState<Omit<User, 'pin'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToasts();

  const [searchQuery, setSearchQuery] = useState("");
  const [matchedUsers, setMatchedUsers] = useState<UserWithPublicAttributes[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithPublicAttributes | null>(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");

  const [currentPage, setCurrentPage]      = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const pageSize                          = 10;
  const totalPages                        = Math.ceil(moderators.length / pageSize);

  const columns: TableColumnConfig<Omit<User, 'pin'>>[] = [
    {
      key:    "name",
      header: "Name",
      render: (user) => user.full_name,
    },
    {
      key:    "phone",
      header: "Phone",
      render: (user) => user.phone_number,
    },
    {
      key:    "country",
      header: "Country",
      render: (user) => user.country,
    },
    {
      key:    "gender",
      header: "Gender",
      render: (user) => user.gender,
    },
    {
      key:    "id",
      header: "Id",
      render: (user) => (
        <div>
          <div>{user.id_type}</div>
          <div className={idNumberStyles}>{user.id_number}</div>
        </div>
      ),
    },
  ];

  const uniqueCountries = useMemo(() => {
    const countries = [...new Set(moderators.map((moderator) => moderator.country))]
      .filter(Boolean)
      .sort();
    return countries;
  }, [moderators]);

  const filters: TableFilterConfig[] = [
    {
      key:    "country",
      label:  "Filter by Country",
      value:  selectedCountry,
      onChange: (value) => {
        setSelectedCountry(value);
        setCurrentPage(1);
      },
      options: [
        { value: "All", label: "All Countries" },
        ...uniqueCountries.map((country) => ({ value: country, label: country })),
      ],
    },
  ];

  const pagination: TablePaginationConfig = {
    currentPage,
    totalPages,
    onPageChange: setCurrentPage,
  };

  const handleClearFilters = (): void => {
    setSelectedCountry("All");
  };

  useEffect(() => {
    setIsLoading(true);
    getModerators()
      .then((data) => {
        setModerators(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch moderators");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
      if (searchQuery === "") {
        setMatchedUsers([]);
        setSelectedUser(null);
        return;
      }
  
      setSelectedUser(null);
  
      const normalizedQuery = normalizePhoneNumber(searchQuery);
  
      searchUser(normalizedQuery)
        .then((users) => {
          setMatchedUsers(users);
          if (users.length === 1) setSelectedUser(users[0]);
        })
    }, [searchQuery]);

  const handleUpdateRoleClick = async () => {
    if (!selectedUser || !selectedRole || selectedRole === selectedUser.role) return;
    setIsUpdatingRole(true);
    try {
      await updateRole(selectedUser.id, selectedRole)
        .then(() => addToast(`${selectedUser.full_name} is now a ${selectedRole}!`, "success"))
        .catch((error) => {
          if (error?.response?.status === 403 && error?.response?.data?.message === "ERR_CANT_ACT_ON_SELF") {
            addToast("Can't act on self", "information");
          } else {
            addToast("Failed to update role. Please try again.", "error");
          }
        });
      const updated = await getModerators();
      setModerators(updated);
      setSelectedUser(null);
      setSearchQuery("");
      setMatchedUsers([]);
      setSelectedRole("");
    } catch {
      addToast("Failed to update role", "error");
    } finally {
      setIsUpdatingRole(false);
  }}

  return (
    <DashboardLayout>
      <div className={containerStyles}>
        <Header
          heading="Customer Service Roles"
          description="Manage and organize user roles."
        />

        <UserSearchBar
          placeholder="Search by phone number or id number to update user role"
          value={searchQuery}
          onChange={setSearchQuery}
          isLoading={isLoading}
          suggestions={matchedUsers}
          onSuggestionSelect={user => {
            setSelectedUser(user);
          }}
          showSuggestions={!selectedUser}
        />

        {selectedUser && (
          <UserRoleUpdateSection
            user={selectedUser}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            onUpdate={handleUpdateRoleClick}
            isUpdating={isUpdatingRole}
          />
        )}

        {isLoading && <Loader />}

        {!isLoading && !error && moderators.length === 0 && (
          <EmptyStateMessage
            title="No Moderators"
            message="There are currently no moderators."
          />
        )}

        {!isLoading && !error && moderators.length>0 && (
          <div className={cardStyles}>
            <SectionHeader 
              icon={<AiFillCustomerService className={iconStyles}/>} 
              title="Moderators">
            </SectionHeader>
            <Table
              data={moderators}
              columns={columns}
              filters={filters}
              pagination={pagination}
              onClearFilters={handleClearFilters}
            />
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

export default Moderators;
