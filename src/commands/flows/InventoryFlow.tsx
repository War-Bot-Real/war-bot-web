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

    if (Object.entries(inventory).length == 0) {
      return <p>You have nothing in your inventory!</p>
    }

    return (
        <div>
            {Object.entries(inventory).map(([item, amount]) => (
                <p key={item}>
                    {item}: {amount.toLocaleString()}
                </p>
            ))}
        </div>
    );
}

export default InventoryFlow;
