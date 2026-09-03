import type { ParsedSecFilingResponse } from "../types/sec";

interface FinancialSummaryProps {
  filing: ParsedSecFilingResponse;
}

export const FinancialSummary = ({ filing }: FinancialSummaryProps) => {
  const sectionsList = Object.values(filing.sections || {});
  const totalCharacters = sectionsList.reduce(
    (acc, sec) => acc + (sec.character_count || sec.content?.length || 0),
    0
  );

  return (
    <div className="financial-summary-card" data-testid="financial-summary">
      <div className="summary-header">
        <div className="company-badge-group">
          <span className="ticker-pill">{filing.ticker}</span>
          <span className="form-type-pill">{filing.form_type}</span>
          <h3>{filing.company_name}</h3>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-stat">
          <span className="stat-label">CIK</span>
          <span className="stat-value">{filing.cik}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Filing Date</span>
          <span className="stat-value">{filing.filing_date}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Period of Report</span>
          <span className="stat-value">{filing.report_date || "N/A"}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Accession Number</span>
          <span className="stat-value mono-text">{filing.accession_number}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Extracted Sections</span>
          <span className="stat-value">{sectionsList.length}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Parsed Length</span>
          <span className="stat-value">{totalCharacters.toLocaleString()} chars</span>
        </div>
      </div>
    </div>
  );
};
