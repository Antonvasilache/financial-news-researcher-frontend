import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TickerItem } from '../TickerItem';
import type { TickerResponse } from '../../types/ticker';

describe('TickerItem', () => {
    const mockTicker: TickerResponse = {
        id: 1,
        symbol: 'AAPL',
        company_name: 'Apple Inc.',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
    };

    it('renders symbol and company name correctly', () => {
        const onDelete = vi.fn().mockResolvedValue(undefined);
        render(<TickerItem ticker={mockTicker} onDelete={onDelete} />);

        expect(screen.getByText('AAPL')).toBeInTheDocument();
        expect(screen.getByText('— Apple Inc.')).toBeInTheDocument();
    });

    it('calls onDelete with ticker id when Delete button is clicked', () => {
        const onDelete = vi.fn().mockResolvedValue(undefined);
        render(<TickerItem ticker={mockTicker} onDelete={onDelete} />);

        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);

        expect(onDelete).toHaveBeenCalledTimes(1);
        expect(onDelete).toHaveBeenCalledWith(1);
    });
});
