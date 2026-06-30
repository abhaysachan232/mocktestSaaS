import { api } from "@/lib/api";

export const forgotPassword = async (data: {
  email: string;
  mobile: string;
  dob: string;
}) => {
  const response = await api.post("/api/auth/forgot-password", data);

  return response.data;
};

export const resetPassword = async (password: string) => {
  const response = await api.post("/api/auth/reset-password", {
    password,
  });

  return response.data;
};
