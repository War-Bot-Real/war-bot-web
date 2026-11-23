import { useEffect, useRef, useState } from "react";
import { deploy, getInventory, getShop } from "../../api";
import type { Shop } from "../../types/Shop";
import type { Territory } from "../../types/Territory";

const resourceNames = new Set(["money", "iron", "steel", "coal", "oil", "power", "population"]);

function DeployFlow({ territory }: { territory: Territory | null }) {
    const [quan, setQuan] = useState(1);
    const [terrInput, setTerrInput] = useState("");
    const [unit, setUnit] = useState("");
    const [inventory, setInventory] = useState<Record<string, number>>({});
    const [availableUnits, setAvailableUnits] = useState<string[]>([]);
    const [inventoryLoading, setInventoryLoading] = useState(true);
    const [inventoryError, setInventoryError] = useState(false);
    const [showUnits, setShowUnits] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const unitPickerRef = useRef<HTMLDivElement>(null);

    const loadUnits = async () => {
        setInventoryLoading(true);
        try {
            const [inventoryResult, shopResult] = await Promise.allSettled([getInventory(), getShop()]);
            if (inventoryResult.status !== "fulfilled") throw inventoryResult.reason;
            const items = inventoryResult.value.inventory as Record<string, number>;
            setInventory(items);
            const unitNames = new Set<string>();
            if (shopResult.status === "fulfilled") {
                const shop = shopResult.value as Shop;
                for (const [category, products] of Object.entries(shop)) {
                    if (category.toLowerCase().includes("unit")) {
                        Object.keys(products).forEach(name => unitNames.add(name.toLowerCase()));
                    }
                }
            }
            const ownedItems = Object.entries(items)
                .filter(([name, amount]) => Number(amount) > 0 && !resourceNames.has(name.toLowerCase()));
            const matchingShopUnits = ownedItems.filter(([name]) => unitNames.has(name.toLowerCase()));
            // The inventory may use unit abbreviations while the shop uses full names.
            const names = (matchingShopUnits.length ? matchingShopUnits : ownedItems)
                .map(([name]) => name)
                .sort((a, b) => a.localeCompare(b));
            setAvailableUnits(names);
            setInventoryError(false);
        } catch (cause) {
            console.error("Failed to load deployable inventory:", cause);
            setInventoryError(true);
            setAvailableUnits([]);
        } finally {
            setInventoryLoading(false);
        }
    };

    useEffect(() => { void loadUnits(); }, []);

    useEffect(() => {
        const onPointerDown = (event: PointerEvent) => {
            if (unitPickerRef.current && !unitPickerRef.current.contains(event.target as Node)) {
                setShowUnits(false);
            }
        };
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, []);

    const filteredUnits = availableUnits.filter(name => name.toLowerCase().includes(unit.toLowerCase()));
    const territoryName = territory?.name ?? terrInput;


const displayUnitName = (entered: string): string => {
    const normalized = entered.trim();

    const aliases: Record<string, string> = {
        LI: "Light Infantry",
        LCAV: "Light Cavalry",
        HCAV: "Heavy Cavalry",
        MIL: "Militia",
        MI: "Motorized Infantry",
    };

    // Convert known abbreviations to their full names.
    const fullName = aliases[normalized.toUpperCase()];

    if (fullName) {
        return fullName;
    }

    // Match full unit names already in the inventory dropdown.
    const matchingUnit = availableUnits.find(
        name => name.toLowerCase() === normalized.toLowerCase()
    );

    if (matchingUnit) {
        return matchingUnit;
    }

    // Expand a partial name only when there is one unique match.
    const matches = availableUnits.filter(
        name => name.toLowerCase().startsWith(normalized.toLowerCase())
    );

    if (matches.length === 1) {
        return matches[0];
    }

    return normalized;
};

    const handleDeploy = async () => {
        if (!unit.trim() || !territoryName.trim() || !Number.isInteger(quan) || quan < 1) {
            setError("Choose a unit, territory and valid quantity first.");
            return;
        }
        setLoading(true);
        setShowUnits(false);
        setSuccess(null);
        setError(null);
        try {
            const data = await deploy(territoryName, unit.trim(), quan);
            if (data["success"]) {
                setSuccess(`Successfully deployed ${quan} ${displayUnitName(unit)} in ${territoryName}`);
                void loadUnits();
            } else {
                setError(data["detail"] ?? "Failed to deploy");
            }
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Failed to deploy");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="command-flow deploy-flow">
            <p className="command-subtitle">Deploy a unit in a territory you own.</p>
            <div className="command-form">
                <label htmlFor="deploy-unit">Unit Type</label>
                <div className="deploy-unit-picker" ref={unitPickerRef}>
                    <input
                        id="deploy-unit"
                        type="text"
                        autoComplete="off"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={showUnits}
                        aria-controls="deploy-unit-options"
                        onFocus={() => setShowUnits(true)}
                        onClick={() => setShowUnits(true)}
                        onKeyDown={event => {
                            if (event.key === "Escape") setShowUnits(false);
                            if (event.key === "ArrowDown") setShowUnits(true);
                            if (event.key === "Enter" && showUnits && filteredUnits.length > 0) {
                                event.preventDefault();
                                setUnit(filteredUnits[0]);
                                setShowUnits(false);
                            }
                        }}
                        onChange={event => {
                            setUnit(event.target.value);
                            setShowUnits(true);
                            setError(null);
                            setSuccess(null);
                        }}
                        disabled={loading}
                        placeholder={inventoryLoading ? "Loading available units..." : "Click or type to choose a unit"}
                        value={unit}
                    />
                    {showUnits && !loading && (
                        <div id="deploy-unit-options" className="deploy-unit-options" role="listbox" aria-label="Available units">
                            {inventoryLoading ? (
                                <p>Loading inventory...</p>
                            ) : inventoryError ? (
                                <p>Unable to load inventory. You can still type a unit name.</p>
                            ) : filteredUnits.length === 0 ? (
                                <p>{availableUnits.length ? "No matching units in inventory." : "No deployable units in inventory."}</p>
                            ) : filteredUnits.map(name => (
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={unit === name}
                                    key={name}
                                    onClick={() => {
                                        setUnit(name);
                                        setShowUnits(false);
                                        setQuan(1);
                                        setError(null);
                                        setSuccess(null);
                                    }}
                                >
                                    <span>{name}</span>
                                    <span>{Number(inventory[name]).toLocaleString()} available</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <label>
                    Territory
                    <input
                        type="text"
                        onChange={event => {
                            setTerrInput(event.target.value);
                            setError(null);
                            setSuccess(null);
                        }}
                        disabled={loading || territory !== null}
                        placeholder="Territory"
                        value={territoryName}
                    />
                </label>
                <label>
                    Quantity
                    <input
                        type="number"
                        min="1"
                        max={inventory[unit] > 0 ? inventory[unit] : undefined}
                        onChange={event => {
                            setQuan(Number(event.target.value) || 0);
                            setError(null);
                            setSuccess(null);
                        }}
                        disabled={loading}
                        placeholder="Quantity"
                        value={quan || ""}
                    />
                </label>
                <button className="action-button" onClick={handleDeploy} disabled={loading}>
                    {loading ? "Deploying..." : "Deploy"}
                </button>
            </div>
            {success && <p className="command-success">{success}</p>}
            {error && <p className="command-error">{error}</p>}
        </div>
    );
}

export default DeployFlow;