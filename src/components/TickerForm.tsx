import type { TickerCreate } from "../types/ticker";
import { useForm } from "react-hook-form";

interface TickerFormProps {
    onSubmit: (ticker: TickerCreate) => Promise<void>;
    isLoading: boolean;
}

export const TickerForm = ({ onSubmit, isLoading }: TickerFormProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TickerCreate>();

    const handleFormSubmit = async (data: TickerCreate) => {
        await onSubmit(data);
        reset();
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="ticker-form">
            <div>
                <label htmlFor="symbol">Ticker Symbol</label>
                <input
                    id="symbol"
                    placeholder="e.g. AMD"
                    {...register("symbol", {
                        required: "Ticker symbol is required",
                        maxLength: { value: 5, message: "Symbol max length is 5 characters" },
                    })}
                />
                {errors.symbol && <span className="error">{errors.symbol.message}</span>}
            </div>

            <div>
                <label htmlFor="company_name">Company Name</label>
                <input
                    id="company_name"
                    placeholder="e.g. Advanced Micro Devices, Inc."
                    {...register("company_name", {
                        required: "Company name is required",
                    })}
                />
                {errors.company_name && <span className="error">{errors.company_name.message}</span>}
            </div>

            <button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Ticker"}
            </button>
        </form>
    );
}