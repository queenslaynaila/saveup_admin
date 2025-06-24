export type ActivityType = "Transactions" | "Non-Transactions" | "All"

export type TransactionSubType =
  | "Saving"
  | "Donation"
  | "Interest"
  | "Withdrawal"
  | "Penalty"
  | "TransferIn"
  | "TransferOut"
  | "Loan"
  | "Repayment"

export type NonTransactionSubType =
  | "Pocket Creation"
  | "Pocket Deletion"
  | "Invitation Received"
  | "Next of Kin Update"

export interface UserActivity {
  id: number
  userId: number
  type: ActivityType
  subType: TransactionSubType | NonTransactionSubType
  change: string 
  createdAt: string
}
