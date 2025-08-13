import { USER } from "../constants/strings";

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(USER);
  return !!token;
};