import { secApi } from "../api/secApi";
import type {
  ParsedSecFilingResponse,
  SecFilingsListResponse,
} from "../types/sec";

export async function fetchCompanyFilings(
  ticker: string,
  formType?: string,
  limit: number = 10
): Promise<SecFilingsListResponse> {
  return secApi.fetchCompanyFilings(ticker, formType, limit);
}

export async function fetchLatestFiling(
  ticker: string,
  formType: "10-K" | "10-Q" | string = "10-K"
): Promise<ParsedSecFilingResponse> {
  return secApi.fetchLatestFiling(ticker, formType);
}

export async function fetchFilingByAccession(
  ticker: string,
  accessionNumber: string,
  formType?: string
): Promise<ParsedSecFilingResponse> {
  return secApi.fetchFilingByAccession(ticker, accessionNumber, formType);
}

