// components/DataFetcher.tsx
import React from "react";
import { ErrorTable } from "./errortable";
import { fetchData } from "@/hooks/fetchData";

interface DataFetcherProps {
  endPoint: string;
  pageEndPoint: string;
  role: string;
  Table: React.ComponentType<any>;
}

const DataFetcher: React.FC<DataFetcherProps> = async ({
  endPoint,
  pageEndPoint,
  Table,
  role,
}) => {
  const response = await fetchData({ endPoint });
  return (
    <>
      {response?.data ? (
        <Table data={response.data} endPoint={pageEndPoint} role={role} />
      ) : (
        <ErrorTable error={response?.message} />
      )}
    </>
  );
};

export default DataFetcher;
