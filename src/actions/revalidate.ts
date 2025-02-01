"use server";

import { revalidatePath } from "next/cache";

export async function revalidate({ path }: { path?: any }) {
  try {
    return revalidatePath(path || "/");
  } catch (error) {
    return {
      status: 500,
      message: "Unknown error occurred. Please try again later.",
    };
  }
}
