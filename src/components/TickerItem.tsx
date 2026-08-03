import type { TickerResponse } from "../types/ticker";

interface TickerItemProps {
    ticker: TickerResponse;
    onDelete: (id: number) => Promise<void>
}

export const TickerItem = ({ ticker, onDelete }: TickerItemProps) => {
    return (
        <li className="ticker-item">
            <div>
                <strong>{ticker.symbol}</strong> — {ticker.company_name}
            </div>
            <button onClick={() => onDelete(ticker.id)}>Delete</button>
        </li>
    )
}