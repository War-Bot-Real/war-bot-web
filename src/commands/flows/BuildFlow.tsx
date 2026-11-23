
import { useEffect, useRef, useState } from "react";
import { build, getInventory, getShop } from "../../api";
import type { Territory } from "../../types/Territory";

type InventoryItem = {
    name: string;
    quantity: number;
};

function BuildFlow({ territory }: { territory: Territory | null }) {
    const [terrInput, setTerrInput] = useState("");
    const [building, setBuilding] = useState("");

    const [availableBuildings, setAvailableBuildings] = useState<InventoryItem[]>([]);
    const [inventoryLoading, setInventoryLoading] = useState(true);
    const [inventoryError, setInventoryError] = useState("");

    const [showBuildings, setShowBuildings] = useState(false);
    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const pickerRef = useRef<HTMLDivElement>(null);

    const loadBuildings = async () => {
        setInventoryLoading(true);
        setInventoryError("");

        try {
            const [inventoryData, shopData] = await Promise.all([
                getInventory(),
                getShop(),
            ]);

            const inventory = inventoryData.inventory as Record<string, number>;

            // Use Shop only to identify which inventory items are buildings.
            // The list itself comes from the player's inventory.
            const buildingNames = Object.keys(shopData.Buildings ?? {});

            const items: InventoryItem[] = Object.entries(inventory)
                .filter(([name, quantity]) => {
                    if (Number(quantity) <= 0) return false;

                    return buildingNames.some(
                        buildingName =>
                            buildingName.trim().toLowerCase() ===
                            name.trim().toLowerCase()
                    );
                })
                .map(([name, quantity]) => ({
                    name,
                    quantity: Number(quantity),
                }))
                .sort((a, b) => a.name.localeCompare(b.name));

            setAvailableBuildings(items);
        } catch (cause) {
            console.error("Failed to load building inventory:", cause);
            setInventoryError("Could not load your building inventory.");
            setAvailableBuildings([]);
        } finally {
            setInventoryLoading(false);
        }
    };

    useEffect(() => {
        void loadBuildings();
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event: PointerEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node)
            ) {
                setShowBuildings(false);
            }
        };

        document.addEventListener("pointerdown", handleOutsideClick);

        return () => {
            document.removeEventListener("pointerdown", handleOutsideClick);
        };
    }, []);

    const filteredBuildings = availableBuildings.filter(item =>
        item.name.toLowerCase().includes(building.toLowerCase().trim())
    );

    const chooseBuilding = (name: string) => {
        setBuilding(name);
        setShowBuildings(false);
        setError("");
        setSuccess("");
    };

    const handleBuild = async () => {
        const territoryName = territory?.name ?? terrInput.trim();

        setError("");
        setSuccess("");
        setShowBuildings(false);

        if (!territoryName) {
            setError("Please select or enter a territory.");
            return;
        }

        const selectedBuilding = availableBuildings.find(
            item => item.name.toLowerCase() === building.trim().toLowerCase()
        );

        if (!selectedBuilding) {
            setError("Please select a building available in your inventory.");
            return;
        }

        if (loading) return;

        setLoading(true);

        try {
            const response = await build(
                territoryName,
                selectedBuilding.name
            );

            if (response["success"]) {
                setSuccess(
                    `Successfully built ${selectedBuilding.name} in ${territoryName}.`
                );

                // Refresh remaining inventory after construction.
                await loadBuildings();

                setBuilding("");
            } else {
                setError(
                    response["detail"] ?? "Failed to build."
                );
            }
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Failed to build."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="command-flow build-flow">
            <p className="command-subtitle">
                Build a structure in a territory you own.
            </p>

            <div className="command-form">
                <label htmlFor="build-territory">
                    Territory
                </label>

                <input
                    id="build-territory"
                    type="text"
                    value={territory?.name ?? terrInput}
                    onChange={event => {
                        setTerrInput(event.target.value);
                        setError("");
                        setSuccess("");
                    }}
                    disabled={loading || territory !== null}
                    placeholder="Territory"
                />

                <label htmlFor="build-building">
                    Building
                </label>

                <div
                    className="deploy-unit-picker"
                    ref={pickerRef}
                >
                    <input
                        id="build-building"
                        type="text"
                        value={building}
                        autoComplete="off"
                        placeholder={
                            inventoryLoading
                                ? "Loading inventory..."
                                : "Select a building from inventory"
                        }
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={showBuildings}
                        aria-controls="build-building-options"
                        disabled={loading}
                        onFocus={() => setShowBuildings(true)}
                        onClick={() => setShowBuildings(true)}
                        onChange={event => {
                            setBuilding(event.target.value);
                            setShowBuildings(true);
                            setError("");
                            setSuccess("");
                        }}
                        onKeyDown={event => {
                            if (event.key === "Escape") {
                                setShowBuildings(false);
                            }

                            if (event.key === "ArrowDown") {
                                setShowBuildings(true);
                            }

                            if (
                                event.key === "Enter" &&
                                showBuildings &&
                                filteredBuildings.length > 0
                            ) {
                                event.preventDefault();
                                chooseBuilding(filteredBuildings[0].name);
                            }
                        }}
                    />

                    {showBuildings && !loading && (
                        <div
                            id="build-building-options"
                            className="deploy-unit-options"
                            role="listbox"
                            aria-label="Buildings in inventory"
                        >
                            {inventoryLoading ? (
                                <p>Loading inventory...</p>
                            ) : inventoryError ? (
                                <p>{inventoryError}</p>
                            ) : filteredBuildings.length === 0 ? (
                                <p>
                                    {building.trim()
                                        ? "No matching buildings in inventory."
                                        : "No buildings available in inventory."}
                                </p>
                            ) : (
                                filteredBuildings.map(item => (
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={building === item.name}
                                        key={item.name}
                                        onClick={() => chooseBuilding(item.name)}
                                    >
                                        <span>{item.name}</span>
                                        <span>
                                            {item.quantity.toLocaleString()} available
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="action-button"
                    onClick={handleBuild}
                    disabled={loading || inventoryLoading}
                >
                    {loading ? "Building..." : "Build"}
                </button>
            </div>

            {success && (
                <p className="command-success">
                    {success}
                </p>
            )}

            {error && (
                <p className="command-error">
                    {error}
                </p>
            )}
        </div>
    );
}

export default BuildFlow;
