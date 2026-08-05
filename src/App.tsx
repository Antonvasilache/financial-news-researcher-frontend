import { useEffect, useState } from 'react'
import './App.css'
import type { TickerCreate, TickerResponse } from './types/ticker';
import { tickerApi } from './api/tickerApi';
import { TickerForm } from './components/TickerForm';
import { TickerList } from './components/TickerList';
import type { RevenueStreamRequest, RevenueStreamResponse } from './types/research';
import { researchApi } from './api/researchApi';
import { RevenueResearch } from './components/RevenueResearch';

function App() {
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
      setTickerError(null);
      const data = await tickerApi.getAll();
      setTickers(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load tickers';
      setTickerError(message)
    }
  }

  useEffect(() => {
    loadTickers();
  }, [])

  const handleCreateTicker = async (data: TickerCreate) => {
    try {
      setIsTickerLoading(true);
      setTickerError(null);
      await tickerApi.create(data);
      await loadTickers();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create ticker';
      setTickerError(message)
    } finally {
      setIsTickerLoading(false)
    }
  }

  const handleDeleteTicker = async (id: number) => {
    try {
      setTickerError(null);
      await tickerApi.delete(id);
      await loadTickers();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete ticker';
      setTickerError(message)
    }
  }

  const handleAnalyzeRevenue = async (data: RevenueStreamRequest) => {
    try {
      setIsResearchLoading(true);
      setResearchError(null);
      const result = await researchApi.getRevenueStreams(data);
      setResearchData(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to analyze revenue stream';
      setResearchError(message)
    } finally {
      setIsResearchLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Financial News Researcher</h1>

      <section>
        <h2>Track New Ticker</h2>
        {tickerError && <div className='error-banner'>{tickerError}</div>}
        <TickerForm onSubmit={handleCreateTicker} isLoading={isTickerLoading} />
        <TickerList tickers={tickers} onDelete={handleDeleteTicker} />
      </section>

      <hr />

      <section>
        <RevenueResearch
          onSubmit={handleAnalyzeRevenue}
          isLoading={isResearchLoading}
          researchData={researchData}
          error={researchError}
        />
      </section>
    </main>
  );
}

export default App
