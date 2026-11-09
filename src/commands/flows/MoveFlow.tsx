import { useState } from "react";
import { move } from "../../api";
import MilitaryView from "../../components/MilitaryView/MilitaryView";
import type { Territory } from "../../types/Territory";

function MoveFlow({ territory }: { territory: Territory | null }) {
    const [target, setTarget] = useState("");
    const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [militaryReset, setMilitaryReset] = useState(0);

    const handleMove = async () => {
        const targetTerritory = territory?.name ?? target.trim();

        if (!targetTerritory) {
            setSuccess("");
            setError("Select a territory to move units to.");
            return;
        }

        if (selectedUnits.length === 0) {
            setSuccess("");
            setError("Select units to move.");
            return;
        }

        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const response = await move(targetTerritory, selectedUnits);

            if (response.success) {
                setSuccess(`Units moved to ${targetTerritory} successfully.`);
                setSelectedUnits([]);
                setMilitaryReset(value => value + 1);
            } else {
                setError(response.detail ?? "Failed to move units.");
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to move units."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="move-flow">
            <div className="command-form">
                <label>
                    Destination
                    <input
                        type="text"
                        onChange={(event) => {
                            setTarget(event.target.value);
                            setError("");
                            setSuccess("");
                        }}
                        disabled={loading || territory !== null}
                        placeholder="Territory"
                        value={territory?.name ?? target}
                    />
                </label>

                <div>
                    <label className="unit-header">
                        Units Selected
                    </label>
                    <label className="unit-labels">
                        {selectedUnits.length === 0
                            ? "None Selected"
                            : selectedUnits.map(unit => (
                                <span className="unit-label" key={unit}>
                                    {unit}
                                </span>
                            ))}
                    </label>
                </div>

                <MilitaryView
                    selectedUnits={selectedUnits}
                    setSelectedUnits={setSelectedUnits}
                    canSelectMultiple={true}
                    resetKey={militaryReset}
                    territory={territory?.name}
                />

                <button
                    className="action-button"
                    onClick={handleMove}
                    disabled={loading}
                >
                    {loading ? "Moving..." : "Move"}
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

export default MoveFlow;