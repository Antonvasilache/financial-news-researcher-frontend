import { describe, it, expect, vi, beforeEach } from "vitest";
import { secApi } from "../secApi";
import * as clientModule from "../client";
import type {
  ParsedSecFilingResponse,
  SecFilingsListResponse,
} from "../../types/sec";

describe("secApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetchCompanyFilings builds correct query string with ticker and limit", async () => {
    const mockResponse: SecFilingsListResponse = {
      ticker: "AAPL",
      cik: "0000320193",
      company_name: "Apple Inc.",
      filings: [
        {
          accession_number: "0000320193-24-000106",
          form_type: "10-K",
          filing_date: "2024-11-01",
          report_date: "2024-09-28",
          primary_document: "aapl-20240928.htm",
          document_url: "https://www.sec.gov/ix?doc=/Archives/edgar/data/320193/000032019324000106/aapl-20240928.htm",
          description: "Annual report for fiscal year ended September 28, 2024",
        },
      ],
      total_count: 1,
    };

    const fetchClientSpy = vi
      .spyOn(clientModule, "fetchClient")
      .mockResolvedValueOnce(mockResponse);

    const result = await secApi.fetchCompanyFilings("AAPL", "10-K", 5);

    expect(fetchClientSpy).toHaveBeenCalledWith(
      "/api/v1/sec/filings?ticker=AAPL&limit=5&form_type=10-K"
    );
    expect(result).toEqual(mockResponse);
  });

  it("fetchCompanyFilings ignores formType if set to ALL", async () => {
    const mockResponse: SecFilingsListResponse = {
      ticker: "MSFT",
      cik: "0000789019",
      company_name: "Microsoft Corp",
      filings: [],
      total_count: 0,
    };

    const fetchClientSpy = vi
      .spyOn(clientModule, "fetchClient")
      .mockResolvedValueOnce(mockResponse);

    await secApi.fetchCompanyFilings("MSFT", "ALL", 10);

    expect(fetchClientSpy).toHaveBeenCalledWith(
      "/api/v1/sec/filings?ticker=MSFT&limit=10"
    );
  });

  it("fetchLatestFiling builds correct endpoint and query params", async () => {
    const mockParsed: ParsedSecFilingResponse = {
      ticker: "AAPL",
      cik: "0000320193",
      company_name: "Apple Inc.",
      form_type: "10-K",
      accession_number: "0000320193-24-000106",
      filing_date: "2024-11-01",
      report_date: "2024-09-28",
      sections: {
        item_1a: {
          item_id: "item_1a",
          title: "Item 1A. Risk Factors",
          content: "The Company's business and operations are subject to risks.",
          character_count: 59,
        },
      },
      raw_text_preview: "Raw preview text",
    };

    const fetchClientSpy = vi
      .spyOn(clientModule, "fetchClient")
      .mockResolvedValueOnce(mockParsed);

    const result = await secApi.fetchLatestFiling("AAPL", "10-K");

    expect(fetchClientSpy).toHaveBeenCalledWith(
      "/api/v1/sec/filings/AAPL/latest?form_type=10-K"
    );
    expect(result).toEqual(mockParsed);
  });

  it("fetchFilingByAccession calls the correct accession URL", async () => {
    const mockParsed: ParsedSecFilingResponse = {
      ticker: "NVDA",
      cik: "0001045810",
      company_name: "NVIDIA Corp",
      form_type: "10-Q",
      accession_number: "0001045810-24-000080",
      filing_date: "2024-08-28",
      report_date: "2024-07-28",
      sections: {},
      raw_text_preview: "NVIDIA 10-Q raw text",
    };

    const fetchClientSpy = vi
      .spyOn(clientModule, "fetchClient")
      .mockResolvedValueOnce(mockParsed);

    const result = await secApi.fetchFilingByAccession(
      "NVDA",
      "0001045810-24-000080",
      "10-Q"
    );

    expect(fetchClientSpy).toHaveBeenCalledWith(
      "/api/v1/sec/filings/NVDA/0001045810-24-000080?form_type=10-Q"
    );
    expect(result).toEqual(mockParsed);
  });
});
