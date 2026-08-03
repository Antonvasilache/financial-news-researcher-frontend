import type { TickerResponse } from "../types/ticker";
import { TickerItem } from "./TickerItem";

interface TickerListProps {
    tickers: TickerResponse[];
    onDelete: (id: number) => Promise<void>
}

export const TickerList = ({ tickers, onDelete }: TickerListProps) => {
    if (tickers.length === 0) {
        return <p>No tickers currently tracked</p>
    }

    return (
        <ul className="ticker-list">
            {tickers.map((ticker) => (
                <TickerItem key={ticker.id} ticker={ticker} onDelete={onDelete} />
            ))}
        </ul>
    );
}