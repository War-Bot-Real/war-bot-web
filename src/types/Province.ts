export interface Province {
    Name: string;
    Nation: string;
    Population: number;
    Bordering: string[];
    Buildings: unknown[];
    Location: string;
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

export interface ProvincePixelLookup {
    width: number;
    height: number;
    provinceIds: Int32Array;
    provinces: Province[];
}