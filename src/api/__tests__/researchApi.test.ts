import { describe, it, expect, vi } from 'vitest';
import { researchApi } from '../researchApi';
import * as clientModule from '../client';
import type { RevenueStreamResponse } from '../../types/research';

describe('researchApi', () => {
    it('getRevenueStreams calls fetchClient with correct endpoint and payload', async () => {
        const mockResponse: RevenueStreamResponse = {
            company_name: 'Apple Inc.',
            summary: 'Tech company leading in hardware and services.',
            primary_currency: 'USD',
            revenue_streams: [
                {
                    name: 'iPhone',
                    description: 'Smartphone sales',
                    revenue_type: 'Product',
                    estimated_percentage: 52,
                },
            ],
        };

        const fetchClientSpy = vi.spyOn(clientModule, 'fetchClient').mockResolvedValueOnce(mockResponse);

        const payload = { company_name: 'Apple Inc.', model_id: 'gpt-4o' };
        const result = await researchApi.getRevenueStreams(payload);

        expect(fetchClientSpy).toHaveBeenCalledWith('/api/v1/research/revenue-streams', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        expect(result).toEqual(mockResponse);
    });
});
