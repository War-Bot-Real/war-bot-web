import { useEffect, useRef, useState } from "react";
import { buy, getBalance, getShop } from "../../api";

import type { Shop, ShopItem } from "../../types/Shop";
import type { Nation } from "../../types/Nation";

interface ShopFlowProps {
  nation: Nation | null;
}

function ShopFlow({ nation }: ShopFlowProps) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const purchaseSound = useRef(new Audio("/purchase.mp3"));
  const canPurchase = nation !== null;

  useEffect(() => {
    const loadShop = async () => {
      try {
        const shopData = await getShop();
        setShop(shopData);

        if (canPurchase) {
          const balanceData = await getBalance();
          setBalance(balanceData["Balance"]);
        }
      } catch (error) {
        console.error("Failed to load shop:", error);
        setMessage("Failed to load shop.");
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, [canPurchase]);

  useEffect(() => {
    if (balance === null || !shop || !canPurchase) return;

    setQuantities((current) => {
      const updated = { ...current };

      for (const items of Object.values(shop)) {
        for (const [item, itemData] of Object.entries(items)) {
          const maxQuantity = Math.floor(balance / (itemData as ShopItem).Money);

          if (updated[item] !== undefined && updated[item] > maxQuantity) {
            updated[item] = maxQuantity > 0 ? 1 : 0;
          }
        }
      }

      return updated;
    });
  }, [balance, shop, canPurchase]);

  const handleQuantityChange = (item: string, quantity: number, maxQuantity: number) => {
    const newQuantity = Math.max(0, Math.min(quantity, maxQuantity));

    setQuantities((current) => ({ ...current, [item]: newQuantity }));
    setMessage("");
  };

  const handleBuy = async (item: string, price: number) => {
    if (balance === null || !canPurchase) return;

    const maxQuantity = Math.floor(balance / price);
    const quantity = quantities[item] ?? (maxQuantity > 0 ? 1 : 0);

    if (quantity < 1 || maxQuantity < 1) return;

    setBuying(item);
    setMessage("");

    try {
      const response = await buy(item, quantity);

      if (response["success"]) {
        purchaseSound.current.play();

        const newBalance = response["result"]["New Balance"];
        setBalance(newBalance);

        const newMaxQuantity = Math.floor(newBalance / price);

        setQuantities((current) => ({
          ...current,
          [item]: newMaxQuantity > 0 ? 1 : 0,
        }));

        setMessage(
          `Successfully bought ${quantity.toLocaleString()} ${item} for $${response["result"]["price"]["Money"].toLocaleString()}.`,
        );
      } else {
        setMessage(response["detail"] ?? "Failed to purchase item.");
      }
    } catch (error) {
      console.error("Failed to buy item:", error);

      setMessage(error instanceof Error ? error.message : "Failed to purchase item.");
    } finally {
      setBuying(null);
    }
  };

  if (loading) return <p>Loading shop...</p>;

  if (!shop) {
    return <p>{message || "Failed to load shop."}</p>;
  }

  return (
    <div className="shop-flow">
      <h2>Shop</h2>

      {canPurchase && balance !== null && (
        <p>
          Balance: $
          {balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      )}

      <p>{message}</p>

      {Object.entries(shop).map(([category, items]) => (
        <section key={category}>
          <h3>{category}</h3>

          {Object.entries(items).map(([item, itemData]) => {
            const price = (itemData as ShopItem).Money;

            /*
             * Guests only browse items.
             */
            if (!canPurchase) {
              return (
                <div className="shop-item" key={item}>
                  <div className="shop-item-info">
                    <span>{item}</span>
                    <span>${price.toLocaleString()} / unit</span>
                  </div>
                </div>
              );
            }

            const maxQuantity = Math.floor((balance ?? 0) / price);
            const quantity = quantities[item] ?? (maxQuantity > 0 ? 1 : 0);

            const canBuy = maxQuantity > 0 && quantity > 0 && quantity <= maxQuantity;

            return (
              <div className="shop-item" key={item}>
                <div className="shop-item-info">
                  <span>{item}</span>
                  <span>${price.toLocaleString()} / unit</span>
                </div>

                <input
                  type="range"
                  min={maxQuantity > 0 ? 1 : 0}
                  max={Math.max(maxQuantity, 1)}
                  value={quantity}
                  onChange={(event) =>
                    handleQuantityChange(item, Number(event.target.value), maxQuantity)
                  }
                  disabled={maxQuantity < 1 || buying !== null}
                />

                <div className="shop-item-quantity">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item, Math.max(1, quantity - 1), maxQuantity)}
                    disabled={quantity <= 1 || buying !== null}
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min="0"
                    max={maxQuantity}
                    value={quantity}
                    onChange={(event) => {
                      const value = event.target.value;

                      if (value === "") {
                        setQuantities((current) => ({ ...current, [item]: 0 }));
                        return;
                      }

                      const number = Number(value);

                      if (Number.isNaN(number)) return;

                      handleQuantityChange(item, number, maxQuantity);
                    }}
                    disabled={maxQuantity < 1 || buying !== null}
                  />

                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item, quantity + 1, maxQuantity)}
                    disabled={quantity >= maxQuantity || maxQuantity < 1 || buying !== null}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleBuy(item, price)}
                  disabled={!canBuy || buying !== null}
                >
                  {buying === item ? "Buying..." : "Purchase"}
                </button>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

export default ShopFlow;
