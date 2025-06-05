import axios from "axios";
import { TOKEN } from "../../constants/strings.ts";

const api = axios.create({
  baseURL: "https://api.jemanaila.dev/saveup",
  timeout: 50000,
});

api.interceptors.request.use(config => {
  const newConfig = { ...config };
  const authToken = localStorage.getItem(TOKEN);

  if (newConfig.headers)
    newConfig.headers.authorization = `Bearer ${authToken || ""}`;

  return newConfig;
}, error => Promise.reject(error));

export default api;