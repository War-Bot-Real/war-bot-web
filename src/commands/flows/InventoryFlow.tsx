import { useEffect, useState } from "react";
import { getInventory } from "../../api";

function InventoryFlow() {
    const [inventory, setInventory] = useState<Record<string, number> | null>(null);

    useEffect(() => {
        const loadInventory = async () => {
            try {
                const data = await getInventory();
                setInventory(data.Inventory);
            } catch (error) {
                console.error("Failed to load inventory:", error);
            }
        };

        loadInventory();
    }, []);

    if (inventory === null) {
        return <p>Loading...</p>;
    }

    return (
        <div className="inventory-flow">
            <h2>Inventory</h2>

            {Object.entries(inventory).length === 0 ? (
                <p className="command-empty">
                    You have nothing in your inventory!
                </p>
            ) : (
                <div className="command-list">
                    {Object.entries(inventory)
                        .filter(([, amount]) => amount > 0)
                        .map(([item, amount]) => (
                        <div className="command-row" key={item}>
                            <span>{item}</span>
                            <span>{amount.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default InventoryFlow;