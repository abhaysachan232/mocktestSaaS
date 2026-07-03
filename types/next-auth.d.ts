import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      coachingId?: string | null;
    } & DefaultSession["user"];
  }
  interface User {
    role: string;
    coachingId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    coachingId?: string | null;
  }
}
