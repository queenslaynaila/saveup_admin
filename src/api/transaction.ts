import type { Transaction } from "../types/transaction.types"
import api from "./config"

export const getTransactions = 
    async (entityId: number): Promise<Transaction[]> => {
  try {
    const response = await api.get(`${entityId}/transactions`)

    if (response.status === 200) {
      return response.data
    }

    throw new Error("Failed to fetch user transactions")
  } catch (error) {
    return Promise.reject(error)
  }
}