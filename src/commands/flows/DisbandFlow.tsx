import { useEffect, useState } from "react";
import { disband } from "../../api";
import MilitaryView from "../../components/MilitaryView/MilitaryView";

function DisbandFlow({territory}: {territory: string | null}) {
    const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [militaryReset, setMilitaryReset] = useState(0);

    useEffect(() => {
        setSelectedUnits([]);
        setSuccess("");
        setError("");
    }, []);

    const handleDisband = async () => {
        if (selectedUnits.length !== 1) {
            setError("You must select exactly one unit to disband.");
            return;
        }

        setLoading(true);
        setSuccess("");
        setError("");
        setMilitaryReset(value => value + 1);

        try {
            const resp = await disband(selectedUnits[0]);

            if (resp["success"]) {
                setSuccess("Unit disbanded successfully.");
                setSelectedUnits([]);
            } else {
                setError(resp["detail"] ?? "Failed to disband unit.");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to disband unit.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="disband-flow">
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
                    resetKey={militaryReset}
                />

                <button
                    className="action-button"
                    onClick={handleDisband}
                    disabled={loading}
                >
                    {loading ? "Disbanding..." : "Disband"}
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

export default DisbandFlow;