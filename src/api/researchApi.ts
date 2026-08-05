import type { RevenueStreamRequest, RevenueStreamResponse } from "../types/research";
import { fetchClient } from "./client";

export const researchApi = {
    getRevenueStreams: (payload: RevenueStreamRequest): Promise<RevenueStreamResponse> => {
        return fetchClient<RevenueStreamResponse>('/api/v1/research/revenue-streams', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    }
}