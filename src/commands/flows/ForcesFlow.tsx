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
    selectedTerritory?: string | null;
}

function ForcesFlow({ domain, selectedTerritory }: ForcesFlowProps) {
    const [territoryFilter, setTerritoryFilter] = useState("All");
    const [theaterFilter, setTheaterFilter] = useState("");
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
            <div className="command-flow forces-flow">
                <p className="command-empty">{error}</p>
            </div>
        );
    }

    if (forces === null) {
        return (
            <div className="command-flow forces-flow">
                <p>{loadingText}</p>
            </div>
        );
    }

    const allTerritories = Object.entries(forces.territories);
    const selectedFilter = territoryFilter === "All" ? (selectedTerritory ?? "All") : territoryFilter;
    const territories = allTerritories.filter(([name]) =>
        (selectedFilter === "All" || name === selectedFilter) &&
        name.toLowerCase().includes(theaterFilter.toLowerCase())
    );

    return (
        <div className="command-flow forces-flow">
            <div className="forces-filters">
                <label>Territory <select value={territoryFilter} onChange={event => setTerritoryFilter(event.target.value)}>
                    <option value="All">{selectedTerritory ? `Selected on map: ${selectedTerritory}` : "All territories"}</option>
                    {allTerritories.map(([name]) => <option key={name} value={name}>{name}</option>)}
                </select></label>
                <label>Search location / theater <input value={theaterFilter} onChange={event => setTheaterFilter(event.target.value)} placeholder="Filter locations..." /></label>
            </div>
            {territories.length === 0 && <p className="command-empty">No matching forces.</p>}
            {territories.map(([territory, units]) => (
                <div key={territory}>
                    <h3 className="command-section-title">{territory}</h3>

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