import { useEffect, useState } from "react";
import { merge } from "../../api";

function MergeFlow() {
    const [units, setUnits] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setUnits("");
        setSuccess("");
        setError("");
    }, []);

    const handleMerge = async () => {
        const selectedUnits = units
            .split(",")
            .map(unit => unit.trim())
            .filter(Boolean);

        if (selectedUnits.length < 2) {
            setError("You must select at least two units to merge.");
            return;
        }

        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const resp = await merge(selectedUnits);

            if (resp["success"]) {
                setSuccess("Units merged successfully.");
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
        <div className="merge-flow">
            <div className="command-form">
                <label>
                    Units
                    <input
                        type="text"
                        value={units}
                        onChange={(event) => {
                            setUnits(event.target.value);
                            setError("");
                            setSuccess("");
                        }}
                        disabled={loading}
                        placeholder="Enter unit names separated by commas"
                    />
                </label>

                <button
                    className="command-button"
                    onClick={handleMerge}
                    disabled={loading}
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