import { DEFAULT_COUNTRY_CODE } from "../constants/strings";

export const prependCountryCode = (phoneNumber: string) => {
  if (phoneNumber.startsWith("+"))
    return phoneNumber;

  if (phoneNumber.startsWith("254"))
    return `+${phoneNumber}`;

  const trimmedNumber = phoneNumber.replace(/^0+/, "");

  return DEFAULT_COUNTRY_CODE + trimmedNumber;
};