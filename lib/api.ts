import axios from "axios";

// ✅ axios instance

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
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
