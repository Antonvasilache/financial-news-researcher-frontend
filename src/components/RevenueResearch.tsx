import { useForm } from "react-hook-form";
import type { RevenueStreamRequest, RevenueStreamResponse } from "../types/research";

interface RevenueResearchProps {
    onSubmit: (data: RevenueStreamRequest) => Promise<void>;
    isLoading: boolean;
    researchData: RevenueStreamResponse | null;
    error: string | null;
}

export const RevenueResearch = ({
    onSubmit,
    isLoading,
    researchData,
    error,
}: RevenueResearchProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors } } = useForm<RevenueStreamRequest>({
            defaultValues: {
                company_name: "Apple Inc."
            }
        })

    return (
        <div className="research-container">
            <h2>Analyze Company Revenue Streams</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="research-form">
                <div>
                    <label htmlFor="company_name">Company Name</label>
                    <input
                        id="company_name"
                        placeholder="e.g. Apple Inc. or AMD"
                        {...register("company_name", {
                            required: "Company name is required"
                        })}
                    />
                    {errors.company_name && (
                        <span className="error">{errors.company_name.message}</span>
                    )}
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Querying LLM..." : "Analyze Revenue"}
                </button>
            </form>

            {error && <div className="error-banner">{error}</div>}

            {researchData && (
                <div className="research-results">
                    <h3>{researchData.company_name} Revenue Breakdown</h3>
                    <p className="summary">{researchData.summary}</p>
                    <p>
                        <strong>Primary Currency:</strong> {researchData.primary_currency}
                    </p>

                    <h4>Revenue Streams</h4>
                    <div className="streams-grid">
                        {researchData.revenue_streams.map((stream, idx) => (
                            <div key={idx} className="stream-card">
                                <h5>{stream.name}</h5>
                                <span className="badge">{stream.revenue_type}</span>
                                <p>{stream.description}</p>
                                {stream.estimated_percentage !== undefined &&
                                    stream.estimated_percentage !== null && (
                                        <div className="percentage">
                                            Est. Share: {stream.estimated_percentage}
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
} 