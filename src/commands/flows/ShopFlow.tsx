import { useEffect, useState } from "react";
import { getShop } from "../../api";

import type { Shop } from "../../types/Shop";

function ShopFlow() {
    const [shop, setShop] = useState<Shop | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadShop = async () => {
            try {
                const data = await getShop();

                setShop(data);
            } catch (error) {
                console.error(
                    "Failed to load shop:",
                    error,
                );

                setError("Failed to load shop.");
            }
        };

        loadShop();
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!shop) {
        return <p>Loading shop...</p>;
    }

    return (
        <div className="shop-flow">
            <h2>Shop</h2>

            {Object.entries(shop).map(
                ([category, items]) => (
                    <section key={category}>
                        <h3>{category}</h3>

                        {Object.entries(
                            items as Record<string, number>,
                        ).map(([name, price]) => (
                            <div key={name}>
                                <span>{name}</span>
                                <span>
                                    ${price.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </section>
                ),
            )}
        </div>
    );
}

export default ShopFlow;