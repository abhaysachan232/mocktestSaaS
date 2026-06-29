import { loginSchema } from "@/app/login/types";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        console.log("credentials:", credentials);
        if (!credentials?.email || !credentials?.password) return null;

        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // mock DB check
        if (email === "admin@test.com" && password === "123456") {
          return {
            id: "1",
            email,
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});