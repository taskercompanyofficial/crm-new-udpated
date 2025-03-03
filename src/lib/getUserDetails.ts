import { API_URL } from "@/lib/apiEndPoints";
import axios, { AxiosError } from "axios";
import { auth } from "auth";
import { signOut } from "next-auth/react";
import { User } from "@/types";
import { unstable_cache } from 'next/cache';

interface UserDetailsWithToken {
  userDetails: User | null;
  token: string;
  error?: {
    code: string;
    message: string;
  };
}

interface AuthSession {
  user?: {
    token?: string;
  } | null;
}

const getCachedUserDetails = unstable_cache(
  async (token: string): Promise<User | null> => {
    try {
      const response = await axios.get<User>(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return null;
    }
  },
  ['user-details'],
  { revalidate: 60 } // Cache for 60 seconds
);

export async function getUserDetails(): Promise<UserDetailsWithToken> {
  try {
    const session = (await auth()) as AuthSession;
    const token = session?.user?.token;

    if (!token) {
      return {
        userDetails: null,
        token: "",
        error: {
          code: "NO_TOKEN",
          message: "No authentication token found"
        }
      };
    }

    try {
      const userDetails = await getCachedUserDetails(token);

      if (!userDetails) {
        return {
          userDetails: null,
          token: "",
          error: {
            code: "NO_USER_DATA",
            message: "User details not found in response"
          }
        };
      }

      return { userDetails, token };

    } catch (error) {
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        
        if (statusCode === 401) {
          await signOut();
          return {
            userDetails: null,
            token: "",
            error: {
              code: "UNAUTHORIZED",
              message: "Session expired or invalid token"
            }
          };
        }

        return {
          userDetails: null,
          token: "",
          error: {
            code: `HTTP_ERROR_${statusCode}`,
            message: error.response?.data?.message || error.message
          }
        };
      }

      return {
        userDetails: null,
        token: "",
        error: {
          code: "UNKNOWN_ERROR",
          message: error instanceof Error ? error.message : "An unknown error occurred"
        }
      };
    }

  } catch (error) {
    return {
      userDetails: null,
      token: "",
      error: {
        code: "AUTH_ERROR",
        message: "Failed to get authentication session"
      }
    };
  }
}
