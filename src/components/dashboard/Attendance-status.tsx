"use client";

import React, { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, UserMinus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/apiEndPoints";
import useForm from "@/hooks/use-form";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import ErrorNoData from "../custom/no-data";

type UserData = {
  id: string;
  full_name: string;
  profile_image: string;
  assigned_jobs_count: number;
  accepted_jobs_count: number;
  closed_jobs_count: number;
  message?: string;
};

interface AttendanceData {
  present: UserData[];
  absent: UserData[];
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      <div className="mb-2 flex gap-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <div className="space-y-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AttendanceStatusComponent({ data }: { data: AttendanceData }) {
  const session = useSession();
  const token = session.data?.user?.token || "";
  const [presentUsers, setPresentUsers] = React.useState<UserData[]>(
    data?.present || [],
  );
  const [absentUsers, setAbsentUsers] = React.useState<UserData[]>(
    data?.absent || [],
  );
  const [loadingUserId, setLoadingUserId] = React.useState<string | null>(null);

  const { post, setData } = useForm({
    location: "User location",
    latitude: 0,
    longitude: 0,
    date: new Date().toISOString().split("T")[0],
  });

  if (data == null) {
    return (
      <div className="flex flex-col items-center justify-center p-2">
        <h2 className="text-xs font-semibold text-red-600">
          Something went wrong:
        </h2>
        <p className="mt-1 text-xs text-gray-600">No data available</p>
      </div>
    );
  }

  const getGeolocation = async (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error: GeolocationPositionError) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error("Location permission denied"));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error("Location information unavailable"));
              break;
            case error.TIMEOUT:
              reject(new Error("Location request timed out"));
              break;
            default:
              reject(new Error("An unknown error occurred"));
          }
        },
      );
    });
  };

  const toggleUserStatus = async (
    user: UserData,
    currentStatus: "present" | "absent",
  ) => {
    try {
      setLoadingUserId(user.id);

      const position = await Promise.race([
        getGeolocation(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error("Location request timed out")),
            10000,
          ),
        ),
      ]);

      if (!position.coords) {
        throw new Error("Invalid position data received");
      }

      setData({
        location: "Head Office location",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        date: new Date().toISOString().split("T")[0],
      });

      const url =
        currentStatus === "present"
          ? `${API_URL}/crm/attendance/mark-absent/${user.id}`
          : `${API_URL}/crm/attendance/mark-present/${user.id}`;

      post(
        url,
        {
          onSuccess: (response) => {
            if (currentStatus === "present") {
              setPresentUsers(presentUsers.filter((u) => u.id !== user.id));
              setAbsentUsers([
                ...absentUsers,
                { ...user, message: "User marked as absent" },
              ]);
            } else {
              setAbsentUsers(absentUsers.filter((u) => u.id !== user.id));
              setPresentUsers([
                ...presentUsers,
                { ...user, message: "User marked as present" },
              ]);
            }
            toast.success(response.message);
          },
          onError: (error) => {
            toast.error(error.message || "Failed to update attendance status");
          },
        },
        token,
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Location permission denied") {
          toast.error("Please enable location services to mark attendance");
        } else if (error.message === "Location request timed out") {
          toast.error("Location request timed out. Please try again.");
        } else if (error.message === "Location information unavailable") {
          toast.error("Unable to get your location. Please try again.");
        } else {
          toast.error(error.message || "An unexpected error occurred");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-2">
        <Tabs defaultValue="present" className="space-y-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="present"
              className="flex items-center gap-1 text-xs"
            >
              <User className="h-3 w-3" />
              Present
            </TabsTrigger>
            <TabsTrigger
              value="absent"
              className="flex items-center gap-1 text-xs"
            >
              <UserMinus className="h-3 w-3" />
              Absent
            </TabsTrigger>
          </TabsList>
          <TabsContent value="present">
            <ScrollArea className="h-[370px] w-full rounded-md border">
              <div className="w-max min-w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px] bg-background text-xs">
                        User
                      </TableHead>
                      <TableHead className="bg-background text-xs">
                        Name
                      </TableHead>
                      <TableHead className="bg-background text-right text-xs">
                        Assigned
                      </TableHead>
                      <TableHead className="bg-background text-right text-xs">
                        Accepted
                      </TableHead>
                      <TableHead className="bg-background text-right text-xs">
                        Closed
                      </TableHead>
                      <TableHead className="bg-background text-right text-xs">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {presentUsers.map((user: UserData) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={user.profile_image}
                              alt={user.full_name}
                            />
                            <AvatarFallback className="text-[10px]">
                              {user?.full_name
                                ?.split(" ")
                                .map((word) => word.charAt(0))
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="text-xs">
                          <Link
                            href={`/crm/staff/${user.id}?tab=attendance`}
                            className="underline"
                          >
                            {user.full_name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {user.assigned_jobs_count}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {user.accepted_jobs_count}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {user.closed_jobs_count}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            disabled={loadingUserId === user.id}
                            onClick={() => toggleUserStatus(user, "present")}
                          >
                            {loadingUserId === user.id ? "..." : "Mark Absent"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="absent">
            <ScrollArea className="h-[250px] w-full rounded-md border">
              <div className="w-max min-w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px] bg-background text-xs">
                        User
                      </TableHead>
                      <TableHead className="bg-background text-xs">
                        Name
                      </TableHead>
                      <TableHead className="bg-background text-xs">
                        Status
                      </TableHead>
                      <TableHead className="bg-background text-right text-xs">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {absentUsers.map((user: UserData) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={user.profile_image}
                              alt={user.full_name}
                            />
                            <AvatarFallback className="text-[10px]">
                              {user?.full_name
                                ?.split(" ")
                                .map((word) => word.charAt(0))
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="text-xs">
                          {user.full_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive" className="text-[10px]">
                            Absent
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="default"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            disabled={loadingUserId === user.id}
                            onClick={() => toggleUserStatus(user, "absent")}
                          >
                            {loadingUserId === user.id ? "..." : "Mark Present"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export function AttendanceStatus({ data }: { data: AttendanceData }) {
  if (!data || !data.present || data.present.length === 0) {
    return <ErrorNoData />;
  }
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AttendanceStatusComponent data={data} />
    </Suspense>
  );
}
