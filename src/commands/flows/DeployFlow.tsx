import { useState } from "react";
import { deploy } from "../../api";
import type { Territory } from "../../types/Territory";

function DeployFlow({ territory }: { territory: Territory | null }) {
    const [quan, setQuan] = useState(0);
    const [terrInput, setTerrInput] = useState("");
    const [unit, setUnit] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDeploy = async () => {
        setLoading(true);
        setSuccess(null);
        setError(null);

        const territoryName =
            territory === null
                ? terrInput
                : territory.Name;

        try {
            const data = await deploy(
                territoryName,
                unit,
                quan,
            );

            if (data["success"]) {
                setSuccess(
                    `Successfully deployed ${quan} ${unit} in ${territoryName}`
                );
            } else {
                setError(
                    data["detail"] ?? "Failed to deploy"
                );
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to deploy"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="deploy-flow">
            <h2>Deploy</h2>

            <p className="command-subtitle">
                Deploy a unit in a territory you own.
            </p>

            <div className="command-form">
                <label>
                    Unit Type
                    <input
                        type="text"
                        onChange={(event) => {
                            setUnit(event.target.value);
                            setError(null);
                            setSuccess(null);
                        }}
                        disabled={loading}
                        placeholder="Unit Type"
                        value={unit}
                    />
                </label>

                <label>
                    Territory
                    <input
                        type="text"
                        onChange={(event) => {
                            setTerrInput(event.target.value);
                            setError(null);
                            setSuccess(null);
                        }}
                        disabled={loading || territory !== null}
                        placeholder="Territory"
                        value={
                            territory === null
                                ? terrInput
                                : territory.Name
                        }
                    />
                </label>

                <label>
                    Quantity
                    <input
                        type="number"
                        min="1"
                        onChange={(event) => {
                            setQuan(
                                parseInt(event.target.value) || 0
                            );
                            setError(null);
                            setSuccess(null);
                        }}
                        disabled={loading}
                        placeholder="Quantity"
                        value={quan || ""}
                    />
                </label>

                <button
                    className="command-button"
                    onClick={handleDeploy}
                    disabled={loading}
                >
                    {loading ? "Deploying..." : "Deploy"}
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

export default DeployFlow;