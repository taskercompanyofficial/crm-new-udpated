import { PageHeader } from "@/components/custom/page-header";
import DataFetcher from "@/components/table/DataFetcher";
import InventoryTable from "@/components/tables/inventory-table";
import { API_URL, INVENTORIES } from "@/lib/apiEndPoints";
import React from "react";

export default function page() {
  return (  
    <div className="space-y-2">
      <PageHeader />
      <DataFetcher
        endPoint={API_URL + INVENTORIES}
        pageEndPoint="/inventory"
        role="inventory"
        Table={InventoryTable}
      />
    </div>
  );
}
