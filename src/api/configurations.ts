
import type { Config } from "../types/configurations.types";
import api from "./config";

export const createConfiguration = async (
  config: Pick<
    Config,
    | 'country_code'
    | 'country_name'
    | 'currency'
    | 'calling_code'
    | 'languages'
    | 'min_deposit'
    | 'max_deposit'
    | 'min_withdrawal'
    | 'max_withdrawal'
    | 'withdrawal_charges'
  >
): Promise<void> => {
  try {
    const response = await api.post(`config`, config);
    if (response.status === 201) return response.data;
    throw new Error("Failed to fetch configs");
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getConfigurations = async (): Promise<Config[]> => {
  try {
    const response = await api.get(`config`);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to fetch configs");
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateConfigurations = async (
  id: number,
  config: Partial<Omit<Config, "id">>
): Promise<void> => {
  try {
    const response = await api.put(`config/${id}`, config);
    if (response.status === 200) return response.data;
    throw new Error("Failed to update configs");
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteConfigurations = async (
  id: number
): Promise<void> => {
  try {
    const response = await api.delete(`config/${id}`);
    if (response.status === 204) return;
    throw new Error("Failed to delete configs");
  } catch (error) {
    return Promise.reject(error);
  }
};