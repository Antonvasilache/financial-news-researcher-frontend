import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FilingSectionReader } from "../FilingSectionReader";
import type { ParsedSecFilingResponse } from "../../types/sec";

describe("FilingSectionReader", () => {
  const mockFiling: ParsedSecFilingResponse = {
    ticker: "MSFT",
    cik: "0000789019",
    company_name: "Microsoft Corp",
    form_type: "10-K",
    accession_number: "0000789019-24-000050",
    filing_date: "2024-07-30",
    report_date: "2024-06-30",
    sections: {
      item_1: {
        item_id: "item_1",
        title: "Item 1. Business",
        content: "Microsoft develops and supports software, services, and devices.",
        character_count: 65,
      },
      item_1a: {
        item_id: "item_1a",
        title: "Item 1A. Risk Factors",
        content: "Intense competition in cloud computing and AI services.",
        character_count: 56,
      },
    },
    raw_text_preview: "Raw Microsoft 10-K preview content.",
  };

  const writeTextMock = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
      configurable: true,
    });
  });

  it("renders sections sidebar and defaults to the first section", () => {
    render(<FilingSectionReader filing={mockFiling} />);

    expect(screen.getByText("Filing Sections (2)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /item 1\. business/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /item 1a\. risk factors/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /raw text preview/i })).toBeInTheDocument();

    // Default active section is Item 1
    expect(screen.getByRole("heading", { level: 3, name: "Item 1. Business" })).toBeInTheDocument();
    expect(
      screen.getByText(/Microsoft develops and supports software/i)
    ).toBeInTheDocument();
  });

  it("switches active section when clicked", async () => {
    const user = userEvent.setup();
    render(<FilingSectionReader filing={mockFiling} />);

    const riskFactorsBtn = screen.getByRole("button", { name: /item 1a\. risk factors/i });
    await user.click(riskFactorsBtn);

    expect(screen.getByRole("heading", { level: 3, name: "Item 1A. Risk Factors" })).toBeInTheDocument();
    expect(
      screen.getByText(/Intense competition in cloud computing and AI services\./i)
    ).toBeInTheDocument();
  });

  it("switches to raw text preview tab", async () => {
    const user = userEvent.setup();
    render(<FilingSectionReader filing={mockFiling} />);

    const rawBtn = screen.getByRole("button", { name: /raw text preview/i });
    await user.click(rawBtn);

    expect(
      screen.getByRole("heading", { level: 3, name: "Raw Document Text Preview" })
    ).toBeInTheDocument();
    expect(screen.getByText("Raw Microsoft 10-K preview content.")).toBeInTheDocument();
  });

  it("filters and highlights search query within active section", async () => {
    const user = userEvent.setup();
    render(<FilingSectionReader filing={mockFiling} />);

    const searchInput = screen.getByRole("searchbox", { name: /search within section/i });
    await user.type(searchInput, "software");

    const highlighted = screen.getByText("software");
    expect(highlighted.tagName).toBe("MARK");
    expect(highlighted).toHaveClass("search-highlight");
  });

  it("copies active section content to clipboard on button click", async () => {
    render(<FilingSectionReader filing={mockFiling} />);

    const copyBtn = screen.getByRole("button", { name: /copy/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(
        "Microsoft develops and supports software, services, and devices."
      );
      expect(screen.getByText(/✓ Copied/i)).toBeInTheDocument();
    });
  });
});
