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
    <div className="space-y-4">
      <div className="mb-4 flex gap-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-10 w-1/2" />
      </div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AttendanceStatus({ data }: { data: AttendanceData }) {
  const session = useSession();
  const token = session.data?.user?.token || "";
  const [presentUsers, setPresentUsers] = React.useState<UserData[]>(
    data.present,
  );
  const [absentUsers, setAbsentUsers] = React.useState<UserData[]>(data.absent);
  const [loadingUserId, setLoadingUserId] = React.useState<string | null>(null);

  const { post, setData } = useForm({
    location: "User location",
    latitude: 0,
    longitude: 0,
    date: new Date().toISOString().split("T")[0],
  });
  if (data == null) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <h2 className="text-lg font-semibold text-red-600">
          Something went wrong:
        </h2>

        <p className="mt-2 text-sm text-gray-600">No data available</p>
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
    <Suspense fallback={<LoadingSkeleton />}>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <Tabs defaultValue="present" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="present" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Present
              </TabsTrigger>
              <TabsTrigger value="absent" className="flex items-center gap-2">
                <UserMinus className="h-4 w-4" />
                Absent
              </TabsTrigger>
            </TabsList>
            <TabsContent value="present">
              <ScrollArea className="h-[350px] w-full rounded-md border">
                <div className="w-max min-w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] bg-background">
                          User
                        </TableHead>
                        <TableHead className="bg-background">Name</TableHead>
                        <TableHead className="bg-background text-right">
                          Assigned
                        </TableHead>
                        <TableHead className="bg-background text-right">
                          Accepted
                        </TableHead>
                        <TableHead className="bg-background text-right">
                          Closed
                        </TableHead>
                        <TableHead className="bg-background text-right">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {presentUsers.map((user: UserData) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <Avatar>
                              <AvatarImage
                                src={user.profile_image}
                                alt={user.full_name}
                              />
                              <AvatarFallback>
                                {user?.full_name
                                  ?.split(" ")
                                  .map((word) => word.charAt(0))
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/crm/staff/${user.id}?tab=attendance`}
                              className="underline"
                            >
                              {user.full_name}
                            </Link>
                          </TableCell>
                          <TableCell className="text-right">
                            {user.assigned_jobs_count}
                          </TableCell>

                          <TableCell className="text-right">
                            {user.accepted_jobs_count}
                          </TableCell>
                          <TableCell className="text-right">
                            {user.closed_jobs_count}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={loadingUserId === user.id}
                              onClick={() => toggleUserStatus(user, "present")}
                            >
                              {loadingUserId === user.id
                                ? "Loading..."
                                : "Mark Absent"}
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
              <ScrollArea className="h-[350px] w-full rounded-md border">
                <div className="w-max min-w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] bg-background">
                          User
                        </TableHead>
                        <TableHead className="bg-background">Name</TableHead>
                        <TableHead className="bg-background">Status</TableHead>
                        <TableHead className="bg-background text-right">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {absentUsers.map((user: UserData) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <Avatar>
                              <AvatarImage
                                src={user.profile_image}
                                alt={user.full_name}
                              />
                              <AvatarFallback>
                                {user?.full_name
                                  ?.split(" ")
                                  .map((word) => word.charAt(0))
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>{user.full_name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">Absent</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={loadingUserId === user.id}
                              onClick={() => toggleUserStatus(user, "absent")}
                            >
                              {loadingUserId === user.id
                                ? "Loading..."
                                : "Mark Present"}
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
    </Suspense>
  );
}
