import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FinancialSummary } from "../FinancialSummary";
import type { ParsedSecFilingResponse } from "../../types/sec";

describe("FinancialSummary", () => {
  const mockFiling: ParsedSecFilingResponse = {
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
        content: "Apple designs, manufactures and markets smartphones.",
        character_count: 52,
      },
      item_1a: {
        item_id: "item_1a",
        title: "Item 1A. Risk Factors",
        content: "Global economic conditions affect the company.",
        character_count: 45,
      },
    },
    raw_text_preview: "Raw preview",
  };

  it("renders company identity, CIK, and dates correctly", () => {
    render(<FinancialSummary filing={mockFiling} />);

    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("10-K")).toBeInTheDocument();
    expect(screen.getByText("0000320193")).toBeInTheDocument();
    expect(screen.getByText("2024-11-01")).toBeInTheDocument();
    expect(screen.getByText("2024-09-28")).toBeInTheDocument();
    expect(screen.getByText("0000320193-24-000106")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // 2 sections
    expect(screen.getByText("97 chars")).toBeInTheDocument(); // 52 + 45 chars
  });

  it("handles null report_date gracefully", () => {
    const filingNoReport = { ...mockFiling, report_date: null };
    render(<FinancialSummary filing={filingNoReport} />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});
