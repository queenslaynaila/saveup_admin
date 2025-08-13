import type { Group } from "../../types/groups.types"
import api from "./config"

export const getGroups = async (userId:number): Promise<Group[]> => {
  try {
    const response = await api.get(`users/${userId}/groups  `)
    
    if (response.status === 200) {
      return response.data
    }

    throw new Error("Failed to fetch groups")
  } catch (error) {
    return Promise.reject(error)
  }
}