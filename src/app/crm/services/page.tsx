import { PageHeader } from "@/components/custom/page-header";
import DataFetcher from "@/components/table/DataFetcher";
import ServicesTable from "@/components/tables/services-table";
import { API_URL, SERVICES } from "@/lib/apiEndPoints";
import React from "react";

export default function page() {
    return (
        <div className="space-y-2">
            <PageHeader />
            <DataFetcher
                endPoint={API_URL + SERVICES}
                pageEndPoint="/services"
                role="services"
                Table={ServicesTable}
            />
        </div>
    );
}
