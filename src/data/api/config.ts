import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/strings.ts";

const api = axios.create({
  baseURL: "https://api.jemanaila.dev/saveup",
  timeout: 50000,
});

api.interceptors.request.use(config => {
  const newConfig = { ...config };
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  if (newConfig.headers)
    newConfig.headers.authorization = `Bearer ${accessToken || ""}`;

  return newConfig;
}, error => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        
        const res = await axios.post(
          "/auth/refresh",
          {},
          { headers: { refresh: refreshToken || "" } }
        );
        
        const newAccessToken = res.headers.authorization || "";
        localStorage.setItem(ACCESS_TOKEN, newAccessToken);
        
        if (res.data) {
          localStorage.setItem("USER", res.data);
        }
        
        originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (error) {
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;