import DataFetcher from "@/components/table/DataFetcher";
import BrandsTable from "@/components/tables/brands-table";
import { API_URL, BRANDS } from "@/lib/apiEndPoints";
import React from "react";

export default function page() {
  return (
    <div className="">
      <DataFetcher
        endPoint={API_URL + BRANDS}
        pageEndPoint="/authorized-brands"
        role="authorized-brands"
        Table={BrandsTable}
      />
    </div>
  );
}
