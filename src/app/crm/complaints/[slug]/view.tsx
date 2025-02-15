"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, getImageUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  User,
  FileText,
  Package,
  Wrench,
  FileCheck,
  Download,
  Printer,
  Images,
  Building,
  Tag,
  Clock,
  ImageIcon,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    `https://api.taskercompany.com/api/crm/customer-reviews/store/${complaint.id}`,
    token,
  );
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([
      {
        "Complaint Number": complaint.complain_num,
        "Brand Complaint No": complaint.brand_complaint_no || "N/A",
        Status: complaint.status,
        Type: complaint.complaint_type,
        Branch: complaint.branch?.name || "N/A",
        "Customer Name": complaint.applicant_name,
        Email: complaint.applicant_email || "N/A",
        Phone: complaint.applicant_phone,
        WhatsApp: complaint.applicant_whatsapp,
        "Additional Numbers": complaint.extra_numbers || "N/A",
        "Reference By": complaint.reference_by || "N/A",
        Address: complaint.applicant_adress,
        Product: complaint.product,
        Model: complaint.model || "N/A",
        "Serial Number (IND)": complaint.serial_number_ind || "N/A",
        "Serial Number (OUD)": complaint.serial_number_oud || "N/A",
        "MQ Number": complaint.mq_nmb || "N/A",
        "Purchase Date": complaint.p_date
          ? formatDate(complaint.p_date)
          : "N/A",
        "Completion Date": complaint.complete_date
          ? formatDate(complaint.complete_date)
          : "N/A",
        Technician: complaint.technician || "Not Assigned",
        Helper: complaint.helper || "N/A",
        Driver: complaint.driver || "N/A",
        Amount: complaint.amount || "Not Set",
        "Product Type": complaint.product_type || "N/A",
        "Warranty Type": complaint.warranty_type || "N/A",
        "Working Details": complaint.working_details || "N/A",
        "Happy Call Remarks": complaint.happy_call_remarks || "N/A",
        "Created Date": formatDate(complaint.created_at),
        Description: complaint.description,
        "Provided Services": complaint.provided_services || "N/A",
      },
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Complaint Details");
    XLSX.writeFile(workbook, `Complaint-${complaint.complain_num}.xlsx`);
  };

  const printJobSheet = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    // Get current date in a readable format
    const currentDate = new Date().toLocaleDateString();

    // Create the print content with proper escaping for text content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Job Sheet - ${complaint.complain_num}</title>
          <style>
            body { 
              font-family: Arial, sans-serif;
              padding: 20px;
              line-height: 1.6;
            }
            .header { 
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 30px;
              margin-bottom: 30px;
            }
            .section {
              margin-bottom: 25px;
            }
            .section h3 {
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            .label {
              font-weight: bold;
              display: inline-block;
              width: 120px;
            }
            .signature-section {
              margin-top: 50px;
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 50px;
            }
            .signature-box {
              text-align: center;
            }
            .signature-line {
              border-top: 1px solid #000;
              margin-top: 60px;
              padding-top: 10px;
            }
            @media print {
              @page {
                margin: 20mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin:0;padding:0;">Job Sheet</h1>
            <p style="margin:5px 0;">Complaint #${complaint.complain_num}</p>
            <p style="margin:5px 0;">Date: ${currentDate}</p>
          </div>

          <div class="grid">
            <div class="section">
              <h3>Customer Details</h3>
              <p><span class="label">Name:</span> ${complaint.applicant_name || "N/A"}</p>
              <p><span class="label">Phone:</span> ${complaint.applicant_phone || "N/A"}</p>
              <p><span class="label">WhatsApp:</span> ${complaint.applicant_whatsapp || "N/A"}</p>
              <p><span class="label">Address:</span> ${complaint.applicant_adress || "N/A"}</p>
            </div>

            <div class="section">
              <h3>Product Details</h3>
              <p><span class="label">Product:</span> ${complaint.product || "N/A"}</p>
              <p><span class="label">Model:</span> ${complaint.model || "N/A"}</p>
              <p><span class="label">Serial No (IND):</span> ${complaint.serial_number_ind || "N/A"}</p>
              <p><span class="label">Serial No (OUD):</span> ${complaint.serial_number_oud || "N/A"}</p>
            </div>
          </div>

          <div class="section">
            <h3>Service Details</h3>
            <p><span class="label">Description:</span> ${complaint.description || "N/A"}</p>
            <p><span class="label">Technician:</span> ${complaint.technician || "Not Assigned"}</p>
            <p><span class="label">Helper:</span> ${complaint.helper || "N/A"}</p>
            <p><span class="label">Driver:</span> ${complaint.driver || "N/A"}</p>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line">Customer Signature</div>
            </div>
            <div class="signature-box">
              <div class="signature-line">Technician Signature</div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Write content to the new window
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print();
      // Close the window after print dialog is closed
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  const downloadAllImages = async () => {
    const imageFiles = files.filter((file: any) =>
      file.document_path.match(/\.(jpg|jpeg|png|gif|webp)$/i),
    );

    for (const file of imageFiles) {
      const link = document.createElement("a");
      link.href = getImageUrl(file.document_path);
      link.download = file.file_name || "image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4">
      <Card className="rounded-lg border bg-white p-4 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Complaint No:</span>
              <h2 className="text-lg font-semibold">
                #{complaint.complain_num}
              </h2>
            </div>
            <Badge
              className={`px-3 py-1 text-sm font-medium ${getStatusColor(complaint.status)}`}
            >
              {complaint.status}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  <span>Export</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportToExcel}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Export Excel</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadAllImages}>
                  <Images className="mr-2 h-4 w-4" />
                  <span>Download Images</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={printJobSheet}>
                  <Printer className="mr-2 h-4 w-4" />
                  <span>Print Job Sheet</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Customer Info */}
          <div className="p-4">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-primary">
              <User className="h-4 w-4" />
              Customer Information
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{complaint.applicant_name}</span>
              </div>
              {complaint.applicant_email && (
                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                  <span className="text-gray-500">Email:</span>
                  <span className="break-all font-medium">
                    {complaint.applicant_email}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                <span className="text-gray-500">Phone:</span>
                <div>
                  <div className="font-medium">{complaint.applicant_phone}</div>
                  <div className="font-medium">
                    {complaint.applicant_whatsapp}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                <span className="text-gray-500">Address:</span>
                <span className="font-medium">
                  {complaint.applicant_adress}
                </span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-primary">
              <Package className="h-4 w-4" />
              Product Details
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                <span className="text-gray-500">Product:</span>
                <span className="font-medium">
                  {complaint.product} {complaint.model}
                </span>
              </div>
              {complaint.serial_number_ind && (
                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                  <span className="text-gray-500">SN (IND):</span>
                  <span className="font-medium">
                    {complaint.serial_number_ind}
                  </span>
                </div>
              )}
              {complaint.serial_number_oud && (
                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                  <span className="text-gray-500">SN (OUD):</span>
                  <span className="font-medium">
                    {complaint.serial_number_oud}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                <span className="text-gray-500">Technician:</span>
                <span className="font-medium">
                  {complaint.technician || "N/A"}
                </span>
              </div>
              {complaint.helper && (
                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                  <span className="text-gray-500">Helper:</span>
                  <span className="font-medium">{complaint.helper}</span>
                </div>
              )}
              <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">{complaint.amount || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-4">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-primary">
              <FileText className="h-4 w-4" />
              Additional Details
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                <span className="text-gray-500">Created:</span>
                <span className="font-medium">
                  {formatDate(complaint.created_at)}
                </span>
              </div>
              {complaint.p_date && (
                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                  <span className="text-gray-500">Purchase:</span>
                  <span className="font-medium">
                    {formatDate(complaint.p_date)}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                <span className="text-gray-500">Description:</span>
                <span className="whitespace-pre-wrap font-medium">
                  {complaint.description}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
          <span className="text-gray-500">Description:</span>
          <span className="whitespace-pre-wrap font-medium">
            {complaint.description}
          </span>
        </div>
        {reviewsData && (
                  <div className="mt-4">
                    <h3 className="mb-2 text-lg font-semibold">
                      Previous Reviews
                    </h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rating</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Comment</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.isArray(reviewsData) ? (
                            reviewsData.map((review) => (
                              <TableRow key={review.complaint_id}>
                                <TableCell>{review.rating}/10</TableCell>
                                <TableCell className="capitalize">
                                  {review.reason?.replace("-", " ") || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {review.comment || "No comment"}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center">
                                No previous reviews found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
        {/* Files Grid */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-primary">
              <ImageIcon className="h-4 w-4" />
              Attached Files
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {files.map((file: any, index: number) => {
                const isImage = file.document_path.match(
                  /\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i,
                );
                return (
                  <Card key={index} className="overflow-hidden border bg-white">
                    {isImage ? (
                      <a
                        href={getImageUrl(file.document_path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="relative aspect-video">
                          <Image
                            src={getImageUrl(file.document_path)}
                            alt={file.document_type}
                            fill
                            className="object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <div className="p-3">
                          <p className="mb-1 truncate font-medium">
                            {file.file_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(file.file_size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 p-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="truncate font-medium">
                            {file.file_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(file.file_size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
