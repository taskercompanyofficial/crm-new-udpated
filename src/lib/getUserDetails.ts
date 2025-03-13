import { API_URL } from "@/lib/apiEndPoints";
import { auth } from "auth";
import { signOut } from "next-auth/react";
import { User } from "@/types";

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
      const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        const statusCode = response.status;
        
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

        const errorData = await response.json().catch(() => ({}));
        return {
          userDetails: null,
          token: "",
          error: {
            code: `HTTP_ERROR_${statusCode}`,
            message: errorData.message || response.statusText
          }
        };
      }

      const userDetails = await response.json();
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
