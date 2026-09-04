export interface Territory {
    Name: string;
    Nation: string;
    Population: number;
    Bordering: string[];
    Buildings: unknown[];
    Location: string[][];
    Coast: string[];
    Integrated: number;
    Area: number;
    Terrain: number;
    Coal: number;
    Oil: number;
    Devastation: number;
    Rails: number | null;
    game: unknown;
}

export interface TerritoryPixelLookup {
    width: number;
    height: number;
    territoryIds: Int32Array;
    territories: Territory[];
}