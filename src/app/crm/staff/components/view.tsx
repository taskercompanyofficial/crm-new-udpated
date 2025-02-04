import React from "react";
import { User, Mail, Phone, MapPin, Building, Calendar, BadgeCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ViewStaff({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-lg shadow-sm dark:bg-slate-950">
      <div className="relative h-48 rounded-t-lg bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute -bottom-16 left-8">
          <div className="flex items-center justify-center w-32 h-32 bg-gray-200 border-4 border-white rounded-full dark:border-slate-950">
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
        </div>
      </div>

      <div className="px-8 pt-20 pb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{data.full_name}</h1>
            <p className="text-gray-600 capitalize dark:text-gray-400">{data.role}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            data.status === 'active' ? 'bg-green-100 text-green-800' : 
            data.status === 'inactive' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          } capitalize`}>
            {data.status}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="pb-2 text-lg font-semibold border-b">Personal Information</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Father&aposs Name:</span>
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
                  <span className="text-gray-600 dark:text-gray-400">Secondary Phone:</span>
                  <span>{data.secondary_phone_number}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="pb-2 text-lg font-semibold border-b">Work Information</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Location:</span>
                <span className="capitalize">{data.city}, {data.state}</span>
              </div>

              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Branch ID:</span>
                <span>{data.branch_id}</span>
              </div>

              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">CRM Access:</span>
                <span className="capitalize">{data.has_crm_access}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Joined:</span>
                <span>{formatDate(data.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b">Address</h2>
          <p className="text-gray-700 dark:text-gray-300">{data.full_address}</p>
        </div>
      </div>
    </div>
  );
}
