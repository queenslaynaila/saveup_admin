import { TOKEN, USER } from "../../constants/strings";
import type { LoginData, User } from "../../types/user.types";
import { prependCountryCode } from "../../utils/validators";
import api from "./config";

export const signIn = async (
  { phone_number, pin }: LoginData
): Promise<string> => {
  const newPhone = prependCountryCode(phone_number);

  const data: LoginData = {
    phone_number: newPhone,
    pin,
  };

  const response = await api.post("/auth/login", data);

  const authorizationToken = response.headers.authorization || "";
  const user: User = response.data;

  localStorage.setItem(TOKEN, authorizationToken);
  localStorage.setItem(USER, JSON.stringify(user));

  return "success";
};

export const signOut = async (): Promise<number> => {
  try {
    const response = await api.delete("/auth/logout");
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);

    return response.status;
  } catch (error) {
    return Promise.reject(error);
  }
};