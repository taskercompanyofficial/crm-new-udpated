"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/apiEndPoints";
import axios from "axios";
import { User } from "@/types";
import { useSession, signOut } from "next-auth/react";

interface UserDetailsWithToken {
  userDetails: User | null;
  token: string;
}

export function useUserDetails() {
  const [userDetails, setUserDetails] = useState<UserDetailsWithToken>({
    userDetails: null,
    token: "",
  });
  const session = useSession();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = session?.data?.user?.token;

      // Only sign out if session status is "unauthenticated"
      if (!token && session.status === "unauthenticated") {
        return;
      }

      // Skip API call if no token but session is loading
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log("requesting user details on client");
        const response = await axios.get<User>(`${API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserDetails({ userDetails: response.data, token });
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Only clear details if error is auth-related (401/403)
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setUserDetails({ userDetails: null, token: "" });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [session]);

  return { userDetails, loading };
}
