import myAxios from "@/lib/axios.config";
import { auth } from "auth";

export async function fetchData({ endPoint }: { endPoint: string }) {
  try {
    if (!endPoint) {
      throw new Error("Endpoint is required");
    }

    const session = await auth();
    if (!session || !session?.user?.token) {
      throw new Error("Unauthorized access");
    }

    const res = await myAxios.get(endPoint, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status >= 400) {
      return {
        data: null,
        message: res.data?.message || `Error ${res.status}: ${res.statusText}`,
        status: res.status,
      };
    }

    return {
      data: res.data,
      status: res.status,
      message: "Success",
    };

  } catch (error) {
    const errorMessage = 
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      data: null,
      status: 500,
      message: `${errorMessage}. Please try again later.`,
    };
  }
}
