export interface RevenueStream {
    name: string;
    description: string;
    revenue_type: string;
    estimated_percentage?: number | null;
}

export interface RevenueStreamRequest {
    company_name: string;
    model_id?: string;
}

export interface RevenueStreamResponse {
    company_name: string;
    summary: string;
    primary_currency: string;
    revenue_streams: RevenueStream[];
}