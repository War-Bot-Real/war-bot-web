import { useEffect, useState } from "react";
import { resflow } from "../../api";
import { formatTime } from "../../utils";

interface ResourceFlowData {
    period: number;
    ideal: Record<string, number>;
    actual: Record<string, number>;
}


// TODO: Update to actual emojis (they are pngs from assets)
const resourceEmojis: Record<string, string> = {
    Oil: "🛢️",
    Coal: "⚫",
    Iron: "⛏️",
    Fuel: "⛽",
    Steel: "🏗️",
};

function ResflowFlow() {
    const [flow, setFlow] = useState<ResourceFlowData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadResourceFlow = async () => {
            try {
                setFlow(await resflow());
            } catch (loadError) {
                console.error("Failed to load resource flow:", loadError);
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Failed to load resource flow."
                );
            }
        };

        loadResourceFlow();
    }, []);

    if (error) {
        return <p className="command-empty">{error}</p>;
    }

    if (flow === null) {
        return <p>Loading resource flow...</p>;
    }

    const resources = [...new Set([
        ...Object.keys(flow.ideal),
        ...Object.keys(flow.actual),
    ])].sort((a, b) => {
        const resourceOrder = ["Oil", "Coal", "Iron", "Fuel", "Steel"];
        const aOrder = resourceOrder.indexOf(a);
        const bOrder = resourceOrder.indexOf(b);

        if (aOrder !== -1 || bOrder !== -1) {
            return (aOrder === -1 ? resourceOrder.length : aOrder)
                - (bOrder === -1 ? resourceOrder.length : bOrder);
        }

        return a.localeCompare(b);
    });

    return (
        <div className="resflow-flow">
            <h2>Resource Flow</h2>
            <p className="command-subtitle">
                Production and demand per {formatTime(flow.period)}.
                A negative difference means production falls short of ideal demand.
            </p>

            {resources.length === 0 ? (
                <p className="command-empty">No resource flow data available.</p>
            ) : (
                <div className="command-list">
                    <div className="resflow-row resflow-header" aria-hidden="true">
                        <span>Resource</span>
                        <span>Ideal</span>
                        <span>Actual</span>
                        <span>Difference</span>
                    </div>
                    {resources.map((resource) => {
                        const ideal = flow.ideal[resource] ?? 0;
                        const actual = flow.actual[resource] ?? 0;
                        const difference = actual - ideal;
                        const status = difference < 0 ? "shortage" : difference > 0 ? "surplus" : "balanced";

                        return (
                            <div
                                className={`command-row resflow-row resflow-${status}`}
                                key={resource}
                            >
                                <span>
                                    {resourceEmojis[resource] ?? "📦"} {resource}
                                </span>
                                <span>{ideal.toLocaleString()}</span>
                                <span>{actual.toLocaleString()}</span>
                                <span>
                                    {difference > 0 ? "+" : ""}
                                    {difference.toLocaleString()}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ResflowFlow;