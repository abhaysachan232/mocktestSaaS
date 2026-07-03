export const ROLES = {
  ADMIN: "ADMIN",
  COACHING: "COACHING",
  STUDENT: "STUDENT",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  CREATE_COACHING: "/create-coaching",
} as const;

export const MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  INVALID_CREDENTIALS: "Invalid email or password",
  SOMETHING_WENT_WRONG: "Something went wrong",
} as const;
