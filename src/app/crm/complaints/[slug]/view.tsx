"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { formatDate, getImageUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  User,
  FileText,
  Package,
  ImageIcon,
  Printer,
} from "lucide-react";
import { useSession } from "next-auth/react";
import useFetch from "@/hooks/usefetch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComplaintStatusOptions } from "@/lib/otpions";
import { Button } from "@/components/ui/button";

interface ReviewType {
  rating: number;
  reason: string;
  comment: string;
  complaint_id: number;
}

export default function ViewComplaint({ complaint }: { complaint: any }) {
  const files = complaint.files ? JSON.parse(complaint.files) : [];
  const session = useSession();
  const token = session.data?.user?.token || "";
  const {
    data: reviewsData,
    error,
    isLoading,
  } = useFetch<ReviewType>(
    `https://api.taskercompany.com/api/crm/complaint/customer-reviews/${complaint.id}`,
    token,
  );

  const statusOption =
    ComplaintStatusOptions.find((option) => option.value === complaint.status) ||
    ComplaintStatusOptions[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-5xl p-4 print:p-0">
      <div className="flex justify-end mb-4 print:hidden">
        <Button
          onClick={handlePrint}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>

      <Card className="rounded-lg border bg-white p-6 shadow-sm print:shadow-none print:border-none">
        {/* Header - Job Sheet Title */}
        <div className="mb-6 border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-primary print:text-black">Job Sheet</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-semibold">Job No: #{complaint.complain_num}</span>
                <Badge className={`px-2 py-0.5 text-xs`}
                  style={{ backgroundColor: `rgb(${statusOption.color})` }}>
                  {statusOption.label}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Created By:</p>
              <p className="text-xs font-medium">{complaint.user?.username || "N/A"}</p>
              <p className="text-xs text-gray-500 mt-1">Date Created:</p>
              <p className="text-xs font-medium">{formatDate(complaint.created_at)}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Customer and Product Section */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Customer Info */}
            <div className="border rounded p-3">
              <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-primary border-b pb-1.5">
                <User className="h-4 w-4" />
                Customer Details
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-3">
                  <span className="text-xs text-gray-600 font-medium">Name:</span>
                  <span className="col-span-2 text-xs">{complaint.applicant_name}</span>
                </div>
                {complaint.applicant_email && (
                  <div className="grid grid-cols-3">
                    <span className="text-xs text-gray-600 font-medium">Email:</span>
                    <span className="col-span-2 text-xs">{complaint.applicant_email}</span>
                  </div>
                )}
                <div className="grid grid-cols-3">
                  <span className="text-xs text-gray-600 font-medium">Phone:</span>
                  <span className="col-span-2 text-xs">{complaint.applicant_phone}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-xs text-gray-600 font-medium">WhatsApp:</span>
                  <span className="col-span-2 text-xs">{complaint.applicant_whatsapp}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-xs text-gray-600 font-medium">Address:</span>
                  <span className="col-span-2 text-xs">{complaint.applicant_adress}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-xs text-gray-600 font-medium">Branch:</span>
                  <span className="col-span-2 text-xs">{complaint.branch?.name || "N/A"}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-xs text-gray-600 font-medium">Brand:</span>
                  <span className="col-span-2 text-xs">{complaint.brand?.name || "N/A"}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-xs text-gray-600 font-medium">Complaint Type:</span>
                  <span className="col-span-2 text-xs capitalize">{complaint.complaint_type?.replace("-", " ") || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="border rounded p-3">
              <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-primary border-b pb-1.5">
                <Package className="h-4 w-4" />
                Product Details
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-3">
                  <span className="text-xs text-gray-600 font-medium">Product:</span>
                  <span className="col-span-2 text-xs">{complaint.product} {complaint.model}</span>
                </div>
                {complaint.serial_number_ind && (
                  <div className="grid grid-cols-3">
                    <span className="text-xs text-gray-600 font-medium">SN (IND):</span>
                    <span className="col-span-2 text-xs">{complaint.serial_number_ind}</span>
                  </div>
                )}
                {complaint.serial_number_oud && (
                  <div className="grid grid-cols-3">
                    <span className="text-xs text-gray-600 font-medium">SN (OUD):</span>
                    <span className="col-span-2 text-xs">{complaint.serial_number_oud}</span>
                  </div>
                )}
                <div className="grid grid-cols-3">
                  <span className="text-xs text-gray-600 font-medium">Technician:</span>
                  <span className="col-span-2 text-xs">{complaint.technician || "N/A"}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-xs text-gray-600 font-medium">Amount:</span>
                  <span className="col-span-2 text-xs">{complaint.amount || "N/A"}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-xs text-gray-600 font-medium">Call Status:</span>
                  <span className="col-span-2 text-xs capitalize">{complaint.call_status?.replace("-", " ") || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="border rounded p-3">
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-primary border-b pb-1.5">
              <FileText className="h-4 w-4" />
              Service Details
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-medium mb-1">Description of Issue:</h4>
                <p className="bg-gray-50 p-2 rounded text-xs">{complaint.description || "Not Added"}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium mb-1">Working Details:</h4>
                <p className="bg-gray-50 p-2 rounded text-xs">{complaint.working_details || "Not Added"}</p>
              </div>
              {complaint.p_date && (
                <div className="grid grid-cols-3">
                  <span className="text-xs text-gray-600 font-medium">Purchase Date:</span>
                  <span className="col-span-2 text-xs">{formatDate(complaint.p_date)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Previous Reviews - Only visible on screen */}
          <div className="border rounded p-3 print:hidden">
            <h3 className="mb-3 text-sm font-semibold text-primary border-b pb-1.5">Previous Service Reviews</h3>
            <div className="rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Rating</TableHead>
                    <TableHead className="text-xs">Reason</TableHead>
                    <TableHead className="text-xs">Comment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(reviewsData) && reviewsData.length > 0 ? (
                    reviewsData.map((review) => (
                      <TableRow key={review.complaint_id}>
                        <TableCell className="text-xs">{review.rating}/10</TableCell>
                        <TableCell className="capitalize text-xs">{review.reason?.replace("-", " ") || "N/A"}</TableCell>
                        <TableCell className="text-xs">{review.comment || "No comment"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-xs">Not Added</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Attached Files - Only visible on screen */}
          <div className="border rounded p-3 print:hidden">
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-primary border-b pb-1.5">
              <ImageIcon className="h-4 w-4" />
              Documentation & Images
            </h3>
            {files.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {files.map((file: any, index: number) => {
                  const isImage = file.document_path.match(/\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i);
                  return (
                    <Card key={index} className="overflow-hidden border bg-white">
                      {isImage ? (
                        <a href={getImageUrl(file.document_path)} target="_blank" rel="noopener noreferrer" className="block">
                          <div className="relative aspect-video">
                            <Image
                              src={getImageUrl(file.document_path)}
                              alt={file.document_type}
                              fill
                              className="object-cover transition-transform hover:scale-105"
                            />
                          </div>
                          <div className="p-1.5">
                            <p className="truncate text-xs font-medium">{file.file_name}</p>
                            <p className="text-xs text-gray-500">{(file.file_size / 1024).toFixed(2)} KB</p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center gap-1.5 p-1.5">
                          <FileText className="h-3 w-3 text-gray-400" />
                          <div>
                            <p className="truncate text-xs font-medium">{file.file_name}</p>
                            <p className="text-xs text-gray-500">{(file.file_size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-center text-gray-500">Not Added</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
