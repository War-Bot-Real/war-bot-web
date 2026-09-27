export interface Terrain {
    Name: string;
    Color: [number, number, number];
}

export interface MapData {
    Terrains: Terrain[];
    pxToKm: number;
}