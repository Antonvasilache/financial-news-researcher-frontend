import { tickerApi } from "../api/tickerApi";
import type { TickerCreate, TickerResponse } from "../types/ticker";

export async function fetchTickers(): Promise<TickerResponse[]> {
  return tickerApi.getAll();
}

export async function fetchTickerById(id: number): Promise<TickerResponse> {
  return tickerApi.getById(id);
}

export async function createTicker(data: TickerCreate): Promise<TickerResponse> {
  return tickerApi.create(data);
}

export async function deleteTicker(id: number): Promise<void> {
  return tickerApi.delete(id);
}
