
import { useEffect, useState } from "react";
import { merge } from "../../api";
import MilitaryView from "../../components/MilitaryView/MilitaryView";

function MergeFlow({ territory }: { territory: string | null }) {
    const [units, setUnits] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [militaryReset, setMilitaryReset] = useState(0);

    useEffect(() => {
        setSuccess("");
        setError("");
    }, []);

    const handleMerge = async () => {
        if (loading) return;

        if (units.length < 2) {
            setError("You must select at least two units to merge.");
            return;
        }

        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const resp = await merge(units);

            if (resp["success"]) {
                setSuccess("Units merged successfully.");

                // Clear the selection after a successful merge.
                setUnits([]);

                // Close and refresh MilitaryView.
                setMilitaryReset(value => value + 1);
            } else {
                setError(resp["detail"] ?? "Failed to merge units.");
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to merge units."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="command-flow merge-flow">
            <div className="command-form">
                <div>
                    <label className="unit-header">
                        Units Selected
                    </label>

                    <div className="unit-labels">
                        {units.length === 0
                            ? "None Selected"
                            : units.map(unit => (
                                <span
                                    className="unit-label"
                                    key={unit}
                                >
                                    {unit}
                                </span>
                            ))
                        }
                    </div>
                </div>

                {/* Select units BEFORE merging. */}
                <div className="merge-military-selector">
                    <MilitaryView
                        selectedUnits={units}
                        setSelectedUnits={setUnits}
                        canSelectMultiple={true}
                        territory={territory}
                        resetKey={militaryReset}
                    />
                </div>

                {/* Merge button appears below the selector. */}
                <button
                    type="button"
                    className="action-button"
                    onClick={handleMerge}
                    disabled={loading || units.length < 2}
                >
                    {loading ? "Merging..." : "Merge"}
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

export default MergeFlow;
