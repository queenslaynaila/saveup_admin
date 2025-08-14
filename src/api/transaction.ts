import type { Transaction } from "../types/transaction.types"
import api from "./config"

export const getTransactions = async (
  entityId: number,
  before?: number,
  after?: number
): Promise<Transaction[]> => {
  try {
    const params = [];
    if (before !== undefined) params.push(`before=${before}`);
    if (after !== undefined) params.push(`after=${after}`);

    const queryString = params.length ? `?${params.join("&")}` : "";
    const response = await api.get(`${entityId}/transactions${queryString}`);

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Failed to fetch user transactions");
  } catch (error) {
    return Promise.reject(error);
  }
}