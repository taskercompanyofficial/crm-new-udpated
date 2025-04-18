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

    // Retrieve headers (column names)
    const headers = table
        .getAllLeafColumns()
        .map((column) => column.id)
        .filter((id) => !excludeColumns.includes(id as keyof TData | "select" | "actions"));

    // Get rows data
    const rows = (onlySelected
        ? table.getFilteredSelectedRowModel().rows
        : table.getRowModel().rows
    ).map((row) =>
        headers.map((header) => row.getValue(header))
    );

    // Create worksheet data with headers
    const wsData = [headers, ...rows];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${filename}.xlsx`);
}
