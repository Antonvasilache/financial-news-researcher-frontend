import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TickerForm } from '../TickerForm';

describe('TickerForm', () => {
    it('renders form inputs and submit button', () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        render(<TickerForm onSubmit={onSubmit} isLoading={false} />);

        expect(screen.getByLabelText(/ticker symbol/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add ticker/i })).toBeInTheDocument();
    });

    it('displays validation error messages when submitted empty', async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        render(<TickerForm onSubmit={onSubmit} isLoading={false} />);

        fireEvent.submit(screen.getByRole('button', { name: /add ticker/i }));

        await waitFor(() => {
            expect(screen.getByText('Ticker symbol is required')).toBeInTheDocument();
            expect(screen.getByText('Company name is required')).toBeInTheDocument();
        });

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('displays error message when symbol exceeds 5 characters', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        render(<TickerForm onSubmit={onSubmit} isLoading={false} />);

        const symbolInput = screen.getByLabelText(/ticker symbol/i);
        const nameInput = screen.getByLabelText(/company name/i);

        await user.type(symbolInput, 'TOOLONG');
        await user.type(nameInput, 'Test Company');
        await user.click(screen.getByRole('button', { name: /add ticker/i }));

        await waitFor(() => {
            expect(screen.getByText('Symbol max length is 5 characters')).toBeInTheDocument();
        });

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with form data and resets inputs on valid submission', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        render(<TickerForm onSubmit={onSubmit} isLoading={false} />);

        const symbolInput = screen.getByLabelText(/ticker symbol/i) as HTMLInputElement;
        const nameInput = screen.getByLabelText(/company name/i) as HTMLInputElement;

        await user.type(symbolInput, 'AMD');
        await user.type(nameInput, 'Advanced Micro Devices, Inc.');
        await user.click(screen.getByRole('button', { name: /add ticker/i }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                symbol: 'AMD',
                company_name: 'Advanced Micro Devices, Inc.',
            });
        });

        await waitFor(() => {
            expect(symbolInput.value).toBe('');
            expect(nameInput.value).toBe('');
        });
    });

    it('disables submit button and shows loading text when isLoading is true', () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        render(<TickerForm onSubmit={onSubmit} isLoading={true} />);

        const button = screen.getByRole('button', { name: /adding.../i });
        expect(button).toBeDisabled();
    });
});
