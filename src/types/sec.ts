export interface SecFilingMetadata {
  accession_number: string;
  form_type: "10-K" | "10-Q" | string;
  filing_date: string;
  report_date: string | null;
  primary_document: string;
  document_url: string;
  description: string | null;
}

export interface SecFilingsListResponse {
  ticker: string;
  cik: string;
  company_name: string;
  filings: SecFilingMetadata[];
  total_count: number;
}

export interface FilingSection {
  item_id: string; // e.g. "item_1", "item_1a", "item_7", "part1_item2"
  title: string;   // e.g. "Item 1A. Risk Factors"
  content: string;
  character_count: number;
}

export interface ParsedSecFilingResponse {
  ticker: string;
  cik: string;
  company_name: string;
  form_type: string;
  accession_number: string;
  filing_date: string;
  report_date: string | null;
  sections: Record<string, FilingSection>;
  raw_text_preview: string;
}

export interface SecFilterParams {
  ticker: string;
  form_type?: string;
  limit?: number;
}
