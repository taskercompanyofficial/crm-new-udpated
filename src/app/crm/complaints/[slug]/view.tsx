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
  Calendar,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  FileVideo,
  MessageSquare,
  Pencil,
} from "lucide-react";
import { useSession } from "next-auth/react";
import useFetch from "@/hooks/usefetch";
import { ComplaintStatusOptions } from "@/lib/otpions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  const {
    data: csoRemarksData,
    error: csoRemarksError,
    isLoading: csoRemarksLoading
  } = useFetch<CsoRemark>(
    `https://api.taskercompany.com/api/crm/cso-remarks/${complaint?.id}`,
    token,
  );

  const statusOption =
    ComplaintStatusOptions.find((option) => option.value === complaint.status) ||
    ComplaintStatusOptions[0];

  const handlePrint = () => {
    window.print();
  };

  // Group files by document type
  const groupedFiles = files.reduce((acc: any, file: any) => {
    if (!acc[file.document_type]) {
      acc[file.document_type] = [];
    }
    acc[file.document_type].push(file);
    return acc;
  }, {});

  // Format dates
  const purchaseDate = complaint.p_date ? formatDate(complaint.p_date) : "Not specified";
  const completionDate = complaint.complete_date ? formatDate(complaint.complete_date) : "Pending";
  const creationDate = formatDate(complaint.created_at);

  return (
    <div className="mx-auto max-w-7xl p-4 print:p-0 overflow-x-hidden overflow-y-auto">
      <div className="flex justify-between items-center mb-4 sticky top-0 z-50 bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-primary print:text-black">Service Job Sheet</h1>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex items-center gap-2 print:hidden"
          >
            <Link href={`/crm/complaints/${complaint.complain_num}/edit`}>
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex items-center gap-2 print:hidden"
          >
            <Link href={`/crm/complaints/${complaint.room_id}/chat`}>
              <MessageSquare className="h-4 w-4" />
              Chat
            </Link>
          </Button>
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 print:hidden"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Header Card */}
      <Card className="mb-4 p-6 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">#{complaint.complain_num}</h2>
              <Badge className={`px-2 py-0.5 text-xs`}
                style={{ backgroundColor: `rgb(${statusOption.color})` }}>
                {statusOption.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Priority: <span className="capitalize ml-1">{complaint.priority}</span>
              </Badge>
            </div>
            <p className="text-sm mt-1">Brand: <span className="font-medium">{complaint.brand?.name || "N/A"}</span></p>
            <p className="text-sm mt-1">Branch: <span className="font-medium">{complaint.branch?.name || "N/A"}</span></p>
          </div>
          <div className="text-sm space-y-1">
            <p className="flex items-center gap-2">
              <span className="text-gray-500">Brand Reference:</span>
              <span className="font-medium">{complaint.brand_complaint_no || "N/A"}</span>
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-gray-500">Created:</span>
              <span>{creationDate}</span>
            </p>
            <p className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-gray-500">Created By:</span>
              <span>{complaint.user?.username || "N/A"}</span>
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Customer Details Card */}
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-primary mb-4 border-b pb-2">
            <User className="h-4 w-4" />
            Customer Details
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-xs text-gray-600">Name</span>
              <span className="text-sm font-medium">{complaint.applicant_name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-600">Contact</span>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-sm">{complaint.applicant_phone}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded">WhatsApp</span>
                <span className="text-sm">{complaint.applicant_whatsapp}</span>
              </div>
              {complaint.extra_numbers && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-gray-50 text-gray-700 px-1.5 py-0.5 rounded">Alternative</span>
                  <span className="text-sm">{complaint.extra_numbers}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-600">Address</span>
              <div className="flex gap-2 mt-1">
                <MapPin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{complaint.applicant_adress}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-600">Reference By</span>
              <span className="text-sm">{complaint.reference_by || "N/A"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-600">Dealer</span>
              <span className="text-sm">{complaint.dealer || "N/A"}</span>
            </div>
          </div>
        </Card>

        {/* Product Details Card */}
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-primary mb-4 border-b pb-2">
            <Package className="h-4 w-4" />
            Product Details
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Product Type</span>
                <span className="text-sm font-medium">{complaint.product}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Model</span>
                <span className="text-sm font-medium">{complaint.model}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-gray-600">Serial Numbers</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Indoor</span>
                  <span className="text-sm block mt-1">{complaint.serial_number_ind || "N/A"}</span>
                </div>
                <div>
                  <span className="text-xs bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded">Outdoor</span>
                  <span className="text-sm block mt-1">{complaint.serial_number_oud || "N/A"}</span>
                </div>
                <div>
                  <span className="text-xs bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded">MQ Number</span>
                  <span className="text-sm block mt-1">{complaint.mq_nmb || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Purchase Date</span>
                <span className="text-sm">{purchaseDate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Complaint Type</span>
                <span className="text-sm capitalize">{complaint.complaint_type?.replace(/-/g, " ") || "N/A"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Assigned Technician</span>
                <span className="text-sm">{complaint.technician?.full_name || "Unassigned"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Warranty Type</span>
                <span className="text-sm">{complaint.warranty_type || "Not specified"}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Service Details Card */}
      <Card className="p-6 bg-white shadow-sm mb-4">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-primary mb-4 border-b pb-2">
          <FileText className="h-4 w-4" />
          Service Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Issue Description</h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm">{complaint.description || "Not provided"}</p>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Working Details & Resolution</h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm whitespace-pre-line">{complaint.working_details || "Not provided"}</p>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Services Provided</h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm">{complaint.provided_services || "Not specified"}</p>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Status Information</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <span className="text-xs text-gray-600">Completion Date</span>
                <span className="text-sm flex items-center gap-1">
                  {complaint.status === "closed" ?
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" /> :
                    <Clock className="h-3.5 w-3.5 text-orange-500" />
                  }
                  {completionDate}
                </span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <span className="text-xs text-gray-600">Happy Call Status</span>
                <Badge variant={complaint.call_status === "pending" ? "outline" : "default"} className="text-xs">
                  {(complaint.call_status || "pending").toUpperCase()}
                </Badge>
              </div>
              {complaint.amount && (
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                  <span className="text-xs text-gray-600">Service Amount</span>
                  <span className="text-sm font-medium">{complaint.amount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Reviews and Remarks Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 print:hidden">
        {/* Customer Reviews Card */}
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-primary mb-4 border-b pb-2">
            <AlertCircle className="h-4 w-4" />
            Customer Reviews
          </h3>
          {isLoading ? (
            <div className="text-center p-4">
              <p className="text-sm text-gray-500">Loading reviews...</p>
            </div>
          ) : Array.isArray(reviewsData) && reviewsData.length > 0 ? (
            <div className="space-y-4">
              {reviewsData.map((review) => (
                <div key={review.complaint_id} className="bg-gray-50 rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Rating: {review.rating}/10</span>
                    <Badge variant="outline" className="capitalize">{review.reason?.replace(/-/g, " ") || "N/A"}</Badge>
                  </div>
                  <p className="text-sm text-gray-700">{review.comment || "No comment provided"}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">No reviews available</p>
            </div>
          )}
          {error && (
            <div className="text-center p-4 bg-red-50 rounded-md">
              <p className="text-sm text-red-500">Failed to load reviews</p>
            </div>
          )}
        </Card>

        {/* CSO Remarks Card */}
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-primary mb-4 border-b pb-2">
            <FileText className="h-4 w-4" />
            CSO Remarks
          </h3>
          {csoRemarksLoading ? (
            <div className="text-center p-4">
              <p className="text-sm text-gray-500">Loading remarks...</p>
            </div>
          ) : Array.isArray(csoRemarksData) && csoRemarksData.length > 0 ? (
            <div className="space-y-3">
              {csoRemarksData.map((remark) => (
                <div key={remark.id} className="bg-gray-50 rounded-md p-3">
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    {remark.user.name}
                  </p>
                  <p className="text-sm">{remark.remarks}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">No remarks available</p>
            </div>
          )}
          {csoRemarksError && (
            <div className="text-center p-4 bg-red-50 rounded-md">
              <p className="text-sm text-red-500">Failed to load remarks</p>
            </div>
          )}
        </Card>
      </div>

      {/* Documentation and Images */}
      <Card className="p-6 bg-white shadow-sm print:hidden">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-primary mb-4 border-b pb-2">
          <ImageIcon className="h-4 w-4" />
          Documentation & Images
        </h3>

        {files.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedFiles).map(([docType, docFiles]: [string, any]) => (
              <div key={docType} className="space-y-2">
                <h4 className="text-xs font-medium uppercase text-gray-600 flex items-center gap-1 mb-2">
                  {docType === "warranty-card" && <FileText className="h-3.5 w-3.5" />}
                  {docType === "defective-part" && <AlertCircle className="h-3.5 w-3.5" />}
                  {docType === "indoor" && <Package className="h-3.5 w-3.5" />}
                  {docType === "outdoor" && <Package className="h-3.5 w-3.5" />}
                  {docType === "ind-sr" && <FileText className="h-3.5 w-3.5" />}
                  {docType === "out-sr" && <FileText className="h-3.5 w-3.5" />}
                  {docType.replace(/-/g, " ")}
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {docFiles.map((file: any, index: number) => {
                    const isImage = file.document_path.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
                    const isVideo = file.document_path.match(/\.(mp4|webm|mov)$/i);

                    return (
                      <Card key={index} className="overflow-hidden border border-gray-100 bg-white hover:shadow-md transition-shadow">
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
                              <p className="truncate text-xs">{file.file_name.split('_')[0]}</p>
                              <p className="text-xs text-gray-500">{(file.file_size / 1024).toFixed(1)} KB</p>
                            </div>
                          </a>
                        ) : isVideo ? (
                          <a href={getImageUrl(file.document_path)} target="_blank" rel="noopener noreferrer" className="block">
                            <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
                              <FileVideo className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="p-2">
                              <p className="truncate text-xs flex items-center gap-1">
                                <span className="bg-blue-50 text-blue-600 text-xs px-1 rounded">VIDEO</span>
                                {file.file_name.split('_')[0]}
                              </p>
                              <p className="text-xs text-gray-500">{(file.file_size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                          </a>
                        ) : (
                          <a href={getImageUrl(file.document_path)} target="_blank" rel="noopener noreferrer" className="block p-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-6 w-6 text-gray-400" />
                              <div>
                                <p className="truncate text-xs">{file.file_name.split('_')[0]}</p>
                                <p className="text-xs text-gray-500">{(file.file_size / 1024).toFixed(1)} KB</p>
                              </div>
                            </div>
                          </a>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No documentation or images attached to this complaint</p>
          </div>
        )}
      </Card>
    </div>
  );
}