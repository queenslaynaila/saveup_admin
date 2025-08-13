import type { UserWithPublicAttributes } from "../../views/Users"
import api from "./config"

export const searchUser = async (searchValue: string): Promise<UserWithPublicAttributes[]>  => {
  try {
    const response = await api.get(`users/search?value=${searchValue}`)
    
    if (response.status === 200) {
      return response.data
    }

    throw new Error("Failed to fetch user")
  } catch (error) {
    return Promise.reject(error)
  }
}

export const unlockUserAccount = async (
  userId: number,
  notes: string 
): Promise<void> => {
  try {
    const response = await api.patch(`users/${userId}/unlock`, {
      notes
    })
    
    if (response.status === 200) {
      return
    }

    throw new Error("Failed to unlock user account")
  } catch (error) {
    return Promise.reject(error)
  }
}

export const updateUserAccountStatus = async (
  userId: number,
  status: "Active" | "Inactive" | "Suspended",
  reason?: string
): Promise<{status:"Active" | "Inactive" | "Suspended"}> => {
  try {
    const response = await api.patch(`users/${userId}/status`, {
      status,
      reason
    })
    
    if (response.status === 200) {
      return response.data
    }

    throw new Error("Failed to update user account status")
  } catch (error) {
    return Promise.reject(error)
  }
}