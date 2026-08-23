export interface Nation {
    Name: string;
    Balance: number;
    Stability: number;
    Inventory: Record<string, number>;
    Ideology: string;
    Channel: number;
    Flag: string;
    "Tax Rate": number;
    "Political Power": number;
    Demonym: string;
    Color: [number, number, number];
    Capital: string;
    Diplomacy: {
        Allies: string[];
        Trusted: string[];
        "Non-Aggression Pacts": string[];
    };
    game: unknown;
    ruler: unknown;
}