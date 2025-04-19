import * as React from "react";
import { type Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { exportTableToExcel } from "@/lib/export";
import { Kbd } from "@/components/ui/kbd";
import { ClipboardCopyIcon, FileImage, X, DownloadIcon, Loader, Edit } from "lucide-react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";

interface TasksTableFloatingBarProps {
  table: Table<any>;
}

export function TasksTableFloatingBar({ table }: TasksTableFloatingBarProps) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [activeMethod, setActiveMethod] = React.useState<
    "export" | "generate-image"
  >();

  // Handle keyboard navigation and selection
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        table.toggleAllRowsSelected(false);
      }

      // Handle Ctrl + Arrow keys for selection
      if (event.ctrlKey) {
        const allRows = table.getRowModel().rows;
        const currentSelectedIndex = allRows.findIndex(row => row.getIsSelected());

        if (event.key === "ArrowDown" && currentSelectedIndex < allRows.length - 1) {
          event.preventDefault();
          const nextRow = allRows[currentSelectedIndex + 1];
          table.setRowSelection({ [nextRow.id]: true });
        }

        if (event.key === "ArrowUp" && currentSelectedIndex > 0) {
          event.preventDefault();
          const prevRow = allRows[currentSelectedIndex - 1];
          table.setRowSelection({ [prevRow.id]: true });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [table]);

  // Copy on Ctrl+C and Edit on Ctrl+E
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'c' && selectedRows.length > 0) {
        copyToClipboard(selectedRows);
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'e' && selectedRows.length === 1) {
        window.open(`${window.location.pathname}/edit/${selectedRows[0].original.id}`, '_blank');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedRows]);

  // Rest of the component remains the same...
  const copyToClipboard = (rows: any[]) => {
    const formattedText = rows
      .map((row) => {
        const data = row.original;
        return `
📋 *Complaint #${data.complain_num}*
*Brand Ref:* ${data.brand_complaint_no}

👤 *Applicant Details*
*Name:* ${data.applicant_name}
*Phone:* ${data.applicant_phone}
*WhatsApp:* ${data.applicant_whatsapp || "N/A"}
*Extra Numbers:* ${data.extra_numbers || "N/A"}
*Address:* ${data.applicant_adress}

📦 *Product Details*
*Product:* ${data.product || "N/A"}
*Brand:* ${data.brand_id || "N/A"}
*Model:* ${data.model || "N/A"}
*Serial (IND):* ${data.serial_number_ind || "N/A"}
*Serial (OUD):* ${data.serial_number_oud || "N/A"}

🔧 *Service Information*
*Branch:* ${data.branch_id || "N/A"}
*Type:* ${data.complaint_type}
*Complaint:* ${data.description}

*Created:* ${new Date(data.created_at).toLocaleDateString()}
-------------------`;
      })
      .join("\n\n");

    navigator.clipboard.writeText(formattedText);
    toast.success("Details copied to clipboard");
  };

  const generateImage = async (rows: any[]) => {
    setActiveMethod("generate-image");
    startTransition(async () => {
      try {
        const container = document.createElement("div");
        container.style.cssText = `
          padding: 2rem;
          background: #f8fafc;
          width: 800px;
          position: fixed;
          left: -9999px;
          font-family: system-ui, -apple-system, sans-serif;
        `;

        rows.forEach((row) => {
          const data = row.original;
          container.innerHTML += `
            <div class="complaint-card" style="
              background: white;
              border-radius: 8px;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
              margin-bottom: 2rem;
              overflow: hidden;
            ">
              <header style="
                background: #1e40af;
                color: white;
                padding: 1rem;
                font-size: 1.25rem;
              ">
                Complaint #${data.complain_num}
                <div style="font-size: 0.875rem; margin-top: 0.25rem;">
                  Brand Ref: ${data.brand_complaint_no}
                </div>
              </header>

              <div style="padding: 1.5rem;">
                <div style="
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 1rem;
                  margin-bottom: 1.5rem;
                ">
                  <div>
                    <h3 style="color: #1e40af; font-size: 1.1rem; margin-bottom: 0.75rem;">
                      Applicant Details
                    </h3>
                    <p><strong>Name:</strong> ${data.applicant_name}</p>
                    <p><strong>Phone:</strong> ${data.applicant_phone}</p>
                    <p><strong>WhatsApp:</strong> ${data.applicant_whatsapp || "N/A"}</p>
                    <p><strong>Address:</strong> ${data.applicant_adress}</p>
                  </div>
                  
                  <div>
                    <h3 style="color: #1e40af; font-size: 1.1rem; margin-bottom: 0.75rem;">
                      Product Details
                    </h3>
                    <p><strong>Product:</strong> ${data.product || "N/A"}</p>
                    <p><strong>Brand:</strong> ${data.brand_id || "N/A"}</p>
                    <p><strong>Branch:</strong> ${data.branch_id || "N/A"}</p>
                    <p><strong>Model:</strong> ${data.model || "N/A"}</p>
                    <p><strong>Serial (IND):</strong> ${data.serial_number_ind || "N/A"}</p>
                    <p><strong>Serial (OUD):</strong> ${data.serial_number_oud || "N/A"}</p>
                  </div>
                </div>

                <div style="
                  background: #f8fafc;
                  padding: 1rem;
                  border-radius: 6px;
                ">
                  <h3 style="color: #1e40af; margin-bottom: 0.75rem;">Service Details</h3>
                  <p><strong>Technician:</strong> ${data.technition || "N/A"}</p>
                  <p><strong>Type:</strong> ${data.complaint_type}</p>
                  <p><strong>Fault:</strong> ${data.description}</p>
                  <p><strong>Created:</strong> ${new Date(data.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          `;
        });

        document.body.appendChild(container);
        const canvas = await html2canvas(container);
        const image = canvas.toDataURL("image/png", 1.0);

        const downloadLink = document.createElement("a");
        downloadLink.download = `complaint-details-${Date.now()}.png`;
        downloadLink.href = image;
        downloadLink.click();

        document.body.removeChild(container);
        toast.success("Job sheet generated successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to generate job sheet");
      }
    });
  };

  return (
    <TooltipProvider>
      <div className="fixed inset-x-0 z-50 px-4 mx-auto bottom-4 w-fit">
        <div className="border rounded-lg shadow-lg bg-card">
          <div className="flex items-center gap-2 p-2">
            <div className="flex items-center gap-1 px-2 border border-dashed rounded-md">
              <span className="text-sm font-medium">
                {selectedRows.length} selected
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6"
                    onClick={() => table.toggleAllRowsSelected(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Clear selection <Kbd>Esc</Kbd>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-1">
              {selectedRows.length === 1 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8"
                      onClick={() => window.open(`${window.location.pathname}/${selectedRows[0].original.id}/edit`, '_blank')}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit record (Ctrl+E)</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8"
                    onClick={() => copyToClipboard(selectedRows)}
                    disabled={isPending}
                  >
                    <ClipboardCopyIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy details (Ctrl+C)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8"
                    onClick={() => generateImage(selectedRows)}
                    disabled={isPending}
                  >
                    {isPending && activeMethod === "generate-image" ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileImage className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Generate Job Sheet</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8"
                    onClick={() => {
                      setActiveMethod("export");
                      startTransition(() => {
                        exportTableToExcel(table, {
                          excludeColumns: ["select", "actions"],
                          onlySelected: true,
                        });
                      });
                    }}
                    disabled={isPending}
                  >
                    <DownloadIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export Excel</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
