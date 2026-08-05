import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchClient } from '../client';

describe('fetchClient', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    it('makes a successful request and returns parsed JSON', async () => {
        const mockData = { id: 1, symbol: 'AAPL', company_name: 'Apple Inc.' };
        (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => mockData,
        });

        const result = await fetchClient('/tickers/1');

        expect(globalThis.fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/tickers/1', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(result).toEqual(mockData);
    });

    it('passes custom HTTP method, headers, and body', async () => {
        const mockResponse = { id: 2, symbol: 'AMD', company_name: 'AMD Inc.' };
        (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => mockResponse,
        });

        const bodyData = { symbol: 'AMD', company_name: 'AMD Inc.' };
        const result = await fetchClient('/tickers', {
            method: 'POST',
            headers: { 'X-Custom-Header': 'test-value' },
            body: JSON.stringify(bodyData),
        });

        expect(globalThis.fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/tickers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Custom-Header': 'test-value',
            },
            body: JSON.stringify(bodyData),
        });
        expect(result).toEqual(mockResponse);
    });

    it('returns an empty object on HTTP status 204 (No Content)', async () => {
        (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            status: 204,
        });

        const result = await fetchClient('/tickers/1', { method: 'DELETE' });
        expect(result).toEqual({});
    });

    it('throws error with detail string when response is not ok', async () => {
        (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: async () => ({ detail: 'Invalid ticker symbol' }),
        });

        await expect(fetchClient('/tickers')).rejects.toThrow('Invalid ticker symbol');
    });

    it('throws error with stringified detail object when detail is complex object', async () => {
        const complexDetail = [{ loc: ['body', 'symbol'], msg: 'field required' }];
        (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: false,
            status: 422,
            json: async () => ({ detail: complexDetail }),
        });

        await expect(fetchClient('/tickers')).rejects.toThrow(JSON.stringify(complexDetail));
    });

    it('throws fallback error message when response is not ok and JSON parsing fails', async () => {
        (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => {
                throw new Error('Not JSON');
            },
        });

        await expect(fetchClient('/tickers')).rejects.toThrow('HTTP Error Status: 500');
    });
});
