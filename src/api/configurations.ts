import type { Config, ConfigPatchPayload } from "../types/configurations.types"
import api from "./config"

export const getConfigurations = async (): Promise<Config[]> => {
  try {
    const response = await api.get(`config`)
    
    if (response.status === 200) {
      return response.data
    }

    throw new Error("Failed to fetch configs")
  } catch (error) {
    return Promise.reject(error)
  }
}

export const createConfiguration = async (config: Omit<Config, 'id'>):Promise<void> => {
  try {
    const response = await api.post(`configurations`, config)
    
    if (response.status === 201) return
    
    throw new Error("Failed to fetch configs")
  } catch (error) {
    return Promise.reject(error)
  }
}

export const updateConfigurations = async (
    id: number,
    config: ConfigPatchPayload
): Promise<void> => {
    try {
        const response = await api.put(`configurations/${id}`, config)
        if (response.status === 200) return
        throw new Error("Failed to update configs")
    } catch (error){
        return Promise.reject(error)
    }
}