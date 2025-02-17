import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { LOGIN_URL } from "./src/lib/apiEndPoints";
import { AxiosError } from "axios";
import myAxios from "@/lib/axios.config";

// Define custom session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      token: string;
      role: string;
    }
  }
}

export default {
  pages: {
    signIn: "/login", 
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour in seconds
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          ...user,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const res = await myAxios.post(LOGIN_URL, {
            email: credentials.email,
            password: credentials.password,
          });
          const user = res.data?.user;

          if (!user || !user.token) {
            throw new Error("Invalid response from server");
          }
          return user;
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
              throw new Error("Account not found");
            }
            if (error.response?.status === 401) {
              throw new Error("Invalid credentials");
            }
            if (error.response?.data?.message) {
              throw new Error(error.response.data.message);
            }
          }
          console.error("Auth error:", error);
          throw new Error("An error occurred during authentication");
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
