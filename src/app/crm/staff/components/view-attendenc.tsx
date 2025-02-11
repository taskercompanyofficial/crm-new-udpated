import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { fetchData } from "@/hooks/fetchData";
import { Button } from "@/components/ui/button";
import { AttendanceButtons } from "./attendance-buttons";
import { buildQueryParams } from "@/actions/get-url-params";
import ActionBtns from "./action-btns";

interface AttendanceRecord {
  created_at: string;
  check_in: string | null;
  check_out: string | null;
  check_in_location: string | null;
  check_out_location: string | null;
  is_sunday: boolean;
  daily_salary: number;
}

interface MonthlyStats {
  present: number;
  absent: number;
  total_days: number;
  sundays: number;
  total_salary: number;
  base_salary: number;
}

interface AttendanceData {
  attendances: AttendanceRecord[];
  monthly_stats: MonthlyStats;
}

interface ApiResponse {
  data: {
    data: AttendanceData | null;
    status: number;
  } | null;
}

export default async function ViewAttendence({
  userId,
  searchParams,
}: {
  userId: string;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = buildQueryParams({
    from: searchParams?.from,
    to: searchParams?.to,
  });
  const response: ApiResponse = await fetchData({
    endPoint: `/crm/attendance/by-user/${userId}?${params}`,
  });
  const attendanceData = response.data?.data;

  if (!attendanceData) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-red-200 bg-red-50 p-8">
        <XCircle className="h-12 w-12 text-red-500" />
        <h3 className="text-lg font-semibold text-red-700">
          Error Loading Data
        </h3>
        <p className="text-red-600">
          Unable to fetch attendance records. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Attendance History</h2>
          </div>
          <ActionBtns userId={userId} params={params} />
        </div>

        <ScrollArea className="h-[500px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In Time</TableHead>
                <TableHead>Check In Location</TableHead>
                <TableHead>Check Out Time</TableHead>
                <TableHead>Check Out Location</TableHead>
                <TableHead>Daily Salary</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData?.attendances.map((record, index) => (
                <TableRow
                  key={index}
                  className={record.is_sunday ? "bg-gray-50" : ""}
                >
                  <TableCell>{formatDate(record.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {record.is_sunday ? (
                        <span className="font-medium text-gray-600">
                          Sunday
                        </span>
                      ) : record.check_in ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-green-600">
                            Present
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="font-medium text-red-600">
                            Absent
                          </span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700">
                      {record.check_in || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600">
                      {record.check_in_location || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700">
                      {record.check_out || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600">
                      {record.check_out_location || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700">
                      {record.daily_salary.toFixed(2)} PKR
                    </span>
                  </TableCell>
                  <TableCell>
                    {!record.is_sunday && (
                      <AttendanceButtons
                        userId={userId}
                        date={record.created_at}
                        checkIn={record.check_in}
                        checkOut={record.check_out}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-slate-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Present Days
            </p>
            <p className="text-2xl font-bold text-green-600">
              {attendanceData.monthly_stats.present}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-slate-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Absent Days
            </p>
            <p className="text-2xl font-bold text-red-600">
              {attendanceData.monthly_stats.absent}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-slate-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Sundays</p>
            <p className="text-2xl font-bold text-purple-600">
              {attendanceData.monthly_stats.sundays}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-slate-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Salary
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {attendanceData.monthly_stats.total_salary.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
