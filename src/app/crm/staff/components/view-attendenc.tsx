import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, CheckCircle, XCircle, LogIn, LogOut } from 'lucide-react';
import { fetchData } from '@/hooks/fetchData';
import { Button } from '@/components/ui/button';
import { AttendanceButtons } from './attendance-buttons';
import { buildQueryParams } from '@/actions/get-url-params';

interface AttendanceRecord {
    created_at: string;
    check_in: string | null;
    check_out: string | null;
    check_in_location: string | null;
    check_out_location: string | null;
}

interface MonthlyStats {
    present: number;
    absent: number;
    total_days: number;
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

export default async function ViewAttendence({ userId, searchParams }: { userId: string, searchParams: { [key: string]: string | string[] | undefined } }) {
    const params = buildQueryParams({
        from: searchParams?.from,
        to: searchParams?.to,
    });
    const response: ApiResponse = await fetchData({ endPoint: `/crm/attendance/by-user/${userId}?${params}` });
    const attendanceData = response.data?.data;



    if (!attendanceData) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-12 h-12 text-red-500" />
                <h3 className="text-lg font-semibold text-red-700">Error Loading Data</h3>
                <p className="text-red-600">Unable to fetch attendance records. Please try again later.</p>
            </div>
        );
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <h2 className="text-xl font-semibold">Attendance History</h2>
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
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendanceData?.attendances.map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell>{formatDate(record.created_at)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {record.check_in ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span className="text-green-600 font-medium">Present</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                    <span className="text-red-600 font-medium">Absent</span>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-gray-700">{record.check_in || '-'}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-gray-600">{record.check_in_location || '-'}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-gray-700">{record.check_out || '-'}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-gray-600">{record.check_out_location || '-'}</span>
                                    </TableCell>
                                    <TableCell>
                                        <AttendanceButtons
                                            userId={userId}
                                            date={record.created_at}
                                            checkIn={record.check_in}
                                            checkOut={record.check_out}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>

                <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-3">
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-900">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Present Days</p>
                        <p className="text-2xl font-bold text-green-600">
                            {attendanceData.monthly_stats.present}
                        </p>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-900">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Absent Days</p>
                        <p className="text-2xl font-bold text-red-600">
                            {attendanceData.monthly_stats.absent}
                        </p>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-900">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {((attendanceData.monthly_stats.present / attendanceData.monthly_stats.total_days) * 100).toFixed(0)}%
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
