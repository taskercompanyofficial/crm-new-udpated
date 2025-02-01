// components/DataFetcher.tsx
import React from "react";
import Table from "./Table";
import { ErrorScreen } from "@/components/custom/error-screen";
import { fetchData } from "@/hooks/fetchData";

interface DataFetcherProps {
  endPoint: string;
  pageEndPoint: string;
  role: string;
}

const DataFetcher: React.FC<DataFetcherProps> = async ({
  endPoint,
  pageEndPoint,
}) => {
  const response = await fetchData({ endPoint });

  return (
    <>
      {response?.data ? (
        <Table data={response.data} endPoint={pageEndPoint} />
      ) : (
        <ErrorScreen error={response?.message} />
      )}
    </>
  );
};

export default DataFetcher;
