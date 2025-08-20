export type Config = {
  id: number;
  country_code: string;
  country_name: string;
  currency: string;
  calling_code: string;
  languages: string[];
  min_deposit: number;
  max_deposit: number;
  min_withdrawal: number;
  max_withdrawal: number;
  withdrawal_charges: string;
  created_at: string;
}