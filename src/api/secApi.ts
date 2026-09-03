import type {
  ParsedSecFilingResponse,
  SecFilingsListResponse,
} from "../types/sec";
import { fetchClient } from "./client";

export const secApi = {
  fetchCompanyFilings: (
    ticker: string,
    formType?: string,
    limit: number = 10,
  ): Promise<SecFilingsListResponse> => {
    const params = new URLSearchParams({ ticker, limit: limit.toString() });
    if (formType && formType !== "ALL") {
      params.append("form_type", formType);
    }
    return fetchClient<SecFilingsListResponse>(
      `/api/v1/sec/filings?${params.toString()}`,
    );
  },

  fetchLatestFiling: (
    ticker: string,
    formType: "10-K" | "10-Q" | string = "10-K",
  ): Promise<ParsedSecFilingResponse> => {
    const params = new URLSearchParams();
    if (formType) {
      params.append("form_type", formType);
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    return fetchClient<ParsedSecFilingResponse>(
      `/api/v1/sec/filings/${encodeURIComponent(ticker)}/latest${query}`,
    );
  },

  fetchFilingByAccession: (
    ticker: string,
    accessionNumber: string,
    formType?: string,
  ): Promise<ParsedSecFilingResponse> => {
    const params = new URLSearchParams();
    if (formType && formType !== "ALL") {
      params.append("form_type", formType);
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    return fetchClient<ParsedSecFilingResponse>(
      `/api/v1/sec/filings/${encodeURIComponent(ticker)}/${encodeURIComponent(accessionNumber)}${query}`,
    );
  },
};
