import type React from "react"
import { useState, useEffect } from "react"
import { FiPlus, FiEdit2, FiSave, FiX, FiGlobe } from "react-icons/fi"
import {
  getConfigurations,
  createConfiguration,
  updateConfigurations,
  deleteConfigurations,
} from "../api/configurations"
import { css} from "@linaria/atomic"
import type { Config } from "../types/configurations.types"
import { EmptyStateMessage } from "../views/Moderators"
import { Header } from "../components/Layout/Header"
import Loader from "../components/Loader"
import { ActionButton } from "../components/Cards/ActionButton"
import { SectionHeader } from "../components/Cards/SectionHeader"
import { WithdrawalChargesEditor } from "../components/Forms/WithdrawalChargesEditor"
import ConfigurationsTable from "../components/ConfigurationsTable"
import Toast from "../components/Cards/Toast"
import useToasts from "../hooks/useToast"
import DashboardLayout from "../components/Layout/DashboardLayout"

const containerStyles = css`
  padding: 24px; 
  width: 100%; 
  @media (max-width: 768px) { 
    padding: 16px; 
  }
`;

const inputStyles = css`
  width: 70%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  box-sizing: border-box;
 
  &:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 2px #000000;
  }
`

const formGridStyles = css`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  width: 100%; 
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const labelStyles = css`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`

const formActionsStyles = css`
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
`

const buttonGroupStyles = css`
  display: flex;
  gap: 0.75rem;
`

const emptyStateStyles = css`
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
`

const configStyles = css`
  margin-top: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
`


const Configurations: React.FC = () => {
  const [isLoading, setIsLoading ] = useState<boolean>(false)
  const { toasts, addToast, removeToast } = useToasts();
  const [configurations, setConfigurations] = useState<Config[]>([])
  const [filteredConfigurations, setFilteredConfigurations] = useState<Config[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, ] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingConfig, setEditingConfig] = useState<Config | null>(null)

  const [newConfig, setNewConfig] = useState<Omit<Config,'id'|'created_at'>>({
    country_code: "",
    country_name: "",
    currency: "",
    calling_code: "",
    languages: [],
    min_deposit: 0,
    max_deposit: 0,
    min_withdrawal: 0,
    max_withdrawal: 0,
    withdrawal_charges: "",
  })

  useEffect(() => {
    setIsLoading(true)
    getConfigurations()
    .then((data)=>{
        setConfigurations(data)
        setFilteredConfigurations(data)
        setIsLoading(false);
    }).catch(() => {
        setError("Failed to fetch configurations");
        setIsLoading(false);
    }).finally(
        () => setIsLoading(false)
    )
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredConfigurations(configurations)
    } else {
      const filtered = configurations.filter(
        (config) =>
          config.country_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          config.currency.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredConfigurations(filtered)
    }
  }, [searchTerm, configurations])

  const handleSubmit = async () => {
    try {
      if (editingConfig) {
        await updateConfigurations(editingConfig.id, newConfig).finally(()=>
          addToast("Configuration was succesfully updated", "success")
        )
      } else {
        await createConfiguration(newConfig).finally(()=>
          addToast("Configuration was succesfully created", "success")
        )
      }

      setShowCreateForm(false)
      setEditingConfig(null)
      setNewConfig({
        calling_code: "",
        country_code: "",
        country_name: "",
        currency: "",
        languages: [],
        min_deposit: 0,
        max_deposit: 0,
        min_withdrawal: 0,
        max_withdrawal: 0,
        withdrawal_charges: "",
      })
    } catch (err) {
        const error = editingConfig ? "Failed to update configuration" : "Failed to create configuration"
        addToast(error, 'error')
      console.error("Error saving configuration:", err)
    }
  }

  const handleEdit = (config: Config) => {
    setEditingConfig(config)
    setNewConfig({
      country_code: config.country_code,
      calling_code: config.calling_code,
      country_name: config.country_name,
      currency: config.currency,
      languages: config.languages,
      min_deposit: config.min_deposit,
      max_deposit: config.max_deposit,
      min_withdrawal: config.min_withdrawal,
      max_withdrawal: config.max_withdrawal,
      withdrawal_charges: config.withdrawal_charges,
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (config: Config) => {
    await deleteConfigurations(config.id)
    .catch(()=> addToast("Could not delete configuration", "error"))
    .finally(()=> addToast("Config deleted succesfully", "success"))
  }

  const handleCancel = () => {
    setShowCreateForm(false)
    setEditingConfig(null)
    setNewConfig({
      country_code: "",
      calling_code: "",
      country_name: "",
      currency: "",
      languages: [],
      min_deposit: 0,
      max_deposit: 0,
      min_withdrawal: 0,
      max_withdrawal: 0,
      withdrawal_charges: "",
    })
  }

   return (
    <DashboardLayout>
      <div className={containerStyles}>
      <Header 
        heading="Configurations" 
        description="Manage country-specific app settings and financial limits" 
      />
      {isLoading && <Loader />}

      <ActionButton onClick={() => setShowCreateForm(true)} variant="primary" icon={FiPlus}>
        Add Configuration
      </ActionButton>

       {!isLoading && !error && configurations.length === 0 && (
          <EmptyStateMessage
            title="No Configurations"
            message="There are currently no configs."
          />
        )}
    
      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className={configStyles}>
          <SectionHeader
            icon={editingConfig ? <FiEdit2/> : <FiPlus/>}
            title={editingConfig ? "Edit Configuration" : "Create New Configuration"}
            children={
              <ActionButton onClick={handleCancel} variant="secondary" icon={FiX}>
                Cancel
              </ActionButton>
            }
          />
          <div className={formGridStyles}>
            <div>
              <label className={labelStyles}>Country Code</label>
              <input
                type="text"
                value={newConfig.country_code}
                onChange={(e) => setNewConfig({ ...newConfig, country_code: e.target.value })}
                className={inputStyles}
                placeholder="KE"
              />
            </div>
            <div>
              <label className={labelStyles}>Country Name</label>
              <input
                type="text"
                value={newConfig.country_name}
                onChange={(e) => setNewConfig({ ...newConfig, country_name: e.target.value })}
                className={inputStyles}
                placeholder="Kenya"
              />
            </div>
            <div>
              <label className={labelStyles}>Currency</label>
              <input
                type="text"
                value={newConfig.currency}
                onChange={(e) => setNewConfig({ ...newConfig, currency: e.target.value })}
                className={inputStyles}
                placeholder="KES"
              />
            </div>
            <div>
              <label className={labelStyles}>Calling Code</label>
              <input
                type="number"
                value={newConfig.calling_code}
                onChange={(e) => setNewConfig({ ...newConfig, calling_code: e.target.value })}
                className={inputStyles}
                placeholder="1"
              />
            </div>
            <div>
              <label className={labelStyles}>Languages (comma-separated)</label>
              <input
                type="text"
                value={newConfig.languages.join(", ")}
                onChange={(e) =>
                  setNewConfig({ ...newConfig, languages: e.target.value.split(",").map((lang) => lang.trim()) })
                }
                className={inputStyles}
                placeholder="English, Swahili"
              />
            </div>
            <div>
              <label className={labelStyles}>Min Deposit</label>
              <input
                type="number"
                step="0.01"
                value={newConfig.min_deposit}
                onChange={(e) => setNewConfig({ ...newConfig, min_deposit: Number.parseFloat(e.target.value) || 0 })}
                className={inputStyles}
                placeholder="10.00"
              />
            </div>
            <div>
              <label className={labelStyles}>Max Deposit</label>
              <input
                type="number"
                step="0.01"
                value={newConfig.max_deposit}
                onChange={(e) => setNewConfig({ ...newConfig, max_deposit: Number.parseFloat(e.target.value) || 0 })}
                className={inputStyles}
                placeholder="10000.00"
              />
            </div>
            <div>
              <label className={labelStyles}>Min Withdrawal</label>
              <input
                type="number"
                step="0.01"
                value={newConfig.min_withdrawal}
                onChange={(e) => setNewConfig({ ...newConfig, min_withdrawal: Number.parseFloat(e.target.value) || 0 })}
                className={inputStyles}
                placeholder="5.00"
              />
            </div>
            <div>
              <label className={labelStyles}>Max Withdrawal</label>
              <input
                type="number"
                step="0.01"
                value={newConfig.max_withdrawal}
                onChange={(e) => setNewConfig({ ...newConfig, max_withdrawal: Number.parseFloat(e.target.value) || 0 })}
                className={inputStyles}
                placeholder="5000.00"
              />
            </div>
            
          </div>
          
          <WithdrawalChargesEditor
                value={newConfig.withdrawal_charges}
                onChange={(value) => setNewConfig({ ...newConfig, withdrawal_charges: value })}
           />
            
          <div className={formActionsStyles}>
            <div className={buttonGroupStyles}>
              <ActionButton onClick={handleCancel} variant="secondary">
                Cancel
              </ActionButton>
              <ActionButton onClick={handleSubmit} variant="primary" icon={FiSave}>
                {editingConfig ? "Update Configuration" : "Create Configuration"}
              </ActionButton>
            </div>
          </div>
        </div>
      )}

      {/* Configurations List */}
      <div  className={configStyles}>
     
        <SectionHeader icon={<FiGlobe/>} title={`Country Configurations (${filteredConfigurations.length})`} />

        {isLoading ? (
          <Loader />
        ) : filteredConfigurations.length === 0 ? (
          <div className={emptyStateStyles}>
            {searchTerm ? "No configurations match your search." : "No configurations found."}
          </div>
        ) : (
          <ConfigurationsTable 
            handleDelete={handleDelete}
            handleEdit={handleEdit} 
            filteredConfigurations={filteredConfigurations}
          />
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
    </div>
    </DashboardLayout>
    
  )
};

export default Configurations;
