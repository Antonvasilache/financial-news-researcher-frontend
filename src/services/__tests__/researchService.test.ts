import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchRevenueStreams } from "../researchService";
import { researchApi } from "../../api/researchApi";
import type {
  RevenueStreamRequest,
  RevenueStreamResponse,
} from "../../types/research";

vi.mock("../../api/researchApi", () => ({
  researchApi: {
    getRevenueStreams: vi.fn(),
  },
}));

describe("researchService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchRevenueStreams delegates to researchApi.getRevenueStreams", async () => {
    const payload: RevenueStreamRequest = { company_name: "Apple Inc." };
    const mockResponse: RevenueStreamResponse = {
      company_name: "Apple Inc.",
      summary: "Revenue breakdown summary",
      primary_currency: "USD",
      revenue_streams: [
        {
          name: "iPhone",
          description: "Smartphone sales",
          revenue_type: "Hardware",
          estimated_percentage: "50%",
        },
      ],
    };

    vi.mocked(researchApi.getRevenueStreams).mockResolvedValueOnce(mockResponse);

    const result = await fetchRevenueStreams(payload);

    expect(researchApi.getRevenueStreams).toHaveBeenCalledWith(payload);
    expect(result).toEqual(mockResponse);
  });
});
