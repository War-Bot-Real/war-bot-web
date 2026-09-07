export interface ShopItem {
    Money: number;
    Steel?: number;
    Iron?: number;
}

export interface Shop {
    "Ground Units": Record<string, ShopItem>;
    "Naval Units": Record<string, ShopItem>;
    "Air Units": Record<string, ShopItem>;
    Buildings: Record<string, ShopItem>;
}

