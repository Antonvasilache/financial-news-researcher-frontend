import { researchApi } from "../api/researchApi";
import type {
  RevenueStreamRequest,
  RevenueStreamResponse,
} from "../types/research";

export async function fetchRevenueStreams(
  payload: RevenueStreamRequest
): Promise<RevenueStreamResponse> {
  return researchApi.getRevenueStreams(payload);
}
