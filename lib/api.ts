import axios from "axios";

// ✅ axios instance
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

/* ================================
   ✅ REQUEST INTERCEPTOR
================================ */
api.interceptors.request.use(
  (config) => {
    // ✅ cookies automatically send ho jayengi
    return config;
  },
  (error) => Promise.reject(error),
);

/* ================================
   ✅ RESPONSE INTERCEPTOR
================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
