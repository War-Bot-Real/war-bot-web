import { useEffect, useRef, useState } from "react";
import { buy, getBalance, getShop } from "../../api";

import type { Shop, ShopItem } from "../../types/Shop";
import type { Nation } from "../../types/Nation";

import ironIcon from "../../assets/iron.png";
import steelIcon from "../../assets/steel.png";

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
          setBalance(balanceData.balance);
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
        for (const [item, rawItemData] of Object.entries(items)) {
          const itemData = rawItemData as ShopItem;
          const maxQuantity = Math.floor(
            balance / itemData.Money
          );

          if (
            updated[item] !== undefined &&
            updated[item] > maxQuantity
          ) {
            updated[item] =
              maxQuantity > 0 ? 1 : 0;
          }
        }
      }

      return updated;
    });
  }, [balance, shop, canPurchase]);

  const getMaxQuantity = (
    itemData: ShopItem
  ) => {
    if (balance === null) return 0;

    return Math.floor(
      balance / itemData.Money
    );
  };

  const handleQuantityChange = (
    item: string,
    quantity: number,
    maxQuantity: number
  ) => {
    const newQuantity = Math.max(
      0,
      Math.min(quantity, maxQuantity)
    );

    setQuantities((current) => ({
      ...current,
      [item]: newQuantity,
    }));

    setMessage("");
  };

  const handleBuy = async (
    item: string,
    itemData: ShopItem
  ) => {
    if (balance === null || !canPurchase) return;

    const maxQuantity =
      getMaxQuantity(itemData);

    const quantity =
      quantities[item] ??
      (maxQuantity > 0 ? 1 : 0);

    if (quantity < 1 || maxQuantity < 1) {
      return;
    }

    setBuying(item);
    setMessage("");

    try {
      const response = await buy(
        item,
        quantity
      );

      if (response["success"]) {
        try {
          await purchaseSound.current.play();
        } catch (error) {
          console.warn(
            "Purchase sound could not play:",
            error
          );
        }

        const balanceData =
          await getBalance();

        setBalance(
          balanceData.balance
        );

        setQuantities((current) => ({
          ...current,
          [item]: 1,
        }));

        setMessage(
          `Successfully bought ${quantity.toLocaleString()} ${item}.`
        );
      } else {
        setMessage(
          response["detail"] ??
            "Failed to purchase item."
        );
      }
    } catch (error) {
      console.error(
        "Failed to buy item:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to purchase item."
      );
    } finally {
      setBuying(null);
    }
  };

  const renderPrice = (
    itemData: ShopItem
  ) => (
    <div className="shop-price">
      <span>
        ${itemData.Money.toLocaleString()} / unit
      </span>
s
      {itemData.Iron !== undefined &&
        itemData.Iron > 0 && (
          <span className="shop-resource">
            <img
              src={ironIcon}
              alt="Iron"
              className="shop-resource-icon"
            />
            {itemData.Iron}
          </span>
        )}

      {itemData.Steel !== undefined &&
        itemData.Steel > 0 && (
          <span className="shop-resource">
            <img
              src={steelIcon}
              alt="Steel"
              className="shop-resource-icon"
            />
            {itemData.Steel}
          </span>
        )}
    </div>
  );

  if (loading) {
    return <p>Loading shop...</p>;
  }

  if (!shop) {
    return (
      <p>
        {message ||
          "Failed to load shop."}
      </p>
    );
  }

  return (
    <div className="shop-flow">
      {canPurchase &&
        balance !== null && (
          <p>
            Balance: $
            {balance.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </p>
        )}

      {message && <p>{message}</p>}

      {Object.entries(shop).map(
        ([category, items]) => (
          <section key={category}>
            <h3>{category}</h3>

            {Object.entries(items).map(
              ([item, rawItemData]) => {
                const itemData =
                  rawItemData as ShopItem;

                if (!canPurchase) {
                  return (
                    <div
                      className="shop-item"
                      key={item}
                    >
                      <div className="shop-item-info">
                        <span>{item}</span>

                        {renderPrice(
                          itemData
                        )}
                      </div>
                    </div>
                  );
                }

                const maxQuantity =
                  getMaxQuantity(
                    itemData
                  );

                const quantity =
                  quantities[item] ??
                  (maxQuantity > 0
                    ? 1
                    : 0);

                const canBuy =
                  maxQuantity > 0 &&
                  quantity > 0 &&
                  quantity <=
                    maxQuantity;

                return (
                  <div
                    className="shop-item"
                    key={item}
                  >
                    <div className="shop-item-info">
                      <span>{item}</span>

                      {renderPrice(
                        itemData
                      )}
                    </div>

                    <input
                      type="range"
                      min={
                        maxQuantity > 0
                          ? 1
                          : 0
                      }
                      max={Math.max(
                        maxQuantity,
                        1
                      )}
                      value={quantity}
                      onChange={(
                        event
                      ) =>
                        handleQuantityChange(
                          item,
                          Number(
                            event.target
                              .value
                          ),
                          maxQuantity
                        )
                      }
                      disabled={
                        maxQuantity < 1 ||
                        buying !== null
                      }
                    />

                    <div className="shop-item-quantity">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            item,
                            Math.max(
                              1,
                              quantity - 1
                            ),
                            maxQuantity
                          )
                        }
                        disabled={
                          quantity <= 1 ||
                          buying !== null
                        }
                      >
                        −
                      </button>

                      <input
                        type="number"
                        min="0"
                        max={
                          maxQuantity
                        }
                        value={quantity}
                        onChange={(
                          event
                        ) => {
                          const value =
                            event.target
                              .value;

                          if (
                            value === ""
                          ) {
                            setQuantities(
                              (
                                current
                              ) => ({
                                ...current,
                                [item]: 0,
                              })
                            );

                            return;
                          }

                          const number =
                            Number(value);

                          if (
                            Number.isNaN(
                              number
                            )
                          ) {
                            return;
                          }

                          handleQuantityChange(
                            item,
                            number,
                            maxQuantity
                          );
                        }}
                        disabled={
                          maxQuantity <
                            1 ||
                          buying !== null
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            item,
                            quantity + 1,
                            maxQuantity
                          )
                        }
                        disabled={
                          quantity >=
                            maxQuantity ||
                          maxQuantity < 1 ||
                          buying !== null
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        handleBuy(
                          item,
                          itemData
                        )
                      }
                      disabled={
                        !canBuy ||
                        buying !== null
                      }
                    >
                      {buying === item
                        ? "Buying..."
                        : "Purchase"}
                    </button>
                  </div>
                );
              }
            )}
          </section>
        )
      )}
    </div>
  );
}

export default ShopFlow;