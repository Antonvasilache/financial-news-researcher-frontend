import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RevenueResearch } from '../RevenueResearch';
import type { RevenueStreamResponse } from '../../types/research';

describe('RevenueResearch', () => {
    const mockResearchData: RevenueStreamResponse = {
        company_name: 'Apple Inc.',
        summary: 'Major technology vendor with hardware and services.',
        primary_currency: 'USD',
        revenue_streams: [
            {
                name: 'iPhone',
                description: 'Sales of iPhone devices',
                revenue_type: 'Hardware',
                estimated_percentage: 52,
            },
            {
                name: 'Services',
                description: 'App Store, Apple Music, iCloud',
                revenue_type: 'Services',
                estimated_percentage: null,
            },
        ],
    };

    it('renders form with default company name', () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        render(
            <RevenueResearch
                onSubmit={onSubmit}
                isLoading={false}
                researchData={null}
                error={null}
            />
        );

        expect(screen.getByRole('heading', { name: /analyze company revenue streams/i })).toBeInTheDocument();
        const input = screen.getByLabelText(/company name/i) as HTMLInputElement;
        expect(input.value).toBe('Apple Inc.');
        expect(screen.getByRole('button', { name: /analyze revenue/i })).toBeInTheDocument();
    });

    it('shows validation error when company name is empty', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        render(
            <RevenueResearch
                onSubmit={onSubmit}
                isLoading={false}
                researchData={null}
                error={null}
            />
        );

        const input = screen.getByLabelText(/company name/i);
        await user.clear(input);
        await user.click(screen.getByRole('button', { name: /analyze revenue/i }));

        await waitFor(() => {
            expect(screen.getByText('Company name is required')).toBeInTheDocument();
        });
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits form with entered company name', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        render(
            <RevenueResearch
                onSubmit={onSubmit}
                isLoading={false}
                researchData={null}
                error={null}
            />
        );

        const input = screen.getByLabelText(/company name/i);
        await user.clear(input);
        await user.type(input, 'Microsoft Corp.');
        await user.click(screen.getByRole('button', { name: /analyze revenue/i }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                { company_name: 'Microsoft Corp.' },
                expect.anything()
            );
        });
    });

    it('disables submit button and displays loading text when isLoading is true', () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        render(
            <RevenueResearch
                onSubmit={onSubmit}
                isLoading={true}
                researchData={null}
                error={null}
            />
        );

        const button = screen.getByRole('button', { name: /querying llm.../i });
        expect(button).toBeDisabled();
    });

    it('displays error banner when error prop is provided', () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        render(
            <RevenueResearch
                onSubmit={onSubmit}
                isLoading={false}
                researchData={null}
                error="Failed to connect to AI backend"
            />
        );

        expect(screen.getByText('Failed to connect to AI backend')).toBeInTheDocument();
    });

    it('renders research results when researchData prop is provided', () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        render(
            <RevenueResearch
                onSubmit={onSubmit}
                isLoading={false}
                researchData={mockResearchData}
                error={null}
            />
        );

        expect(screen.getByText('Apple Inc. Revenue Breakdown')).toBeInTheDocument();
        expect(screen.getByText('Major technology vendor with hardware and services.')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();

        // Revenue streams
        expect(screen.getByText('iPhone')).toBeInTheDocument();
        expect(screen.getByText('Hardware')).toBeInTheDocument();
        expect(screen.getByText('Sales of iPhone devices')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 5, name: 'Services' })).toBeInTheDocument();
        expect(screen.getByText('App Store, Apple Music, iCloud')).toBeInTheDocument();
        expect(screen.queryByText(/Est\. Share:/)).toBeInTheDocument(); // Only iPhone has Est. Share
        expect(screen.getAllByText('Est. Share: 52')).toHaveLength(1);
    });
});
