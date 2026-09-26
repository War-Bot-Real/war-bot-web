import { useEffect, useState } from "react";
import { merge } from "../../api";
import MilitaryView from "../../components/MilitaryView/MilitaryView";

function MergeFlow({territory}: {territory: string | null}) {
    const [units, setUnits] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setSuccess("");
        setError("");
    }, []);

    const handleMerge = async () => {
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
                <div>
                  <label className="unit-header">
                      Units
                  </label>
                  <label className="unit-labels">
                      {
                        units.length === 0 ? "None Selected" : units.map((unit) => 
                          <span className="unit-label"> {unit} </span>
                        ) 
                      } 
                  </label>
                </div>
                
                <MilitaryView
                    selectedUnits={units}
                    setSelectedUnits={setUnits}
                    canSelectMultiple={true}
                    territory={territory}
                />

                <button
                    className="action-button"
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