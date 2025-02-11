"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/apiEndPoints";
import useForm from "@/hooks/use-form";
import { useSession } from "next-auth/react";
import { revalidate } from "@/actions/revalidate";

interface AttendanceButtonsProps {
  userId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
}

export function AttendanceButtons({
  userId,
  date,
  checkIn,
  checkOut,
}: AttendanceButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useSession();
  const token = data?.user?.token;
  const { post, setData } = useForm({
    location: "User location",
    latitude: 0,
    longitude: 0,
    date: date,
  });

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

  const handleChange = async () => {
    setIsLoading(true);
    try {
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
        date: date,
      });

      const url = checkIn
        ? `${API_URL}/crm/attendance/mark-absent/${userId}`
        : `${API_URL}/crm/attendance/mark-present/${userId}`;

      post(
        url,
        {
          onSuccess: () => {
            toast.success("Successfully checked in");
            revalidate({ path: "/" });
          },
          onError: (error) => {
            toast.error(error.message || "Failed to check in");
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
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleChange}
        size="sm"
        variant="outline"
        className="flex items-center gap-1"
        disabled={isLoading}
      >
        {checkIn ? (
          <LogOut className="h-4 w-4" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        {isLoading ? "Loading..." : checkIn ? "Mark Absent" : "Mark Present"}
      </Button>
    </div>
  );
}
