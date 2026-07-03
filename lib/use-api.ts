"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/lib/api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const response = await api.get<ApiResponse<T>>(url);

        if (!ignore) {
          setData(response.data.data);
        }
      } catch (error) {
        if (!ignore) {
          if (axios.isAxiosError(error)) {
            setError(error.response?.data?.message || error.message);
          } else if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("Something went wrong");
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      ignore = true;
    };
  }, [url]);

  return {
    data,
    loading,
    error,
  };
}
