import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchTickers,
  fetchTickerById,
  createTicker,
  deleteTicker,
} from "../tickerService";
import { tickerApi } from "../../api/tickerApi";
import type { TickerCreate, TickerResponse } from "../../types/ticker";

vi.mock("../../api/tickerApi", () => ({
  tickerApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("tickerService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchTickers delegates to tickerApi.getAll", async () => {
    const mockTickers: TickerResponse[] = [
      { id: 1, symbol: "AAPL", company_name: "Apple Inc." },
    ];
    vi.mocked(tickerApi.getAll).mockResolvedValueOnce(mockTickers);

    const result = await fetchTickers();

    expect(tickerApi.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockTickers);
  });

  it("fetchTickerById delegates to tickerApi.getById", async () => {
    const mockTicker: TickerResponse = {
      id: 2,
      symbol: "MSFT",
      company_name: "Microsoft Corp",
    };
    vi.mocked(tickerApi.getById).mockResolvedValueOnce(mockTicker);

    const result = await fetchTickerById(2);

    expect(tickerApi.getById).toHaveBeenCalledWith(2);
    expect(result).toEqual(mockTicker);
  });

  it("createTicker delegates to tickerApi.create", async () => {
    const payload: TickerCreate = { symbol: "NVDA", company_name: "NVIDIA Corp" };
    const created: TickerResponse = { id: 3, ...payload };
    vi.mocked(tickerApi.create).mockResolvedValueOnce(created);

    const result = await createTicker(payload);

    expect(tickerApi.create).toHaveBeenCalledWith(payload);
    expect(result).toEqual(created);
  });

  it("deleteTicker delegates to tickerApi.delete", async () => {
    vi.mocked(tickerApi.delete).mockResolvedValueOnce(undefined);

    await deleteTicker(5);

    expect(tickerApi.delete).toHaveBeenCalledWith(5);
  });
});
