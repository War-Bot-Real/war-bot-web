import { useEffect, useState } from "react";
import { buy, getShop } from "../../api";

function BuyFlow() {
    const [quan, setQuan] = useState(0);
    const [item, setItem] = useState("");
    const [items, setItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadShop = async () => {
            try {
                const shop = await getShop();

                const shopItems = Object.values(shop).flatMap(category => Object.keys(category as object));

                setItems(shopItems);
            } catch (error) {
                console.error("Failed to load shop:", error);
                setError("Failed to load shop items.");
            }
        };

        loadShop();
    }, []);

    const handleBuy = async () => {
        if (quan < 1) {
            setError("Cannot have a quantity of less than one!");
            return;
        }

        if (!item) {
            setError("Please select an item!");
            return;
        }

        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const resp = await buy(item, quan);

            if (resp["success"]) {
                setSuccess(
                    `Successfully bought ${quan.toLocaleString()} ${item} for $${resp["result"]["price"]}. You have $${resp["result"]["New Balance"]} remaining.`
                );
            } else {
                setError(resp["detail"] ?? "Failed to buy item.");
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to buy item."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Buy</h2>

            <div>
                <input
                    type="text"
                    list="shop-items"
                    value={item}
                    onChange={(event) => {
                        setItem(event.target.value);
                        setError("");
                        setSuccess("");
                    }}
                    disabled={loading}
                    placeholder="Item"
                />

                <datalist id="shop-items">
                    {items.map((itemName) => (
                        <option
                            key={itemName}
                            value={itemName}
                        />
                    ))}
                </datalist>

                <br />

                <input
                    type="number"
                    min="1"
                    value={quan || ""}
                    onChange={(event) => {
                        setQuan(parseInt(event.target.value) || 0);
                        setError("");
                        setSuccess("");
                    }}
                    disabled={loading}
                    placeholder="Quantity"
                />

                <br />

                <button
                    onClick={handleBuy}
                    disabled={loading}
                >
                    {loading ? "Buying..." : "Buy!"}
                </button>
            </div>

            {success && <p>{success}</p>}
            {error && <p>{error}</p>}
        </div>
    );
}

export default BuyFlow;