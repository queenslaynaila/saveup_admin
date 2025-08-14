import type { Transaction, TransactionType } from "../types/transaction.types"
import api from "./config"

export const getTransactions = async (
  entityId: number,
  before?: number,
  after?: number,
  slug?: TransactionType
): Promise<Transaction[]> => {
  try {
    const params = [];
    if (before !== undefined) params.push(`before=${before}`);
    if (after !== undefined) params.push(`after=${after}`);
    if (slug) params.push(`slug=${slug}`);

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