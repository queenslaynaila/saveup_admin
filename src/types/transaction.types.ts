type TransactionType = 
  'Saving'|
  'Donations'|
  'Interest'|
  'Withdrawal'|
  'Penalty'|
  'TransferIn'|
  'TransferOut'|
  'Loan'|
  'Repayment'

export interface Transaction  {
  reference_id: number,
  slug:TransactionType,
  pocket_id: number,
  pocket_name:string,
  currency: string,
  delta: number,
  balance: number,
  created_at: string
}