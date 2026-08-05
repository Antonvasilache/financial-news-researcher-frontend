import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tickerApi } from '../tickerApi';
import * as clientModule from '../client';
import type { TickerCreate, TickerResponse } from '../../types/ticker';

describe('tickerApi', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('getAll calls fetchClient with /tickers', async () => {
        const mockTickers: TickerResponse[] = [
            { id: 1, symbol: 'AAPL', company_name: 'Apple Inc.', is_active: true, created_at: '2026-01-01' },
        ];
        const spy = vi.spyOn(clientModule, 'fetchClient').mockResolvedValueOnce(mockTickers);

        const result = await tickerApi.getAll();

        expect(spy).toHaveBeenCalledWith('/tickers');
        expect(result).toEqual(mockTickers);
    });

    it('getById calls fetchClient with /tickers/:id', async () => {
        const mockTicker: TickerResponse = {
            id: 10,
            symbol: 'MSFT',
            company_name: 'Microsoft Corp.',
            is_active: true,
            created_at: '2026-01-01',
        };
        const spy = vi.spyOn(clientModule, 'fetchClient').mockResolvedValueOnce(mockTicker);

        const result = await tickerApi.getById(10);

        expect(spy).toHaveBeenCalledWith('/tickers/10');
        expect(result).toEqual(mockTicker);
    });

    it('create calls fetchClient with /tickers and POST method', async () => {
        const createData: TickerCreate = { symbol: 'NVDA', company_name: 'NVIDIA Corporation' };
        const mockResponse: TickerResponse = {
            id: 5,
            ...createData,
            is_active: true,
            created_at: '2026-01-01',
        };

        const spy = vi.spyOn(clientModule, 'fetchClient').mockResolvedValueOnce(mockResponse);

        const result = await tickerApi.create(createData);

        expect(spy).toHaveBeenCalledWith('/tickers', {
            method: 'POST',
            body: JSON.stringify(createData),
        });
        expect(result).toEqual(mockResponse);
    });

    it('delete calls fetchClient with /tickers/:id and DELETE method', async () => {
        const spy = vi.spyOn(clientModule, 'fetchClient').mockResolvedValueOnce({});

        await tickerApi.delete(42);

        expect(spy).toHaveBeenCalledWith('/tickers/42', {
            method: 'DELETE',
        });
    });
});
