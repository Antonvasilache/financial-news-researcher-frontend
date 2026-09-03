export interface TickerBase {
    symbol: string;
    company_name: string;
}

export type TickerCreate = TickerBase;

export interface TickerResponse extends TickerBase {
    id: number;
    is_active: boolean;
    created_at: string;
}