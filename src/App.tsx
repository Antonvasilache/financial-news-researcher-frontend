import { useEffect, useState } from "react";
import "./App.css";
import type { TickerCreate, TickerResponse } from "./types/ticker";
import {
  fetchTickers,
  createTicker,
  deleteTicker,
} from "./services/tickerService";
import { TickerForm } from "./components/TickerForm";
import { TickerList } from "./components/TickerList";
import type { RevenueStreamRequest, RevenueStreamResponse } from "./types/research";
import { fetchRevenueStreams } from "./services/researchService";
import { RevenueResearch } from "./components/RevenueResearch";
import { SecFilingExplorer } from "./components/SecFilingExplorer";

export type DashboardTab = "all" | "sec" | "tickers" | "research";

function App() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("all");

  // Ticker state
  const [tickers, setTickers] = useState<TickerResponse[]>([]);
  const [isTickerLoading, setIsTickerLoading] = useState(false);
  const [tickerError, setTickerError] = useState<string | null>(null);

  // Research State
  const [researchData, setResearchData] = useState<RevenueStreamResponse | null>(null);
  const [isResearchLoading, setIsResearchLoading] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);

  const loadTickers = async () => {
    try {
      const data = await fetchTickers();
      setTickers(data);
      setTickerError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load tickers";
      setTickerError(message);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchTickers()
      .then((data) => {
        if (isMounted) {
          setTickers(data);
          setTickerError(null);
        }
      })
      .catch((error) => {
        if (isMounted) {
          const message =
            error instanceof Error ? error.message : "Failed to load tickers";
          setTickerError(message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateTicker = async (data: TickerCreate) => {
    try {
      setIsTickerLoading(true);
      setTickerError(null);
      await createTicker(data);
      await loadTickers();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create ticker";
      setTickerError(message);
    } finally {
      setIsTickerLoading(false);
    }
  };

  const handleDeleteTicker = async (id: number) => {
    try {
      setTickerError(null);
      await deleteTicker(id);
      await loadTickers();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete ticker";
      setTickerError(message);
    }
  };

  const handleAnalyzeRevenue = async (data: RevenueStreamRequest) => {
    try {
      setIsResearchLoading(true);
      setResearchError(null);
      const result = await fetchRevenueStreams(data);
      setResearchData(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to analyze revenue stream";
      setResearchError(message);
    } finally {
      setIsResearchLoading(false);
    }
  };

  const trackedSymbols = tickers.map((ticker) => ticker.symbol);

  return (
    <main className="container">
      <header className="app-header">
        <h1>Financial News Researcher</h1>
        <p className="app-tagline">
          Automated SEC Filing Analysis, Market Data Exploration & AI Research
        </p>

        <nav className="dashboard-nav" aria-label="Dashboard Navigation">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Modules
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === "sec" ? "active" : ""}`}
            onClick={() => setActiveTab("sec")}
          >
            📑 SEC Filing Explorer
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === "tickers" ? "active" : ""}`}
            onClick={() => setActiveTab("tickers")}
          >
            📈 Tracked Tickers
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === "research" ? "active" : ""}`}
            onClick={() => setActiveTab("research")}
          >
            🤖 AI Revenue Breakdown
          </button>
        </nav>
      </header>

      {/* Module 1: SEC Filing Explorer & Reader */}
      {(activeTab === "all" || activeTab === "sec") && (
        <section className="dashboard-section sec-module">
          <SecFilingExplorer
            trackedTickers={trackedSymbols}
          />
        </section>
      )}

      {/* Module 2: Track New Ticker & Ticker List */}
      {(activeTab === "all" || activeTab === "tickers") && (
        <section className="dashboard-section ticker-module">
          <h2>Track New Ticker</h2>
          {tickerError && <div className="error-banner">{tickerError}</div>}
          <TickerForm onSubmit={handleCreateTicker} isLoading={isTickerLoading} />
          <TickerList tickers={tickers} onDelete={handleDeleteTicker} />
        </section>
      )}

      {/* Module 3: AI Revenue Breakdown */}
      {(activeTab === "all" || activeTab === "research") && (
        <section className="dashboard-section research-module">
          <RevenueResearch
            onSubmit={handleAnalyzeRevenue}
            isLoading={isResearchLoading}
            researchData={researchData}
            error={researchError}
          />
        </section>
      )}
    </main>
  );
}

export default App;
