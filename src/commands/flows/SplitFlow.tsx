import { useEffect, useState } from "react";
import { split } from "../../api";
import MilitaryView from "../../components/MilitaryView/MilitaryView";

function SplitFlow({territory}: {territory: string | null}) {
    const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
    const [parts, setParts] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setSelectedUnits([]);
        setParts("");
        setSuccess("");
        setError("");
    }, []);

    const handleSplit = async () => {
        if (selectedUnits.length !== 1) {
            setError("You must select exactly one unit to split.");
            return;
        }

        if (!parts.trim()) {
            setError("You must enter the number of parts.");
            return;
        }

        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const resp = await split(selectedUnits[0], parts);

            if (resp["success"]) {
                setSuccess("Unit split successfully.");
                setSelectedUnits([]);
                setParts("");
            } else {
                setError(resp["detail"] ?? "Failed to split unit.");
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to split unit."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="split-flow">
            <div className="command-form">
                <div>
                  <label className="unit-header">
                      Unit
                  </label>
                  <label>
                      <span className="unit-labels"> {selectedUnits.length > 0 ? selectedUnits[0] : "Not Selected"} </span>
                  </label>
                </div>
                <MilitaryView
                    selectedUnits={selectedUnits}
                    setSelectedUnits={setSelectedUnits}
                    canSelectMultiple={false}
                    territory={territory}
                />

                <label>
                    Parts
                    <input
                        type="number"
                        min="2"
                        value={parts}
                        onChange={(event) => {
                            setParts(event.target.value);
                            setError("");
                            setSuccess("");
                        }}
                        disabled={loading}
                        placeholder="Number of parts"
                    />
                </label>

                <button
                    className="action-button"
                    onClick={handleSplit}
                    disabled={loading}
                >
                    {loading ? "Splitting..." : "Split"}
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

export default SplitFlow;