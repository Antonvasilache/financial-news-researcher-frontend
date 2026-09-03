import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchCompanyFilings,
  fetchLatestFiling,
  fetchFilingByAccession,
} from "../secService";
import { secApi } from "../../api/secApi";
import type {
  ParsedSecFilingResponse,
  SecFilingsListResponse,
} from "../../types/sec";

vi.mock("../../api/secApi", () => ({
  secApi: {
    fetchCompanyFilings: vi.fn(),
    fetchLatestFiling: vi.fn(),
    fetchFilingByAccession: vi.fn(),
  },
}));

describe("secService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchCompanyFilings delegates to secApi.fetchCompanyFilings", async () => {
    const mockFilingsList: SecFilingsListResponse = {
      ticker: "AAPL",
      cik: "0000320193",
      company_name: "Apple Inc.",
      filings: [],
      total_count: 0,
    };

    vi.mocked(secApi.fetchCompanyFilings).mockResolvedValueOnce(mockFilingsList);

    const result = await fetchCompanyFilings("AAPL", "10-K", 5);

    expect(secApi.fetchCompanyFilings).toHaveBeenCalledWith("AAPL", "10-K", 5);
    expect(result).toEqual(mockFilingsList);
  });

  it("fetchLatestFiling delegates to secApi.fetchLatestFiling", async () => {
    const mockParsed: ParsedSecFilingResponse = {
      ticker: "AAPL",
      cik: "0000320193",
      company_name: "Apple Inc.",
      form_type: "10-K",
      accession_number: "0000320193-24-000106",
      filing_date: "2024-11-01",
      report_date: "2024-09-28",
      sections: {},
      raw_text_preview: "Preview",
    };

    vi.mocked(secApi.fetchLatestFiling).mockResolvedValueOnce(mockParsed);

    const result = await fetchLatestFiling("AAPL", "10-K");

    expect(secApi.fetchLatestFiling).toHaveBeenCalledWith("AAPL", "10-K");
    expect(result).toEqual(mockParsed);
  });

  it("fetchFilingByAccession delegates to secApi.fetchFilingByAccession", async () => {
    const mockParsed: ParsedSecFilingResponse = {
      ticker: "NVDA",
      cik: "0001045810",
      company_name: "NVIDIA Corp",
      form_type: "10-Q",
      accession_number: "0001045810-24-000080",
      filing_date: "2024-08-28",
      report_date: "2024-07-28",
      sections: {},
      raw_text_preview: "NVIDIA Preview",
    };

    vi.mocked(secApi.fetchFilingByAccession).mockResolvedValueOnce(mockParsed);

    const result = await fetchFilingByAccession(
      "NVDA",
      "0001045810-24-000080",
      "10-Q"
    );

    expect(secApi.fetchFilingByAccession).toHaveBeenCalledWith(
      "NVDA",
      "0001045810-24-000080",
      "10-Q"
    );
    expect(result).toEqual(mockParsed);
  });
});

