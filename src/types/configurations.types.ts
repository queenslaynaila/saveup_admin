export type Config = {
    id: number;
    country_name: string;
    calling_code: number;
    languages: string[];
    max_deposit: number;
    min_deposit: number;
    max_withdrawal: number;
    min_withdrawal: number;
    withdrawal_charges: string;
    currency: string;
}

export type ConfigPatchPayload =  & Partial<Omit<Config, "id">>;