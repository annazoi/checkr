"use client";

import { useQuery } from "@tanstack/react-query";
import type { ConfidenceLevel, ReportType } from "@/types";

export type SourceReportRow = {
  id: string;
  reportType: ReportType;
  confidenceLevel: ConfidenceLevel | null;
  description: string | null;
  createdAt: string;
  username: string;
  level: number | null;
};

export function useReports(gameSourceId: string, filter: string, page = 1) {
  return useQuery({
    queryKey: ["source-reports", gameSourceId, filter, page],
    queryFn: async (): Promise<{ reports: SourceReportRow[]; page: number }> => {
      const params = new URLSearchParams({ filter, page: String(page) });
      const res = await fetch(`/api/sources/${gameSourceId}/reports?${params.toString()}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error?.message ?? "Failed to load reports.");
      return body.data;
    },
    enabled: Boolean(gameSourceId),
  });
}
