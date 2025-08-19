export type AuthStats = {
  total_registrations: number
  total_logins: number
  total_failed_logins: number
  locked_accounts: number
}

export type AggregatedStats = {
  aggregated_expenses?: number
  aggregated_savings?: number
  aggregated_withdrawals?: number
}

export type AggregationType = "avg" | "sum" | "count" | "min" | "max"
