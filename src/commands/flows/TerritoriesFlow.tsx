import { useEffect, useState } from "react";
import { getNationTerritories } from "../../api";
import type { Territory } from "../../types/Territory";

interface TerritoriesFlowProps {
    nation: string | null;
}

function TerritoriesFlow({ nation }: TerritoriesFlowProps) {
    const [territories, setTerritories] = useState<Territory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!nation) {
            setTerritories([]);
            return;
        }

        const loadTerritories = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getNationTerritories(nation);
                setTerritories(data);
            } catch (error) {
                console.error("Failed to load territories:", error);
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load territories."
                );
            } finally {
                setLoading(false);
            }
        };

        loadTerritories();
    }, [nation]);

    if (!nation) {
        return <p>Select a nation to view its territories.</p>;
    }

    if (loading) {
        return <p>Loading territories...</p>;
    }

    if (error) {
        return <p className="command-error">{error}</p>;
    }

    if (territories.length === 0) {
        return <p>No territories found.</p>;
    }

    return (
        <div className="territories-flow">
            {territories.map((territory) => (
                <div className="territory-list-item" key={territory.name}>
                    <strong>{territory.name}</strong>

                    <div>
                        Buildings:{" "}
                        {territory.buildings.length > 0
                            ? territory.buildings.map(String).join(", ")
                            : "None"}
                    </div>

                    <div>
                        Coastal: {territory.coast.length > 0 ? "Yes" : "No"}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TerritoriesFlow;