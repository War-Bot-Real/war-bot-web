import { useEffect, useState } from "react";
import { pave, pavePrices } from "../../api";
import type { Selection } from "../../types/Selection";
import type { Territory } from "../../types/Territory";

function getSelectedTerritories(selection: Selection): Territory[] {
    if (selection?.type === "territory") {
        return [selection.territory];
    }

    return selection?.type === "territories" ? selection.territories : [];
}

function getPriceEntries(data: unknown): [string, string][] {
    if (typeof data !== "object" || data === null || !("prices" in data)) {
        return [];
    }

    const prices = data.prices;
    if (!Array.isArray(prices)) return [];

    return prices.flatMap((entry): [string, string][] => {
        if (
            typeof entry !== "object" ||
            entry === null ||
            !("territory" in entry) ||
            typeof entry.territory !== "string" ||
            !("price" in entry) ||
            typeof entry.price !== "number"
        ) {
            return [];
        }

        return [[
            entry.territory,
            `$${entry.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`,
        ]];
    });
}

function PaveFlow({ selection }: { selection: Selection }) {
    const [fromTerritoryInput, setFromTerritoryInput] = useState("");
    const [toTerritoryInput, setToTerritoryInput] = useState("");
    const selectedTerritories = getSelectedTerritories(selection);
    const selectedTerritoryName =
        selectedTerritories.length === 1
            ? selectedTerritories[0].name
            : null;
    const fromTerritory =
        selectedTerritories[0]?.name ?? fromTerritoryInput.trim();
    const toTerritory =
        selectedTerritories[1]?.name ?? toTerritoryInput.trim();
    const selectionKey = JSON.stringify([fromTerritory, toTerritory]);

    const [priceResult, setPriceResult] = useState<{
        territoryName: string;
        prices?: unknown;
        error?: string;
    } | null>(null);
    const [paving, setPaving] = useState(false);
    const [paveResult, setPaveResult] = useState<{
        selectionKey: string;
        success?: string;
        error?: string;
    } | null>(null);

    useEffect(() => {
        let cancelled = false;
        if (!selectedTerritoryName) return;

        pavePrices(selectedTerritoryName)
            .then((data: unknown) => {
                if (!cancelled) {
                    setPriceResult({
                        territoryName: selectedTerritoryName,
                        prices: data,
                    });
                }
            })
            .catch((cause: unknown) => {
                if (!cancelled) {
                    setPriceResult({
                        territoryName: selectedTerritoryName,
                        error:
                            cause instanceof Error
                                ? cause.message
                                : "Failed to load paving prices.",
                    });
                }
            });

        return () => {
            cancelled = true;
        };
    }, [selectedTerritoryName]);

    const handlePave = async () => {
        if (!fromTerritory || !toTerritory || paving) return;

        setPaving(true);

        try {
            const response = await pave(fromTerritory, toTerritory);
            if (
                response &&
                typeof response === "object" &&
                "success" in response &&
                response.success === false
            ) {
                setPaveResult({
                    selectionKey,
                    error:
                        "detail" in response && typeof response.detail === "string"
                            ? response.detail
                            : "Failed to pave rail.",
                });
                return;
            }

            const result =
                typeof response === "object" &&
                response !== null &&
                "result" in response &&
                typeof response.result === "object" &&
                response.result !== null
                    ? response.result
                    : null;
            const status =
                result && "status" in result && typeof result.status === "string"
                    ? result.status
                    : "completed";
            const price =
                result && "price" in result && typeof result.price === "number"
                    ? ` for $${result.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                      })}`
                    : "";

            setPaveResult({
                selectionKey,
                success: `Rail ${status} from ${fromTerritory} to ${toTerritory}${price}.`,
            });
        } catch (cause) {
            setPaveResult({
                selectionKey,
                error:
                    cause instanceof Error
                        ? cause.message
                        : "Failed to pave rail.",
            });
        } finally {
            setPaving(false);
        }
    };

    const visiblePaveResult =
        paveResult?.selectionKey === selectionKey ? paveResult : null;
    const hasCurrentPrices =
        selectedTerritoryName !== null &&
        priceResult?.territoryName === selectedTerritoryName;
    const currentPriceEntries = hasCurrentPrices && !priceResult.error
        ? getPriceEntries(priceResult.prices)
        : [];

    return (
        <div className="command-flow pave-flow">
            <h2 className="command-title">Pave Rail</h2>
            <p className="command-subtitle">
                Select a territory to view it's prices, or two territories
                to pave rail between them. You can also enter territory names.
            </p>

            <div className="command-form">
                <label>
                    From territory
                    <input
                        type="text"
                        value={selectedTerritories[0]?.name ?? fromTerritoryInput}
                        placeholder="Select a territory on the map"
                        disabled={selectedTerritories.length > 0 || paving}
                        onChange={(event) => setFromTerritoryInput(event.target.value)}
                    />
                </label>
                <label>
                    To territory
                    <input
                        type="text"
                        value={selectedTerritories[1]?.name ?? toTerritoryInput}
                        placeholder="Select a second territory on the map"
                        disabled={selectedTerritories.length > 1 || paving}
                        onChange={(event) => setToTerritoryInput(event.target.value)}
                    />
                </label>
            </div>

            {selectedTerritoryName && (
                <>
                    <h3 className="command-section-title">
                        Paving prices for {selectedTerritoryName}
                    </h3>
                    {!hasCurrentPrices ? (
                        <p>Loading prices...</p>
                    ) : priceResult.error ? (
                        <p className="command-error">{priceResult.error}</p>
                    ) : currentPriceEntries.length > 0 ? (
                        <div className="command-list">
                            {currentPriceEntries.map(([name, value]) => (
                                <div className="command-row" key={name}>
                                    <span>{name}</span>
                                    <span>{value}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="command-empty">No paving prices available.</p>
                    )}
                </>
            )}
            
            <br/>

            <button
                type="button"
                className="action-button"
                onClick={handlePave}
                disabled={
                    selectedTerritories.length > 2 ||
                    !fromTerritory ||
                    !toTerritory ||
                    paving
                }
            >
                {paving ? "Paving..." : "Pave"}
            </button>

            {visiblePaveResult?.success && (
                <p className="command-success">{visiblePaveResult.success}</p>
            )}
            {visiblePaveResult?.error && (
                <p className="command-error">{visiblePaveResult.error}</p>
            )}
        </div>
    );
}

export default PaveFlow;
