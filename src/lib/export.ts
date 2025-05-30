import { type Table } from "@tanstack/react-table";
import * as XLSX from "xlsx";

export function exportTableToExcel<TData>(
    /**
     * The table to export.
     * @type Table<TData>
     */
    table: Table<TData>,
    opts: {
        /**
         * The filename for the Excel file.
         * @default "table"
         * @example "tasks"
         */
        filename?: string;
        /**
         * The columns to exclude from the Excel file.
         * @default []
         * @example ["select", "actions"]
         */
        excludeColumns?: Array<keyof TData | "select" | "actions">;

        /**
         * Whether to export only the selected rows.
         * @default false
         */
        onlySelected?: boolean;
    } = {},
): void {
    const {
        filename = "table",
        excludeColumns = [],
        onlySelected = false,
    } = opts;

    // Get all visible columns
    const visibleColumns = table.getAllLeafColumns().filter(col => 
        !excludeColumns.includes(col.id as keyof TData | "select" | "actions")
    );

    // Retrieve headers (column names) and format them
    const headers = visibleColumns.map((column) => {
        const id = column.id;
        // Replace underscores with spaces and capitalize first letter
        return id
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    });

    // Get rows data - fixed to align with visible columns
    const rows = (onlySelected
        ? table.getFilteredSelectedRowModel().rows
        : table.getRowModel().rows
    ).map((row) =>
        visibleColumns.map(column => row.getValue(column.id))
    );

    // Create worksheet data with headers
    const wsData = [headers, ...rows];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Apply Excel table styling
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
    
    // Style all cells with borders and better formatting
    for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
            if (!ws[cellRef]) ws[cellRef] = { v: '' };
            
            // Alternate row colors for better readability
            const isEvenRow = row % 2 === 0;
            ws[cellRef].s = {
                border: {
                    top: { style: 'thin', color: { rgb: "FF808080" } },
                    bottom: { style: 'thin', color: { rgb: "FF808080" } },
                    left: { style: 'thin', color: { rgb: "FF808080" } },
                    right: { style: 'thin', color: { rgb: "FF808080" } }
                },
                fill: isEvenRow 
                    ? { patternType: "solid", fgColor: { rgb: "FFF5F5F5" } }
                    : { patternType: "solid", fgColor: { rgb: "FFFFFFFF" } },
                alignment: { 
                    horizontal: 'left',
                    vertical: 'center',
                    wrapText: true
                },
                font: {
                    name: "Arial",
                    sz: 11
                }
            };
        }
    }

    // Enhanced header styling
    for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
        ws[cellRef].s = {
            fill: { patternType: "solid", fgColor: { rgb: "FF1F497D" } },
            font: { 
                bold: true, 
                color: { rgb: "FFFFFFFF" },
                sz: 12,
                name: "Arial"
            },
            border: {
                top: { style: 'medium', color: { rgb: "FF808080" } },
                bottom: { style: 'medium', color: { rgb: "FF808080" } },
                left: { style: 'medium', color: { rgb: "FF808080" } },
                right: { style: 'medium', color: { rgb: "FF808080" } }
            },
            alignment: { 
                horizontal: 'center', 
                vertical: 'center', 
                wrapText: true 
            }
        };
    }

    // Set optimized column widths based on content
    const maxContentLengths = new Array(headers.length).fill(0);
    wsData.forEach(row => {
        row.forEach((cell, i) => {
            const cellLength = String(cell).length;
            maxContentLengths[i] = Math.max(maxContentLengths[i], cellLength);
        });
    });

    const colWidths = maxContentLengths.map(length => ({
        wch: Math.min(Math.max(length + 2, 12), 50) // Min 12, max 50 characters
    }));
    ws['!cols'] = colWidths;

    // Add autofilter
    ws['!autofilter'] = { ref: ws['!ref'] || 'A1' };

    // Freeze the header row
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${filename}.xlsx`);
}
