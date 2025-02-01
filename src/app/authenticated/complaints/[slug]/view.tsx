"use client"
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, getImageUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
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
  Images
} from "lucide-react";

export default function ViewComplaint({ complaint }: { complaint: any }) {
  const files = complaint.files ? JSON.parse(complaint.files) : [];

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([{
      'Complaint Number': complaint.complain_num,
      'Status': complaint.status,
      'Type': complaint.complaint_type,
      'Customer Name': complaint.applicant_name,
      'Email': complaint.applicant_email,
      'Phone': complaint.applicant_phone,
      'WhatsApp': complaint.applicant_whatsapp,
      'Address': complaint.applicant_adress,
      'Product': complaint.product,
      'Model': complaint.model,
      'Serial Number (IND)': complaint.serial_number_ind,
      'Serial Number (OUD)': complaint.serial_number_oud,
      'Technician': complaint.technician,
      'Amount': complaint.amount,
      'Created Date': formatDate(complaint.created_at),
      'Description': complaint.description,
      'Provided Services': complaint.provided_services
    }]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Complaint Details");
    XLSX.writeFile(workbook, `Complaint-${complaint.complain_num}.xlsx`);
  };

  const printJobSheet = () => {
    window.print();
  };

  const downloadAllImages = async () => {
    const imageFiles = files.filter((file: any) => 
      file.document_path.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    );

    for (const file of imageFiles) {
      const link = document.createElement('a');
      link.href = getImageUrl(file.document_path);
      link.download = file.file_name || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Add small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 bg-gradient-to-b from-background to-muted/20">
      <Card className="p-8 shadow-2xl backdrop-blur-sm bg-background/95 rounded-xl border-2">
        {/* Header Section with Export Options */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h2 className="text-4xl font-extrabold text-primary bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Complaint #{complaint.complain_num}
              </h2>
              <Badge className="text-lg px-4 py-1 rounded-full" variant="secondary">{complaint.status}</Badge>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={downloadAllImages}
                className="flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Images className="h-4 w-4" />
                Download Images
              </Button>
              <Button
                variant="outline"
                onClick={exportToExcel}
                className="flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
              <Button
                variant="outline"
                onClick={printJobSheet}
                className="flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Printer className="h-4 w-4" />
                Print Job Sheet
              </Button>
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <Badge variant="outline" className="text-lg px-4 py-1 rounded-full">
              {complaint.complaint_type}
            </Badge>
            <p className="text-sm text-muted-foreground font-medium">Reference ID: {complaint.id}</p>
          </div>
        </div>

        <Separator className="my-10" />

        {/* Main Content with Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Customer Information */}
          <Card className="p-8 hover:shadow-2xl transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-xl border-2">
            <h3 className="text-2xl font-bold mb-8 text-primary">Customer Information</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-4 hover:bg-muted/50 p-4 rounded-xl transition-all duration-300 group">
                <User className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-muted-foreground">Name</p>
                  <p className="text-lg font-medium">{complaint.applicant_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 hover:bg-muted/50 p-4 rounded-xl transition-all duration-300 group">
                <Mail className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-muted-foreground">Email</p>
                  <p className="text-lg font-medium break-all">{complaint.applicant_email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 hover:bg-muted/50 p-4 rounded-xl transition-all duration-300 group">
                <Phone className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-muted-foreground">Contact Details</p>
                  <p className="text-lg font-medium">Phone: {complaint.applicant_phone}</p>
                  <p className="text-lg font-medium">WhatsApp: {complaint.applicant_whatsapp}</p>
                  {complaint.extra_numbers && (
                    <p className="text-lg font-medium">Additional: {complaint.extra_numbers}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 hover:bg-muted/50 p-4 rounded-xl transition-all duration-300 group">
                <MapPin className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-muted-foreground">Address</p>
                  <p className="text-lg font-medium">{complaint.applicant_adress}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Product Information */}
          <Card className="p-8 hover:shadow-2xl transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-xl border-2">
            <h3 className="text-2xl font-bold mb-8 text-primary">Product Details</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-4 hover:bg-muted/50 p-4 rounded-xl transition-all duration-300 group">
                <Package className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-muted-foreground">Product Information</p>
                  <p className="text-lg font-bold">
                    {complaint.product} {complaint.model && `- ${complaint.model}`}
                  </p>
                  {complaint.serial_number_ind && (
                    <p className="text-base mt-2 font-medium">Serial (IND): {complaint.serial_number_ind}</p>
                  )}
                  {complaint.serial_number_oud && (
                    <p className="text-base mt-2 font-medium">Serial (OUD): {complaint.serial_number_oud}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 hover:bg-muted/50 p-4 rounded-xl transition-all duration-300 group">
                <Wrench className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-muted-foreground">Service Details</p>
                  <p className="text-lg font-medium">Technician: {complaint.technician || "Not Assigned"}</p>
                  <p className="text-lg font-medium">Amount: {complaint.amount || "Not Set"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="p-8 hover:shadow-2xl transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-xl border-2">
            <h3 className="text-2xl font-bold mb-8 text-primary">Additional Details</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-4 hover:bg-muted/50 p-4 rounded-xl transition-all duration-300 group">
                <Calendar className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-muted-foreground">Important Dates</p>
                  <p className="text-base font-medium">Created: {formatDate(complaint.created_at)}</p>
                  {complaint.p_date && (
                    <p className="text-base font-medium">Purchase: {formatDate(complaint.p_date)}</p>
                  )}
                  {complaint.complete_date && (
                    <p className="text-base font-medium">Completed: {formatDate(complaint.complete_date)}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 hover:bg-muted/50 p-4 rounded-xl transition-all duration-300 group">
                <MessageSquare className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-muted-foreground">Description</p>
                  <p className="text-lg font-medium whitespace-pre-wrap">{complaint.description}</p>
                </div>
              </div>

              {complaint.provided_services && (
                <div className="flex items-start gap-4 hover:bg-muted/50 p-4 rounded-xl transition-all duration-300 group">
                  <FileCheck className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-muted-foreground">Services Provided</p>
                    <p className="text-lg font-medium whitespace-pre-wrap">{complaint.provided_services}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Files Section with Improved Gallery */}
        {files.length > 0 && (
          <>
            <Separator className="my-10" />
            <div>
              <h3 className="text-2xl font-bold mb-8 text-primary">Attached Files</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {files.map((file: any, index: number) => {
                  const isImage = file.document_path.match(/\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i);
                  return (
                    <Card
                      key={index}
                      className="overflow-hidden hover:shadow-2xl transition-all duration-500 group rounded-xl border-2"
                    >
                      {isImage ? (
                        <a href={getImageUrl(file.document_path)} target="_blank" rel="noopener noreferrer">
                          <div className="relative aspect-video group-hover:scale-105 transition-transform duration-500">
                            <Image
                              src={getImageUrl(file.document_path)}
                              alt={file.document_type}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                              <p className="text-white text-base font-semibold">{file.document_type}</p>
                            </div>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 p-6 group-hover:bg-muted/50 transition-all duration-300">
                          <FileText className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground">
                              {file.document_type}
                            </p>
                            <p className="font-medium truncate max-w-[200px]">{file.file_name}</p>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
