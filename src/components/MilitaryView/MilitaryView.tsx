import { useEffect, useState } from "react";
import { getForces } from "../../api";
import type { Unit } from "../../types/Unit";
import "./MilitaryView.css";

interface MilitaryViewProps {
    selectedUnits: string[];
    setSelectedUnits: (units: string[]) => void;
}

function MilitaryView({selectedUnits, setSelectedUnits}: MilitaryViewProps) {
    const [open, setOpen] = useState(false);
    const [units, setUnits] = useState<Unit[]>([]);
    const [location, setLocation] = useState("All");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open || units.length > 0) return;

        const loadForces = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await getForces();
                const result = response.result;

                const territoryUnits = Object.values(result.territories).flat();
                const abroadUnits = Object.values(result.abroad).flat();
                const carrierUnits = Object.values(result.carriers).flat();

                setUnits([
                    ...territoryUnits,
                    ...abroadUnits,
                    ...carrierUnits,
                ] as Unit[]);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load military."
                );
            } finally {
                setLoading(false);
            }
        };

        loadForces();
    }, [open, units.length]);

    const locations = [
        "All",
        ...Array.from(new Set(units.map(unit => unit.Location))),
    ];

    const filteredUnits = location === "All" ? units : units.filter(unit => unit.Location === location);

    const toggleUnit = (unitName: string) => {
        if (selectedUnits.includes(unitName)) {
            setSelectedUnits(selectedUnits.filter(unit => unit !== unitName));
        } else {
            setSelectedUnits([...selectedUnits, unitName]);
        }
    };

    return (
        <div className="military-view">
            <button
                className="command-button"
                onClick={() => setOpen(!open)}
            >
                {open ? "Hide Military" : "Show Military"}
            </button>

            {open && (
                <div className="military-popup">
                    <div className="military-header">
                        <h3>Military</h3>

                        <button
                            className="military-close"
                            onClick={() => setOpen(false)}
                        >
                            ×
                        </button>
                    </div>

                    <div className="military-filters">
                        <label>
                            Territory
                            <select
                                value={location}
                                onChange={(event) =>
                                    setLocation(event.target.value)
                                }
                            >
                                {locations.map(locationName => (
                                    <option
                                        key={locationName}
                                        value={locationName}
                                    >
                                        {locationName}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="military-content">
                        {loading && (
                            <p>Loading military...</p>
                        )}

                        {error && (
                            <p className="command-error">{error}</p>
                        )}

                        {!loading && !error && (
                            <div className="military-units">
                                {filteredUnits.length === 0 ? (
                                    <p>No units found.</p>
                                ) : (
                                    filteredUnits.map(unit => {
                                        const selected =
                                            selectedUnits.includes(unit.Name);

                                        return (
                                            <div
                                                className={`military-unit ${
                                                    selected ? "selected" : ""
                                                }`}
                                                key={unit.Name}
                                            >
                                                <div>
                                                    <strong>{unit.Name}</strong>
                                                    <span>
                                                        {unit.Type} —{" "}
                                                        {unit.Quantity.toLocaleString()}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        toggleUnit(unit.Name)
                                                    }
                                                >
                                                    {selected
                                                        ? "Remove"
                                                        : "Add"}
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>

                    <div className="military-footer">
                        {selectedUnits.length} selected
                    </div>
                </div>
            )}
        </div>
    );
}

export default MilitaryView;