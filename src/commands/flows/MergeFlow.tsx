import { useEffect, useState } from "react";
import { merge } from "../../api";
import MilitaryView from "../../components/MilitaryView/MilitaryView";

function MergeFlow() {
    const [units, setUnits] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
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
                </label>
                <label>
                    {
                      selectedUnits.length === 0 ? "None Selected" : selectedUnits.map((unit) => 
                        <span className="unit-label"> {unit} </span>
                      ) 
                    } 
                </label>
                
                <MilitaryView
                    selectedUnits={selectedUnits}
                    setSelectedUnits={setSelectedUnits}
                />

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