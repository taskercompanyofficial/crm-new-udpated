"use client";
import { useUserDetails } from "@/lib/getUserInclient";
import { LoadingScreen } from "@/components/custom/loading-screen";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { loading, userDetails } = useUserDetails();

  if (loading || userDetails) {
    if (userDetails) {
      router.push("/crm");
    }
    return <LoadingScreen text="Loading your workspace..." />;
  }

  router.push("/login");
  return <LoadingScreen text="Redirecting to login..." />;
}
