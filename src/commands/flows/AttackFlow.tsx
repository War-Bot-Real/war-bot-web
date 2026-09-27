import { useEffect, useState } from "react";
import { attack } from "../../api";
import MilitaryView from "../../components/MilitaryView/MilitaryView";
import type { Territory } from "../../types/Territory";

function AttackFlow({terrInput}: {terrInput: Territory | null}) {
    const [territory, setTerritory] = useState<string>("");
    const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [militaryReset, setMilitaryReset] = useState(0);
    const [militaryOpen, setMilitaryOpen] = useState(false);

    useEffect(() => {
        setSelectedUnits([]);
        setSuccess("");
        setError("");
    }, []);

    useEffect(() => {
        console.log(militaryOpen);
        if (!militaryOpen) {
            setTerritory(terrInput ? terrInput.Name : "");
        }
    }, [terrInput])

    const handleAttack = async () => {
        if(!territory) {
          setSuccess("")
          setError("Select a territory to attack!")
          return
        }
        if(selectedUnits.length === 0) {
          setSuccess("")
          setError("Select units to attack with!")
          return
        }

        setLoading(true);
        setSuccess("");
        setError("");
        setMilitaryReset(value => value + 1);

        try {
            const resp = await attack(territory, selectedUnits);

            if (resp["success"]) {
                setSuccess("To be filled with successful attack message");
                setSelectedUnits([]);
            } else {
                setError(resp["detail"] ?? "Failed to attack.");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to attack.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="attack-flow">
            <div className="command-form">
                <label>
                    Territory
                    <input
                        type="text"
                        onChange={(event) => {
                            setTerritory(event.target.value);
                            setError("");
                            setSuccess("");
                        }}
                        disabled={loading || (terrInput !== null && !militaryOpen)}
                        placeholder="Territory"
                        value={territory}
                    />
                </label>

                <div>
                  <label className="unit-header">
                      Units
                  </label>
                  <label className="unit-labels">
                      {
                        selectedUnits.length === 0 ? "None Selected" : selectedUnits.map((unit) => 
                          <span className="unit-label"> {unit} </span>
                        ) 
                      } 
                  </label>
                </div>
                <MilitaryView
                    selectedUnits={selectedUnits}
                    setSelectedUnits={setSelectedUnits}
                    canSelectMultiple={true}
                    territory={terrInput?.Name}
                    resetKey={militaryReset}
                    onOpenChange={setMilitaryOpen}
                />

                <button
                    className="action-button"
                    onClick={handleAttack}
                    disabled={loading}
                >
                    {loading ? "⚔️ Attacking..." : "⚔️ Attack"}
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

export default AttackFlow;