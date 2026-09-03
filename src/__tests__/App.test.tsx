import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import * as tickerService from '../services/tickerService';
import * as researchService from '../services/researchService';
import type { TickerResponse } from '../types/ticker';
import type { RevenueStreamResponse } from '../types/research';

vi.mock('../services/tickerService', () => ({
    fetchTickers: vi.fn(),
    createTicker: vi.fn(),
    deleteTicker: vi.fn(),
}));

vi.mock('../services/researchService', () => ({
    fetchRevenueStreams: vi.fn(),
}));

describe('App Component Integration Tests', () => {
    const mockTickers: TickerResponse[] = [
        { id: 1, symbol: 'AAPL', company_name: 'Apple Inc.', is_active: true, created_at: '2026-01-01' },
        { id: 2, symbol: 'GOOGL', company_name: 'Alphabet Inc.', is_active: true, created_at: '2026-01-01' },
    ];

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('fetches and renders tickers on initial mount', async () => {
        vi.mocked(tickerService.fetchTickers).mockResolvedValueOnce(mockTickers);

        render(<App />);

        expect(tickerService.fetchTickers).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.getByText('AAPL')).toBeInTheDocument();
            expect(screen.getByText('GOOGL')).toBeInTheDocument();
        });
    });

    it('displays error banner if fetching tickers fails on mount', async () => {
        vi.mocked(tickerService.fetchTickers).mockRejectedValueOnce(new Error('Network Error'));

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Network Error')).toBeInTheDocument();
        });
    });

    it('creates a new ticker and reloads tickers list', async () => {
        const user = userEvent.setup();
        vi.mocked(tickerService.fetchTickers).mockResolvedValueOnce([]);
        vi.mocked(tickerService.createTicker).mockResolvedValueOnce({
            id: 3,
            symbol: 'NVDA',
            company_name: 'NVIDIA Corporation',
            is_active: true,
            created_at: '2026-01-01',
        });
        vi.mocked(tickerService.fetchTickers).mockResolvedValueOnce([
            { id: 3, symbol: 'NVDA', company_name: 'NVIDIA Corporation', is_active: true, created_at: '2026-01-01' },
        ]);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('No tickers currently tracked')).toBeInTheDocument();
        });

        await user.type(screen.getByLabelText(/ticker symbol/i), 'NVDA');
        await user.type(screen.getByLabelText(/company name/i), 'NVIDIA Corporation');
        await user.click(screen.getByRole('button', { name: /add ticker/i }));

        await waitFor(() => {
            expect(tickerService.createTicker).toHaveBeenCalledWith({
                symbol: 'NVDA',
                company_name: 'NVIDIA Corporation',
            });
            expect(screen.getByText('NVDA')).toBeInTheDocument();
        });
    });

    it('displays error banner if creating ticker fails', async () => {
        const user = userEvent.setup();
        vi.mocked(tickerService.fetchTickers).mockResolvedValueOnce([]);
        vi.mocked(tickerService.createTicker).mockRejectedValueOnce(new Error('Duplicate symbol'));

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('No tickers currently tracked')).toBeInTheDocument();
        });

        await user.type(screen.getByLabelText(/ticker symbol/i), 'AAPL');
        await user.type(screen.getByLabelText(/company name/i), 'Apple Inc.');
        await user.click(screen.getByRole('button', { name: /add ticker/i }));

        await waitFor(() => {
            expect(screen.getByText('Duplicate symbol')).toBeInTheDocument();
        });
    });

    it('deletes a ticker and reloads tickers list', async () => {
        const user = userEvent.setup();
        vi.mocked(tickerService.fetchTickers).mockResolvedValueOnce(mockTickers);
        vi.mocked(tickerService.deleteTicker).mockResolvedValueOnce(undefined as unknown as void);
        vi.mocked(tickerService.fetchTickers).mockResolvedValueOnce([mockTickers[1]]);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('AAPL')).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        await user.click(deleteButtons[0]);

        await waitFor(() => {
            expect(tickerService.deleteTicker).toHaveBeenCalledWith(1);
            expect(screen.queryByText('AAPL')).not.toBeInTheDocument();
            expect(screen.getByText('GOOGL')).toBeInTheDocument();
        });
    });

    it('displays error banner if deleting ticker fails', async () => {
        const user = userEvent.setup();
        vi.mocked(tickerService.fetchTickers).mockResolvedValueOnce(mockTickers);
        vi.mocked(tickerService.deleteTicker).mockRejectedValueOnce(new Error('Delete prohibited'));

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('AAPL')).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        await user.click(deleteButtons[0]);

        await waitFor(() => {
            expect(screen.getByText('Delete prohibited')).toBeInTheDocument();
        });
    });

    it('analyzes revenue stream and displays results', async () => {
        const user = userEvent.setup();
        vi.mocked(tickerService.fetchTickers).mockResolvedValueOnce([]);

        const mockResearchResult: RevenueStreamResponse = {
            company_name: 'Apple Inc.',
            summary: 'Leading consumer electronics vendor.',
            primary_currency: 'USD',
            revenue_streams: [
                {
                    name: 'iPhone',
                    description: 'Flagship phone',
                    revenue_type: 'Product',
                    estimated_percentage: 50,
                },
            ],
        };
        vi.mocked(researchService.fetchRevenueStreams).mockResolvedValueOnce(mockResearchResult);

        render(<App />);

        const analyzeButton = screen.getByRole('button', { name: /analyze revenue/i });
        await user.click(analyzeButton);

        await waitFor(() => {
            expect(researchService.fetchRevenueStreams).toHaveBeenCalledWith({
                company_name: 'Apple Inc.',
            });
            expect(screen.getByText('Apple Inc. Revenue Breakdown')).toBeInTheDocument();
            expect(screen.getByText('Leading consumer electronics vendor.')).toBeInTheDocument();
        });
    });

    it('displays error in revenue research section if revenue analysis fails', async () => {
        const user = userEvent.setup();
        vi.mocked(tickerService.fetchTickers).mockResolvedValueOnce([]);
        vi.mocked(researchService.fetchRevenueStreams).mockRejectedValueOnce(new Error('LLM Service Unavailable'));

        render(<App />);

        const analyzeButton = screen.getByRole('button', { name: /analyze revenue/i });
        await user.click(analyzeButton);

        await waitFor(() => {
            expect(screen.getByText('LLM Service Unavailable')).toBeInTheDocument();
        });
    });

    it('switches views when clicking dashboard navigation tabs', async () => {
        const user = userEvent.setup();
        vi.mocked(tickerService.fetchTickers).mockResolvedValueOnce(mockTickers);

        render(<App />);

        // Switch to SEC Filings tab
        const secTabBtn = screen.getByRole('button', { name: /sec filing explorer/i });
        await user.click(secTabBtn);

        expect(screen.getByRole('heading', { name: /sec filing explorer & section reader/i })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /track new ticker/i })).not.toBeInTheDocument();

        // Switch to Tickers tab
        const tickersTabBtn = screen.getByRole('button', { name: /tracked tickers/i });
        await user.click(tickersTabBtn);

        expect(screen.getByRole('heading', { name: /track new ticker/i })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /sec filing explorer & section reader/i })).not.toBeInTheDocument();

        // Switch back to All Modules
        const allTabBtn = screen.getByRole('button', { name: /all modules/i });
        await user.click(allTabBtn);

        expect(screen.getByRole('heading', { name: /sec filing explorer & section reader/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /track new ticker/i })).toBeInTheDocument();
    });
});

