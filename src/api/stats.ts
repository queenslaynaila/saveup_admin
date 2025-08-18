
import api from "./config"

export const getAuthenticationStats = async (
    startDate?: string,
    endDate?: string,
    country?: string
): Promise<{
    total_registrations: number,
    total_succesful_logins: number,
    total_failed_logins: number,
    locked_accounts: number,
    suspended_accounts: number,
    active_accounts: number,
    inactive_accounts: number,
    dormant_accounts: number
}> => {
    try {
        const params = [];

        if (startDate !== undefined) params.push(`start_date=${startDate}`);
        if (endDate !== undefined) params.push(`end_date=${endDate}`);
        if (country !== undefined) params.push(`country=${country}`);

        const queryString = params.length ? `?${params.join("&")}` : "";
        const response = await api.get(`stats/auth-metrics${queryString}`);

        if (response.status === 200) {
            return response.data;
        }

        throw new Error("Failed to fetch auth stats");
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getExpensesStats = async (
    agg: 'avg' | 'sum' | 'count' | 'min' | 'max',
    startDate?: string,
    endDate?: string,
    country?: string,
): Promise<{
    aggregated_expenses: number,
}> => {
    try {
        const params = [];

        if (startDate !== undefined) params.push(`start_date=${startDate}`);
        if (endDate !== undefined) params.push(`end_date=${endDate}`);
        if (country !== undefined) params.push(`country=${country}`)
        params.push(`agg=${agg}`);

        const queryString = params.length ? `?${params.join("&")}` : "";
        const response = await api.get(`stats/expenses${queryString}`);

        if (response.status === 200) {
            return response.data;
        }
        throw new Error("Failed to fetch expenses stats");
    } catch {
        return Promise.reject(new Error("Failed to fetch expenses stats"));
    }
};

export const getSavingStats = async (
    agg: 'avg' | 'sum' | 'count' | 'min' | 'max',
    startDate?: string,
    endDate?: string,
): Promise<{
    aggregated_savings: number,
}> => {
    try {
        const params = [];

        if (startDate !== undefined) params.push(`start_date=${startDate}`);
        if (endDate !== undefined) params.push(`end_date=${endDate}`);
        params.push(`agg=${agg}`);

        const queryString = params.length ? `?${params.join("&")}` : "";
        const response = await api.get(`stats/savings${queryString}`);

        if (response.status === 200) {
            return response.data;
        }
        throw new Error("Failed to fetch expenses stats");
    } catch {
        return Promise.reject(new Error("Failed to fetch expenses stats"));
    }
};

export const getWithdrawalStats = async (
    startDate: string,
    endDate: string,
    agg: 'avg' | 'sum' | 'count' | 'min' | 'max'
): Promise<{ aggregated_withdrawals: number }> => {
    try {
        const params = [];

        if (startDate !== undefined) params.push(`start_date=${startDate}`);
        if (endDate !== undefined) params.push(`end_date=${endDate}`);
        params.push(`agg=${agg}`);

        const queryString = params.length ? `?${params.join("&")}` : "";
        const response = await api.get(`stats/${queryString}`);

        if (response.status === 200) {
            return response.data;
        }
        throw new Error("Failed to fetch expenses stats");
    } catch {
        return Promise.reject(new Error("Failed to fetch expenses stats"));
    }
};