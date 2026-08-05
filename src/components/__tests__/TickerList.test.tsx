import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TickerList } from '../TickerList';
import type { TickerResponse } from '../../types/ticker';

describe('TickerList', () => {
    it('renders empty message when no tickers are provided', () => {
        const onDelete = vi.fn().mockResolvedValue(undefined);
        render(<TickerList tickers={[]} onDelete={onDelete} />);

        expect(screen.getByText('No tickers currently tracked')).toBeInTheDocument();
    });

    it('renders list of tickers when tickers are provided', () => {
        const tickers: TickerResponse[] = [
            { id: 1, symbol: 'AAPL', company_name: 'Apple Inc.', is_active: true, created_at: '2026-01-01' },
            { id: 2, symbol: 'GOOGL', company_name: 'Alphabet Inc.', is_active: true, created_at: '2026-01-01' },
        ];
        const onDelete = vi.fn().mockResolvedValue(undefined);

        render(<TickerList tickers={tickers} onDelete={onDelete} />);

        expect(screen.getByText('AAPL')).toBeInTheDocument();
        expect(screen.getByText('— Apple Inc.')).toBeInTheDocument();
        expect(screen.getByText('GOOGL')).toBeInTheDocument();
        expect(screen.getByText('— Alphabet Inc.')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(2);
    });

    it('triggers onDelete callback when a list item Delete button is clicked', () => {
        const tickers: TickerResponse[] = [
            { id: 1, symbol: 'AAPL', company_name: 'Apple Inc.', is_active: true, created_at: '2026-01-01' },
        ];
        const onDelete = vi.fn().mockResolvedValue(undefined);

        render(<TickerList tickers={tickers} onDelete={onDelete} />);

        fireEvent.click(screen.getByRole('button', { name: /delete/i }));
        expect(onDelete).toHaveBeenCalledWith(1);
    });
});
