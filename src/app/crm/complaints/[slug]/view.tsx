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
  Star,
  Wrench,
  CreditCard,
  Users,
  Building,
  Award,
  Info,
  ExternalLink,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 print:bg-white">
      <div className="mx-auto max-w-7xl p-6 print:p-0 space-y-6">
        
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl print:shadow-none sticky top-4 z-50 print:static print:bg-white print:border-gray-200">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent print:text-black">
                      Service Job Sheet
                    </h1>
                    <p className="text-sm text-gray-500">Complaint #{complaint.complain_num}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 print:hidden">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-all duration-200"
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
                  className="flex items-center gap-2 hover:bg-green-50 border-green-200 hover:border-green-300 transition-all duration-200"
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
                  className="flex items-center gap-2 hover:bg-purple-50 border-purple-200 hover:border-purple-300 transition-all duration-200"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Overview Card */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-2xl print:shadow-none rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white print:bg-gray-100 print:text-black">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">#{complaint.complain_num}</h2>
                  <Badge 
                    className="px-3 py-1 text-sm font-medium shadow-lg"
                    style={{ backgroundColor: `rgb(${statusOption.color})`, color: 'white' }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {statusOption.label}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {complaint.priority} Priority
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 opacity-80" />
                    <span className="opacity-90">Brand:</span>
                    <span className="font-semibold">{complaint.brand?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 opacity-80" />
                    <span className="opacity-90">Branch:</span>
                    <span className="font-semibold">{complaint.branch?.name || "N/A"}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-2 print:bg-gray-50 print:text-black">
                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4 opacity-70" />
                  <span className="opacity-90">Brand Ref:</span>
                  <span className="font-medium">{complaint.brand_complaint_no || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 opacity-70" />
                  <span className="opacity-90">Created:</span>
                  <span className="font-medium">{creationDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 opacity-70" />
                  <span className="opacity-90">By:</span>
                  <span className="font-medium">{complaint.user?.username || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Customer Details - Enhanced */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <User className="h-5 w-5" />
                Customer Details
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Customer Name</span>
                <p className="text-lg font-semibold text-gray-900">{complaint.applicant_name}</p>
              </div>
              
              <div className="space-y-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact Information</span>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{complaint.applicant_phone}</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">WhatsApp</span>
                    <span className="text-sm">{complaint.applicant_whatsapp}</span>
                  </div>
                  {complaint.extra_numbers && (
                    <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                      <Phone className="h-4 w-4 text-orange-600" />
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">Alt</span>
                      <span className="text-sm">{complaint.extra_numbers}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</span>
                <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{complaint.applicant_adress}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 pt-2">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reference</span>
                  <p className="text-sm bg-blue-50 text-blue-800 p-2 rounded-lg">{complaint.reference_by || "Direct Customer"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dealer</span>
                  <p className="text-sm bg-purple-50 text-purple-800 p-2 rounded-lg">{complaint.dealer || "N/A"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Product Details - Enhanced */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 text-white">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Package className="h-5 w-5" />
                Product Details
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Product</span>
                  <p className="text-sm font-semibold bg-blue-50 text-blue-800 p-2 rounded-lg">{complaint.product}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Model</span>
                  <p className="text-sm font-semibold bg-indigo-50 text-indigo-800 p-2 rounded-lg">{complaint.model}</p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Serial Numbers</span>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                    <span className="text-xs font-medium text-blue-700">Indoor Unit</span>
                    <span className="text-sm font-mono">{complaint.serial_number_ind || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                    <span className="text-xs font-medium text-orange-700">Outdoor Unit</span>
                    <span className="text-sm font-mono">{complaint.serial_number_oud || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                    <span className="text-xs font-medium text-purple-700">MQ Number</span>
                    <span className="text-sm font-mono">{complaint.mq_nmb || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Purchase Date</span>
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{purchaseDate}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Complaint Type</span>
                  <p className="text-sm bg-red-50 text-red-800 p-2 rounded-lg capitalize">
                    {complaint.complaint_type?.replace(/-/g, " ") || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-teal-600" />
                    <span className="text-xs font-medium text-gray-600">Technician</span>
                  </div>
                  <span className="text-sm font-medium">{complaint.technician?.full_name || "Unassigned"}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="text-xs font-medium text-gray-600">Warranty</span>
                  </div>
                  <span className="text-sm font-medium">{complaint.warranty_type || "Not specified"}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Service Status - Enhanced */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 text-white">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Wrench className="h-5 w-5" />
                Service Status
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                <div className="flex items-center justify-center mb-2">
                  {complaint.status === "closed" ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : (
                    <Clock className="h-8 w-8 text-orange-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">Completion Status</p>
                <p className="font-semibold text-lg">{completionDate}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">Happy Call</span>
                  <Badge 
                    variant={complaint.call_status === "pending" ? "outline" : "default"} 
                    className={complaint.call_status === "pending" ? "border-orange-300 text-orange-700" : "bg-green-100 text-green-800"}
                  >
                    {(complaint.call_status || "pending").toUpperCase()}
                  </Badge>
                </div>
                
                {complaint.amount && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Service Amount</span>
                    </div>
                    <span className="text-lg font-bold text-green-700">{complaint.amount}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Service Summary</span>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Services Provided</p>
                    <p className="text-sm">{complaint.provided_services || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Service Details - Full Width Enhanced */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-600 to-gray-700 p-6 text-white">
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              <FileText className="h-6 w-6" />
              Service Details & Resolution
            </h3>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  Issue Description
                </h4>
                <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border-l-4 border-red-400">
                  <p className="text-sm leading-relaxed text-gray-700">{complaint.description || "No description provided"}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Resolution & Work Done
                </h4>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-400">
                  <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                    {complaint.working_details || "Work details not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Reviews and Remarks - Enhanced */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">
          {/* Customer Reviews */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 text-white">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Star className="h-5 w-5" />
                Customer Reviews
              </h3>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-3">Loading reviews...</p>
                </div>
              ) : Array.isArray(reviewsData) && reviewsData.length > 0 ? (
                <div className="space-y-4">
                  {reviewsData.map((review) => (
                    <div key={review.complaint_id} className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < (review.rating / 2) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm font-bold text-amber-700">{review.rating}/10</span>
                        </div>
                        <Badge variant="outline" className="capitalize bg-white/50">
                          {review.reason?.replace(/-/g, " ") || "N/A"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 italic">"{review.comment || "No comment provided"}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No reviews available yet</p>
                </div>
              )}
              {error && (
                <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-red-600">Failed to load reviews</p>
                </div>
              )}
            </div>
          </Card>

          {/* CSO Remarks */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-4 text-white">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="h-5 w-5" />
                CSO Remarks
              </h3>
            </div>
            <div className="p-6">
              {csoRemarksLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-3">Loading remarks...</p>
                </div>
              ) : Array.isArray(csoRemarksData) && csoRemarksData.length > 0 ? (
                <div className="space-y-4">
                  {csoRemarksData.map((remark) => (
                    <div key={remark.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-blue-800">{remark.user.name}</span>
                      </div>
                      <p className="text-sm text-gray-700 pl-10">{remark.remarks}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No remarks available</p>
                </div>
              )}
              {csoRemarksError && (
                <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-red-600">Failed to load remarks</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Documentation and Images - Enhanced */}
        {files.length > 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden print:hidden">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6 text-white">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <ImageIcon className="h-6 w-6" />
                Documentation & Media Files
                <Badge variant="secondary" className="bg-white/20 text-white ml-2">
                  {files.length} files
                </Badge>
              </h3>
            </div>
            
            <div className="p-8">
              <div className="space-y-8">
                {Object.entries(groupedFiles).map(([docType, docFiles]: [string, any]) => (
                  <div key={docType} className="space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                      <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg">
                        {docType === "warranty-card" && <FileText className="h-5 w-5 text-white" />}
                        {docType === "defective-part" && <AlertCircle className="h-5 w-5 text-white" />}
                        {(docType === "indoor" || docType === "outdoor") && <Package className="h-5 w-5 text-white" />}
                        {(docType === "ind-sr" || docType === "out-sr") && <FileText className="h-5 w-5 text-white" />}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 capitalize">
                          {docType.replace(/-/g, " ")}
                        </h4>
                        <p className="text-sm text-gray-500">{docFiles.length} file{docFiles.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {docFiles.map((file: any, index: number) => {
                        const isImage = file.document_path.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
                        const isVideo = file.document_path.match(/\.(mp4|webm|mov)$/i);

                        return (
                          <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
                            {isImage ? (
                              <a href={getImageUrl(file.document_path)} target="_blank" rel="noopener noreferrer" className="block">
                                <div className="relative aspect-square overflow-hidden">
                                  <img
                                    src={getImageUrl(file.document_path)}
                                    alt={file.document_type}
                                    className="object-cover transition-all duration-300 group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                    <ExternalLink className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </div>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50">
                                  <p className="truncate text-xs font-medium text-gray-700">{file.file_name.split('_')[0]}</p>
                                  <p className="text-xs text-gray-500 mt-1">{(file.file_size / 1024).toFixed(1)} KB</p>
                                </div>
                              </a>
                            ) : isVideo ? (
                              <a href={getImageUrl(file.document_path)} target="_blank" rel="noopener noreferrer" className="block">
                                <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-colors duration-300">
                                  <div className="relative">
                                    <FileVideo className="h-12 w-12 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">▶</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5">
                                      VIDEO
                                    </Badge>
                                  </div>
                                  <p className="truncate text-xs font-medium text-gray-700">{file.file_name.split('_')[0]}</p>
                                  <p className="text-xs text-gray-500 mt-1">{(file.file_size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                              </a>
                            ) : (
                              <a href={getImageUrl(file.document_path)} target="_blank" rel="noopener noreferrer" className="block p-4 hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-300">
                                    <FileText className="h-8 w-8 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-700">{file.file_name.split('_')[0]}</p>
                                    <p className="text-xs text-gray-500 uppercase">{file.document_path.split('.').pop()}</p>
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
            </div>
          </Card>
        )}

        {/* No files message */}
        {files.length === 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden print:hidden">
            <div className="bg-gradient-to-r from-gray-400 to-gray-500 p-6 text-white">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <ImageIcon className="h-6 w-6" />
                Documentation & Media Files
              </h3>
            </div>
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">No Files Attached</h4>
              <p className="text-gray-500">No documentation or images have been attached to this complaint yet.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}