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

    // Retrieve headers (column names) and format them
    const headers = table
        .getAllLeafColumns()
        .map((column) => {
            const id = column.id;
            // Replace underscores with spaces and capitalize first letter
            return id
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        })
        .filter((_, index, arr) => {
            const id = table.getAllLeafColumns()[index].id;
            return !excludeColumns.includes(id as keyof TData | "select" | "actions");
        });

    // Get rows data
    const rows = (onlySelected
        ? table.getFilteredSelectedRowModel().rows
        : table.getRowModel().rows
    ).map((row) =>
        headers.map((_, index) => {
            const originalHeader = table.getAllLeafColumns()[index].id;
            return row.getValue(originalHeader);
        })
    );

    // Create worksheet data with headers
    const wsData = [headers, ...rows];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Style the header row with white text on green background
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
    for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!ws[cellRef]) ws[cellRef] = { v: '' };
        ws[cellRef].s = {
            fill: { fgColor: { rgb: "008000" } }, // Green background
            font: { color: { rgb: "FFFFFF" } }    // White text
        };
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${filename}.xlsx`);
}
