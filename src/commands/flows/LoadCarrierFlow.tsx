import { useState } from "react";
import { loadCarrier } from "../../api";
import MilitaryView from "../../components/MilitaryView/MilitaryView";

function LoadCarrierFlow() {
    const [carrier, setCarrier] = useState<string[]>([]);
    const [units, setUnits] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [militaryReset, setMilitaryReset] = useState(0);
    const [carrierReset, setCarrierReset] = useState(0);
    const [unitsReset, setUnitsReset] = useState(0);

    const handleLoad = async () => {
        setSuccess("");
        setError("");

        if (carrier.length !== 1) {
            setError("Select exactly one carrier.");
            return;
        }

        if (units.length === 0) {
            setError("Select at least one unit to load.");
            return;
        }

        setLoading(true);
        setMilitaryReset((value) => value + 1);

        try {
            const response = await loadCarrier(carrier[0], units);

            if (response["success"]) {
                setSuccess(
                    `Successfully loaded ${units.length} unit${units.length === 1 ? "" : "s"} onto ${carrier[0]}.`
                );
                setCarrier([]);
                setUnits([]);
            } else {
                setError(response["detail"] ?? "Failed to load carrier.");
            }
        } catch (loadError) {
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : "Failed to load carrier."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="command-flow load-carrier-flow">
            <p className="command-subtitle">
                Load units onto a naval carrier.
            </p>

            <div className="command-form">
                <div>
                    <label className="unit-header">Carrier</label>
                    <label>
                        <span className="unit-labels">
                            {carrier.length > 0 ? carrier[0] : "Not Selected"}
                        </span>
                    </label>
                </div>

                <MilitaryView
                    selectedUnits={carrier}
                    setSelectedUnits={setCarrier}
                    canSelectMultiple={false}
                    initialDomain="naval"
                    lockBranch={true}
                    resetKey={carrierReset || militaryReset}
                    onOpenChange={(open) => {
                        if (open) {
                            setUnitsReset((value) => value + 1);
                        }
                    }}
                />

                <div>
                    <label className="unit-header">Units</label>
                    <label>
                        <span className="unit-labels">
                            {units.length === 0
                                ? "None Selected"
                                : units.join(", ")}
                        </span>
                    </label>
                </div>

                <MilitaryView
                    selectedUnits={units}
                    setSelectedUnits={setUnits}
                    canSelectMultiple={true}
                    resetKey={unitsReset || militaryReset}
                    onOpenChange={(open) => {
                        if (open) {
                            setCarrierReset((value) => value + 1);
                        }
                    }}
                />

                <button
                    className="action-button"
                    onClick={handleLoad}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Load Carrier"}
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

export default LoadCarrierFlow;
