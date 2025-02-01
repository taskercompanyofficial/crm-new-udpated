import React from "react";
import myAxios from "@/lib/axios.config";

type FetchResult<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
};

export default function useFetch<T>(
  url: string,
  token?: string,
): FetchResult<T> {
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchData = async (url: string, token?: string) => {
    try {
      const response = await myAxios.get(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      setData(response.data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    setIsLoading(true);
    fetchData(url, token);
  }, [url, token]);

  return { data, error, isLoading };
}
