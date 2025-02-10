import React from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  BadgeCheck,
  Star,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import ViewAttendence from "./view-attendenc";
import { DateRangePicker } from "@/components/custom/date-range-picker";

export default async function ViewStaff({ data, searchParams }: { data: any, searchParams: { [key: string]: string | string[] | undefined } }) {
  return (
    <Tabs defaultValue={searchParams.tab as string || "profile"}>
      <div className="flex items-center justify-between">

        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <DateRangePicker />
      </div>
      <div className="bg-white rounded-lg shadow-sm dark:bg-slate-950">

        <TabsContent value="profile">
          <div className="relative h-48 overflow-hidden rounded-t-lg bg-gradient-to-r from-blue-500 to-purple-600">

            <div className="absolute inset-0 bg-[url('/assets/images/pattern.svg')] opacity-10"></div>
            <div className="absolute flex items-center gap-2 right-4 top-4">
              <Badge variant="secondary" className="font-medium">
                ID: {data.employee_id || "#12345"}
              </Badge>
              <Badge variant="secondary" className="font-medium">
                Joined: {formatDate(data.created_at)}
              </Badge>
            </div>
            <div className="absolute flex items-end gap-4 -bottom-16 left-8">
              <div className="flex items-center justify-center w-32 h-32 transition-transform bg-gray-200 border-4 border-white rounded-full shadow-lg hover:scale-105 dark:border-slate-950">
                {data.profile_image ? (
                  <img
                    src={data.profile_image}
                    alt={data.full_name}
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <User size={48} className="text-gray-400" />
                )}
              </div>
              <div className="flex gap-2 mb-16">
                <Button variant="secondary" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button variant="secondary" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              </div>
            </div>
          </div>

          <div className="px-8 pt-20 pb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">{data.full_name}</h1>
                <p className="text-gray-600 capitalize dark:text-gray-400">
                  {data.role}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${data.status === "active"
                    ? "bg-green-100 text-green-800"
                    : data.status === "inactive"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                    } capitalize`}
                >
                  {data.status}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">
                    {data.performance_rating || "4.5"}/5
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="pb-2 text-lg font-semibold border-b">
                  Personal Information
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Father&aposs Name:
                    </span>
                    <span>{data.father_name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span>{data.contact_email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                    <span>{data.phone_number}</span>
                  </div>

                  {data.secondary_phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Secondary Phone:
                      </span>
                      <span>{data.secondary_phone_number}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="pb-2 text-lg font-semibold border-b">
                  Work Information
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Location:
                    </span>
                    <span className="capitalize">
                      {data.city}, {data.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Branch ID:
                    </span>
                    <span>{data.branch_id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      CRM Access:
                    </span>
                    <span className="capitalize">{data.has_crm_access}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Joined:
                    </span>
                    <span>{formatDate(data.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-900">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">Attendance</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {data.attendance_percentage || "95"}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last 30 days
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-900">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold">Complaints</h3>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {data.total_complaints || "2"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total received
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-900">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">Tasks Completed</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {data.tasks_completed || "45"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last 30 days
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="pb-2 mb-4 text-lg font-semibold border-b">Address</h2>
              <p className="text-gray-700 dark:text-gray-300">
                {data.full_address}
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="attendance">
          <ViewAttendence userId={data.id} searchParams={searchParams} />
        </TabsContent>
        <TabsContent value="complaints">
          {/* <ViewComplaints userId={data.id} /> */}
        </TabsContent>
        <TabsContent value="tasks">
          {/* <ViewTasks userId={data.id} /> */}
        </TabsContent>
      </div>
    </Tabs>
  );
}


