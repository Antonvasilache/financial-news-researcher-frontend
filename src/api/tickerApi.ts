import type { TickerCreate, TickerResponse } from "../types/ticker";
import { fetchClient } from "./client";

export const tickerApi = {
    getAll: (): Promise<TickerResponse[]> => {
        return fetchClient<TickerResponse[]>('/tickers');
    },

    getById: (id: number): Promise<TickerResponse> => {
        return fetchClient<TickerResponse>(`/tickers/${id}`);
    },

    create: (data: TickerCreate): Promise<TickerResponse> => {
        return fetchClient<TickerResponse>('/tickers', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    delete: (id: number): Promise<void> => {
        return fetchClient<void>(`/tickers/${id}`, {
            method: 'DELETE'
        });
    },
}