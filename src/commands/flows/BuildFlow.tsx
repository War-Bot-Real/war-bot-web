import { useEffect, useState } from "react";
import { build, getShop } from "../../api";
import type { Territory } from "../../types/Territory";

function BuildFlow({ territory }: { territory: Territory | null }) {
    const [terrInput, setTerrInput] = useState("");
    const [building, setBuilding] = useState("");
    const [buildings, setBuildings] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadBuildings = async () => {
            try {
                const shop = await getShop();
                setBuildings(Object.keys(shop.Buildings));
            } catch (loadError) {
                console.error("Failed to load buildings:", loadError);
                setError("Failed to load building types.");
            }
        };

        loadBuildings();
    }, []);

    const handleBuild = async () => {
        setSuccess("");
        setError("");

        const territoryName =
            territory === null ? terrInput : territory.name;

        if (!territoryName) {
            setError("Please select or enter a territory.");
            return;
        }

        if (!building) {
            setError("Please select or enter a building.");
            return;
        }

        setLoading(true);

        try {
            const response = await build(territoryName, building);

            if (response["success"]) {
                setSuccess(
                    `Successfully built ${building} in ${territoryName}.`
                );
            } else {
                setError(
                    response["detail"] ?? "Failed to build."
                );
            }
        } catch (buildError) {
            setError(
                buildError instanceof Error
                    ? buildError.message
                    : "Failed to build."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="command-flow build-flow">
            <p className="command-subtitle">
                Build a structure in a territory you own.
            </p>

            <div className="command-form">
                <label>
                    Territory
                    <input
                        type="text"
                        value={
                            territory === null
                                ? terrInput
                                : territory.name
                        }
                        onChange={(event) => {
                            setTerrInput(event.target.value);
                            setError("");
                            setSuccess("");
                        }}
                        disabled={loading || territory !== null}
                        placeholder="Territory"
                    />
                </label>

                <label>
                    Building
                    <input
                        type="text"
                        list="building-types"
                        value={building}
                        onChange={(event) => {
                            setBuilding(event.target.value);
                            setError("");
                            setSuccess("");
                        }}
                        disabled={loading}
                        placeholder="Select or enter a building"
                    />
                </label>

                <datalist id="building-types">
                    {buildings.map((buildingName) => (
                        <option
                            key={buildingName}
                            value={buildingName}
                        />
                    ))}
                </datalist>

                <button
                    className="action-button"
                    onClick={handleBuild}
                    disabled={loading}
                >
                    {loading ? "Building..." : "Build"}
                </button>
            </div>

            {success && (
                <p className="command-success">{success}</p>
            )}
            {error && (
                <p className="command-error">{error}</p>
            )}
        </div>
    );
}

export default BuildFlow;
