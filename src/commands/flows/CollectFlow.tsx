import { useEffect, useState } from "react";
import { collect } from "../../api";
import type { IncomeResult } from "../../types/Income";
import { formatTime } from "../../utils";

const resourceEmojis: Record<string, string> = {
    Oil: "🛢️",
    Coal: "⚫",
    Iron: "⛏️",
    Fuel: "⛽",
    Steel: "🏗️",
};

function CollectFlow() {
    const [result, setResult] = useState<IncomeResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCollect = async () => {
            try {
                const data = await collect();
                if (!data.success) {
                    throw new Error(data.detail ?? "Failed to collect income.");
                }

                setResult(data.result);
            } catch (error) {
                console.error("Failed to collect income:", error);
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to collect income."
                );
            }
        };

        loadCollect();
    }, []);

    if (error) {
        return <p className="command-empty">{error}</p>;
    }

    if (result === null) {
        return <p>Collecting income...</p>;
    }

    return (
        <div className="income-flow">
            <h2>Income Collected</h2>
            <div className="command-list">
                <div className="command-row">
                    <span>Income</span>
                    <span>
                        {result.Income >= 0 ? "+" : "-"}$
                        {Math.abs(result.Income).toLocaleString()}
                    </span>
                </div>
                <div className="command-row">
                    <span>Balance</span>
                    <span>
                        {result.Balance < 0 ? "-" : ""}$
                        {Math.abs(result.Balance).toLocaleString()}
                    </span>
                </div>
                <div className="command-row">
                    <span>War Debts</span>
                    <span>${result["War Debts"].toLocaleString()}</span>
                </div>
                <div className="command-row">
                    <span>Stability</span>
                    <span>
                        {result.Stability.Total.toLocaleString()}%
                        {" ("}
                        {result.Stability.Change > 0 ? "+" : ""}
                        {result.Stability.Change.toLocaleString()}
                        {"%)"}
                    </span>
                </div>
                <div className="command-row">
                    <span>Political Power</span>
                    <span>
                        {result["Political Power"].Total.toLocaleString()}
                        {" ("}
                        {result["Political Power"].Change > 0 ? "+" : ""}
                        {result["Political Power"].Change.toLocaleString()}
                        {")"}
                    </span>
                </div>
            </div>

            <h3>Resources Collected</h3>
            <div className="command-list">
                {Object.entries(result.Resources).map(([resource, amount]) => (
                    <div className="command-row" key={resource}>
                        <span>
                            {resourceEmojis[resource] ?? "📦"} {resource}
                        </span>
                        <span>{amount.toLocaleString()}</span>
                    </div>
                ))}
            </div>
            <br/>
            <p className="command-subtitle income-period">
                Collected over the past {formatTime(result["Collected Until"] - result["Collected From"])}
            </p>
        </div>
    );
}

export default CollectFlow;
