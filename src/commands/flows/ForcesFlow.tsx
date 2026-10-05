import { useEffect, useState } from "react";
import { getForces } from "../../api";
import type { Unit } from "../../types/Unit";

interface ForcesResult {
    territories: Record<string, Unit[]>;
    abroad: Record<string, Unit[]>;
    carriers: Record<string, Unit[]>;
}

interface ForcesFlowProps {
    domain?: "ground" | "naval" | "air";
}

function ForcesFlow({ domain }: ForcesFlowProps) {
    const [forces, setForces] = useState<ForcesResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadForces = async () => {
            setForces(null);
            setError(null);

            try {
                const data = await getForces(domain);

                if (!cancelled) {
                    setForces(data.result);
                }
            } catch (error) {
                console.error("Failed to load forces:", error);

                if (!cancelled) {
                    setError("Failed to load forces.");
                }
            }
        };

        loadForces();

        return () => {
            cancelled = true;
        };
    }, [domain]);

    const loadingText =
        domain === "ground"
            ? "Loading army..."
            : domain === "naval"
              ? "Loading navy..."
              : domain === "air"
                ? "Loading air force..."
                : "Loading forces...";

    if (error) {
        return (
            <div className="forces-flow">
                <p className="command-empty">{error}</p>
            </div>
        );
    }

    if (forces === null) {
        return (
            <div className="forces-flow">
                <p>{loadingText}</p>
            </div>
        );
    }

    const territories = Object.entries(forces.territories);

    if (territories.length === 0) {
        return (
            <div className="forces-flow">
                <p className="command-empty">No forces found.</p>
            </div>
        );
    }

    return (
        <div className="forces-flow">
            {territories.map(([territory, units]) => (
                <div key={territory}>
                    <h3>{territory}</h3>

                    <div className="command-list">
                        {units.map((unit) => (
                            <div
                                className="command-row"
                                key={unit.name}
                            >
                                <span>
                                    {unit.name} — {unit.type}
                                </span>

                                <span>
                                    {unit.quantity.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ForcesFlow;