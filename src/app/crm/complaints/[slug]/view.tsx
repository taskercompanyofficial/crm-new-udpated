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
interface CsoRemark {
  id: number;
  remarks: string;
  complaint_id: number;
  user: {
    name: string;
  };
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

  const { data: csoRemarksData, error: csoRemarksError, isLoading: csoRemarksLoading } = useFetch<CsoRemark>(
    `https://api.taskercompany.com/api/crm/cso-remarks/${complaint?.id}`,
    token,
  );
  const statusOption =
    ComplaintStatusOptions.find((option) => option.value === complaint.status) ||
    ComplaintStatusOptions[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-7xl p-4 print:p-0">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Header Card - Spans full width */}
        <Card className="col-span-full p-6 bg-white">
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
              <p className="text-xs text-gray-500">Brand Complaint No: {complaint.brand_complaint_no}</p>
              <p className="text-xs text-gray-500">Created By: {complaint.user?.username || "N/A"}</p>
              <p className="text-xs text-gray-500">Date: {formatDate(complaint.created_at)}</p>
            </div>
          </div>
        </Card>

        {/* Customer Details Card */}
        <Card className="p-6 bg-white">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-primary mb-4">
            <User className="h-4 w-4" />
            Customer Details
          </h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-xs text-gray-600">Name:</span>
              <span className="text-xs font-medium">{complaint.applicant_name}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-xs text-gray-600">Phone:</span>
              <span className="text-xs font-medium">{complaint.applicant_phone}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-xs text-gray-600">WhatsApp:</span>
              <span className="text-xs font-medium">{complaint.applicant_whatsapp}</span>
            </div>
            <div className="col-span-2 mt-2">
              <span className="text-xs text-gray-600 block">Address:</span>
              <span className="text-xs mt-1">{complaint.applicant_adress}</span>
            </div>
          </div>
        </Card>

        {/* Product Details Card */}
        <Card className="p-6 bg-white">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-primary mb-4">
            <Package className="h-4 w-4" />
            Product Details
          </h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-xs text-gray-600">Product:</span>
              <span className="text-xs font-medium">{complaint.product} {complaint.model}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-xs text-gray-600">Brand:</span>
              <span className="text-xs font-medium">{complaint.brand?.name || "N/A"}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-xs text-gray-600">Type:</span>
              <span className="text-xs font-medium capitalize">{complaint.complaint_type?.replace("-", " ") || "N/A"}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-xs text-gray-600">Technician:</span>
              <span className="text-xs font-medium">{complaint.technician || "N/A"}</span>
            </div>
          </div>
        </Card>

        {/* Service Details Card */}
        <Card className="p-6 bg-white">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-primary mb-4">
            <FileText className="h-4 w-4" />
            Service Details
          </h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-medium mb-1">Issue Description:</h4>
              <p className="bg-gray-50 p-2 rounded text-xs">{complaint.description || "Not Added"}</p>
            </div>
            <div>
              <h4 className="text-xs font-medium mb-1">Working Details:</h4>
              <p className="bg-gray-50 p-2 rounded text-xs">{complaint.working_details || "Not Added"}</p>
            </div>
          </div>
        </Card>

        {/* Reviews Card */}
        <Card className="p-6 bg-white print:hidden">
          <h3 className="text-sm font-semibold text-primary mb-4">Service Reviews</h3>
          <div className="overflow-x-auto">
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
        </Card>

        {/* CSO Remarks Card */}
        <Card className="p-6 bg-white print:hidden">
          <h3 className="text-sm font-semibold text-primary mb-4">CSO Remarks</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Staff</TableHead>
                  <TableHead className="text-xs">Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(csoRemarksData) && csoRemarksData.length > 0 ? (
                  csoRemarksData.map((remark) => (
                    <TableRow key={remark.complaint_id}>
                      <TableCell className="text-xs">{remark.user.name}</TableCell>
                      <TableCell className="capitalize text-xs">{remark.remarks || "N/A"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-xs">Not Added</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Documentation Card */}
        <Card className="col-span-full p-6 bg-white print:hidden">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-primary mb-4">
            <ImageIcon className="h-4 w-4" />
            Documentation & Images
          </h3>
          {files.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map((file: any, index: number) => {
                const isImage = file.document_path.match(/\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i);
                return (
                  <Card key={index} className="overflow-hidden border bg-white hover:shadow-md transition-shadow">
                    {isImage ? (
                      <a href={getImageUrl(file.document_path)} target="_blank" rel="noopener noreferrer" className="block">
                        <div className="relative aspect-square">
                          <Image
                            src={getImageUrl(file.document_path)}
                            alt={file.document_type}
                            fill
                            className="object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <div className="p-2">
                          <p className="truncate text-xs font-medium">{file.file_name}</p>
                          <p className="text-xs text-gray-500">{(file.file_size / 1024).toFixed(2)} KB</p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 p-2">
                        <FileText className="h-4 w-4 text-gray-400" />
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
            <p className="text-xs text-center text-gray-500">No files attached</p>
          )}
        </Card>
      </div>
    </div>
  );
}
