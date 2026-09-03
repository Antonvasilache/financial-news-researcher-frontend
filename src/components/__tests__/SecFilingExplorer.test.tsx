import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SecFilingExplorer } from "../SecFilingExplorer";
import * as secService from "../../services/secService";
import type {
  ParsedSecFilingResponse,
  SecFilingsListResponse,
} from "../../types/sec";

vi.mock("../../services/secService", () => ({
  fetchCompanyFilings: vi.fn(),
  fetchLatestFiling: vi.fn(),
  fetchFilingByAccession: vi.fn(),
}));

describe("SecFilingExplorer", () => {
  const mockFilingsList: SecFilingsListResponse = {
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
        description: "Annual Report",
      },
    ],
    total_count: 1,
  };

  const mockParsedFiling: ParsedSecFilingResponse = {
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
        content: "Supply chain risks and international operations.",
        character_count: 48,
      },
    },
    raw_text_preview: "Apple raw preview",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search controls and quick chips for tracked tickers", async () => {
    const user = userEvent.setup();
    render(
      <SecFilingExplorer
        trackedTickers={["AAPL", "MSFT", "GOOGL"]}
        initialTicker="AAPL"
      />
    );

    expect(
      screen.getByRole("heading", { name: /sec filing explorer & section reader/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/sec ticker/i)).toHaveValue("AAPL");
    expect(screen.getByRole("button", { name: "$MSFT" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "$MSFT" }));
    expect(screen.getByLabelText(/sec ticker/i)).toHaveValue("MSFT");
  });

  it("searches filings list on form submit", async () => {
    const user = userEvent.setup();
    vi.mocked(secService.fetchCompanyFilings).mockResolvedValueOnce(mockFilingsList);

    render(<SecFilingExplorer initialTicker="AAPL" />);

    const searchBtn = screen.getByRole("button", { name: /search filings/i });
    await user.click(searchBtn);

    await waitFor(() => {
      expect(secService.fetchCompanyFilings).toHaveBeenCalledWith("AAPL", undefined, 10);
      expect(screen.getByText("Apple Inc. (AAPL) Filings History")).toBeInTheDocument();
      expect(screen.getByText("0000320193-24-000106")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /read sections/i })).toBeInTheDocument();
    });
  });

  it("fetches latest 10-K directly and displays parsed reader", async () => {
    const user = userEvent.setup();
    vi.mocked(secService.fetchLatestFiling).mockResolvedValueOnce(mockParsedFiling);

    render(<SecFilingExplorer initialTicker="AAPL" />);

    const latest10kBtn = screen.getByRole("button", { name: /latest 10-k/i });
    await user.click(latest10kBtn);

    await waitFor(() => {
      expect(secService.fetchLatestFiling).toHaveBeenCalledWith("AAPL", "10-K");
      expect(screen.getByTestId("financial-summary")).toBeInTheDocument();
      expect(screen.getByTestId("filing-section-reader")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 3, name: "Item 1A. Risk Factors" })
      ).toBeInTheDocument();
    });
  });

  it("fetches latest 10-Q when clicking Latest 10-Q button", async () => {
    const user = userEvent.setup();
    vi.mocked(secService.fetchLatestFiling).mockResolvedValueOnce({
      ...mockParsedFiling,
      form_type: "10-Q",
    });

    render(<SecFilingExplorer initialTicker="AAPL" />);

    const latest10qBtn = screen.getByRole("button", { name: /latest 10-q/i });
    await user.click(latest10qBtn);

    await waitFor(() => {
      expect(secService.fetchLatestFiling).toHaveBeenCalledWith("AAPL", "10-Q");
      expect(screen.getByTestId("financial-summary")).toBeInTheDocument();
    });
  });

  it("inspects filing sections when Read Sections is clicked in table", async () => {
    const user = userEvent.setup();
    vi.mocked(secService.fetchCompanyFilings).mockResolvedValueOnce(mockFilingsList);
    vi.mocked(secService.fetchFilingByAccession).mockResolvedValueOnce(mockParsedFiling);

    render(<SecFilingExplorer initialTicker="AAPL" />);

    await user.click(screen.getByRole("button", { name: /search filings/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /read sections/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /read sections/i }));

    await waitFor(() => {
      expect(secService.fetchFilingByAccession).toHaveBeenCalledWith(
        "AAPL",
        "0000320193-24-000106",
        "10-K"
      );
      expect(screen.getByTestId("financial-summary")).toBeInTheDocument();
    });
  });

  it("displays error banner when search fails", async () => {
    const user = userEvent.setup();
    vi.mocked(secService.fetchCompanyFilings).mockRejectedValueOnce(
      new Error("SEC EDGAR service unreachable")
    );

    render(<SecFilingExplorer initialTicker="AAPL" />);

    await user.click(screen.getByRole("button", { name: /search filings/i }));

    await waitFor(() => {
      expect(screen.getByText("SEC EDGAR service unreachable")).toBeInTheDocument();
    });
  });

  it("resets section reader state when switching between different filings", async () => {
    const user = userEvent.setup();
    const mock10K: ParsedSecFilingResponse = {
      ticker: "AAPL",
      cik: "0000320193",
      company_name: "Apple Inc.",
      form_type: "10-K",
      accession_number: "0000320193-24-000106",
      filing_date: "2024-11-01",
      report_date: "2024-09-28",
      sections: {
        item_1: {
          item_id: "item_1",
          title: "Item 1. Business",
          content: "10-K Business overview",
          character_count: 22,
        },
        item_1a: {
          item_id: "item_1a",
          title: "Item 1A. Risk Factors",
          content: "10-K Risk factors",
          character_count: 17,
        },
      },
      raw_text_preview: "10-K preview",
    };

    const mock10Q: ParsedSecFilingResponse = {
      ticker: "AAPL",
      cik: "0000320193",
      company_name: "Apple Inc.",
      form_type: "10-Q",
      accession_number: "0000320193-24-000107",
      filing_date: "2024-12-15",
      report_date: "2024-11-30",
      sections: {
        part1_item2: {
          item_id: "part1_item2",
          title: "Part I Item 2. MD&A",
          content: "10-Q MD&A section content",
          character_count: 26,
        },
      },
      raw_text_preview: "10-Q preview",
    };

    vi.mocked(secService.fetchLatestFiling)
      .mockResolvedValueOnce(mock10K)
      .mockResolvedValueOnce(mock10Q);

    render(<SecFilingExplorer initialTicker="AAPL" />);

    // Load 10-K and select Risk Factors (item_1a)
    await user.click(screen.getByRole("button", { name: /latest 10-k/i }));
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 3, name: "Item 1. Business" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /item 1a\. risk factors/i }));
    expect(screen.getByRole("heading", { level: 3, name: "Item 1A. Risk Factors" })).toBeInTheDocument();

    // Now load 10-Q (which has part1_item2, no item_1a)
    await user.click(screen.getByRole("button", { name: /latest 10-q/i }));
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 3, name: "Part I Item 2. MD&A" })).toBeInTheDocument();
      expect(screen.getByText("10-Q MD&A section content")).toBeInTheDocument();
    });
  });
});

