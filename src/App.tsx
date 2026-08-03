import { useEffect, useState } from 'react'
import './App.css'
import type { TickerCreate, TickerResponse } from './types/ticker';
import { tickerApi } from './api/tickerApi';
import { TickerForm } from './components/TickerForm';
import { TickerList } from './components/TickerList';

function App() {
  const [tickers, setTickers] = useState<TickerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTickers = async () => {
    try {
      setError(null);
      const data = await tickerApi.getAll();
      setTickers(data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch tickers')
    }
  }

  useEffect(() => {
    loadTickers();
  }, [])

  const handleCreateTicker = async (newTicker: TickerCreate) => {
    try {
      setIsLoading(true);
      setError(null);
      await tickerApi.create(newTicker);
      await loadTickers();
    } catch (error: any) {
      setError(error.message || 'Failed to create ticker')
    }
  }

  const handleDeleteTicker = async (id: number) => {
    try {
      setError(null);
      await tickerApi.delete(id);
      await loadTickers();
    } catch (error: any) {
      setError(error.message || 'Failed to delete ticker')
    }
  }

  return (
    <main className="container">
      <h1>Financial News Researcher</h1>
      {error && <div className="error-banner">{error}</div>}

      <section>
        <h2>Track New Ticker</h2>
        <TickerForm onSubmit={handleCreateTicker} isLoading={isLoading} />
      </section>

      <section>
        <h2>Tracked Symbols</h2>
        <TickerList tickers={tickers} onDelete={handleDeleteTicker} />
      </section>
    </main>
  );
}

export default App
