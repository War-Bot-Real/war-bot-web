export interface Nation {
    name: string;
    balance: number;
    stability: number;
    inventory: Record<string, number>;
    ideology: string;
    channel: number;
    flag: string;
    taxRate: number;
    politicalPower: number;
    demonym: string;
    color: [number, number, number];
    capital: string;
    diplomacy: {
        "Allies": string[];
        "Trusted": string[];
        "Non-Aggression Pacts": string[];
    };
    game: unknown;
    ruler: unknown;
}