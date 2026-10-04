export interface Territory {
    name: string;
    nation: string;
    population: number;
    bordering: string[];
    buildings: unknown[];
    location: string[][];
    coast: string[];
    integrated: number;
    area: number;
    terrain: number;
    coal: number;
    oil: number;
    devastation: number;
    rails: number | null;
    game: unknown;
}

export interface TerritoryPixelLookup {
    width: number;
    height: number;
    territoryIds: Int32Array;
    territories: Territory[];
}