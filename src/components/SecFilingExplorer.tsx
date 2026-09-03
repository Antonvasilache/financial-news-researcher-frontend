import { useState, type FormEvent } from "react";
import {
  fetchCompanyFilings,
  fetchLatestFiling,
  fetchFilingByAccession,
} from "../services/secService";
import type {
  ParsedSecFilingResponse,
  SecFilingMetadata,
  SecFilingsListResponse,
} from "../types/sec";
import { FinancialSummary } from "./FinancialSummary";
import { FilingSectionReader } from "./FilingSectionReader";

interface SecFilingExplorerProps {
  trackedTickers?: string[];
  initialTicker?: string;
}

export const SecFilingExplorer = ({
  trackedTickers = [],
  initialTicker = "",
}: SecFilingExplorerProps) => {
  const [ticker, setTicker] = useState(initialTicker);
  const [formType, setFormType] = useState<string>("ALL");
  const [limit, setLimit] = useState<number>(10);

  const [filingsData, setFilingsData] = useState<SecFilingsListResponse | null>(null);
  const [activeFiling, setActiveFiling] = useState<ParsedSecFilingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSearchFilings = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const cleanTicker = ticker.trim().toUpperCase();
    if (!cleanTicker) {
      setError("Please enter a stock ticker symbol (e.g. AAPL, MSFT)");
      return;
    }

    try {
      setIsLoading(true);
      setLoadingMessage(`Fetching filings for ${cleanTicker}...`);
      setError(null);
      const data = await fetchCompanyFilings(
        cleanTicker,
        formType === "ALL" ? undefined : formType,
        limit
      );
      setFilingsData(data);
      // If no active filing loaded, or if new ticker search, keep or clear active filing
      if (activeFiling && activeFiling.ticker !== cleanTicker) {
        setActiveFiling(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch SEC filings";
      setError(message);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleFetchLatest = async (selectedFormType: "10-K" | "10-Q") => {
    const cleanTicker = ticker.trim().toUpperCase();
    if (!cleanTicker) {
      setError("Please enter a stock ticker symbol");
      return;
    }

    try {
      setIsLoading(true);
      setLoadingMessage(`Extracting latest ${selectedFormType} for ${cleanTicker}...`);
      setError(null);
      const filing = await fetchLatestFiling(cleanTicker, selectedFormType);
      setActiveFiling(filing);
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to fetch latest ${selectedFormType}`;
      setError(message);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleInspectFiling = async (filingItem: SecFilingMetadata) => {
    const cleanTicker = (filingsData?.ticker || ticker).trim().toUpperCase();
    try {
      setIsLoading(true);
      setLoadingMessage(`Loading sections for ${filingItem.form_type} (${filingItem.accession_number})...`);
      setError(null);
      const fullFiling = await fetchFilingByAccession(
        cleanTicker,
        filingItem.accession_number,
        filingItem.form_type
      );
      setActiveFiling(fullFiling);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load filing sections";
      setError(message);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="sec-explorer-container" data-testid="sec-filing-explorer">
      <header className="sec-explorer-header">
        <h2>SEC Filing Explorer & Section Reader</h2>
        <p className="subtitle">
          Search EDGAR submissions, view filing history, and read parsed SEC 10-K & 10-Q sections.
        </p>
      </header>

      {/* Quick selection chips for tracked tickers */}
      {trackedTickers.length > 0 && (
        <div className="tracked-ticker-chips" aria-label="Tracked Tickers Quick Select">
          <span className="chips-label">Quick Select Tracked:</span>
          {trackedTickers.map((t) => (
            <button
              key={t}
              type="button"
              className={`ticker-chip ${ticker.toUpperCase() === t.toUpperCase() ? "active" : ""}`}
              onClick={() => setTicker(t.toUpperCase())}
            >
              ${t.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Search & Filter Form */}
      <form className="sec-search-form" onSubmit={handleSearchFilings}>
        <div className="form-group">
          <label htmlFor="sec-ticker-input">SEC Ticker</label>
          <input
            id="sec-ticker-input"
            type="text"
            placeholder="e.g. AAPL, NVDA"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            maxLength={10}
            className="ticker-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="sec-form-type">Form Type</label>
          <select
            id="sec-form-type"
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            className="select-input"
          >
            <option value="ALL">All Forms</option>
            <option value="10-K">10-K (Annual)</option>
            <option value="10-Q">10-Q (Quarterly)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sec-limit">Results Limit</label>
          <select
            id="sec-limit"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="select-input"
          >
            <option value={5}>5 Filings</option>
            <option value={10}>10 Filings</option>
            <option value={20}>20 Filings</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isLoading} className="primary-btn">
            {isLoading && loadingMessage.includes("Fetching") ? "Searching..." : "Search Filings"}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleFetchLatest("10-K")}
            className="secondary-btn"
          >
            Latest 10-K
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleFetchLatest("10-Q")}
            className="secondary-btn"
          >
            Latest 10-Q
          </button>
        </div>
      </form>

      {error && <div className="error-banner" role="alert">{error}</div>}

      {isLoading && (
        <div className="loading-indicator" aria-live="polite">
          <span className="spinner" /> {loadingMessage || "Loading SEC data..."}
        </div>
      )}

      {/* Active Filing View (Summary & Section Reader) */}
      {activeFiling && (
        <section className="active-filing-section" aria-label="Parsed Filing View">
          <FinancialSummary filing={activeFiling} />
          <FilingSectionReader
            key={activeFiling.accession_number}
            filing={activeFiling}
          />
        </section>
      )}

      {/* Filings List Table */}
      {filingsData && (
        <section className="filings-list-section" aria-label="Filings List">
          <div className="filings-list-header">
            <h3>
              {filingsData.company_name} ({filingsData.ticker}) Filings History
            </h3>
            <span className="filing-count-badge">
              Found {filingsData.filings.length} of {filingsData.total_count} filings
            </span>
          </div>

          {filingsData.filings.length === 0 ? (
            <p className="no-filings-msg">No filings found matching your filter criteria.</p>
          ) : (
            <div className="filings-table-wrapper">
              <table className="filings-table">
                <thead>
                  <tr>
                    <th>Form</th>
                    <th>Filing Date</th>
                    <th>Report Date</th>
                    <th>Accession Number</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filingsData.filings.map((f) => (
                    <tr
                      key={f.accession_number}
                      className={activeFiling?.accession_number === f.accession_number ? "active-row" : ""}
                    >
                      <td>
                        <span
                          className={`form-pill form-${f.form_type.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                        >
                          {f.form_type}
                        </span>
                      </td>
                      <td>{f.filing_date}</td>
                      <td>{f.report_date || "—"}</td>
                      <td className="mono-text">{f.accession_number}</td>
                      <td className="desc-cell" title={f.description || f.primary_document}>
                        {f.description || f.primary_document}
                      </td>
                      <td className="action-cell">
                        <button
                          type="button"
                          className="inspect-btn"
                          onClick={() => handleInspectFiling(f)}
                          disabled={isLoading}
                        >
                          Read Sections
                        </button>
                        {f.document_url && (
                          <a
                            href={f.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sec-link-btn"
                            title="Open original document on SEC EDGAR"
                          >
                            SEC ↗
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
