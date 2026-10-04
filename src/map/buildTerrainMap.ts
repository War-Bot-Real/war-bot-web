
import type { TerritoryPixelLookup } from "../types/Territory";
import type { MapData } from "../types/MapData";
import type { Territory } from "../types/Territory";

export function buildTerrainMap(
    lookup: TerritoryPixelLookup,
    mapData: MapData,
): ImageData {
    const imageData = new ImageData(
        lookup.width,
        lookup.height,
    );

    for (let i = 0; i < lookup.territoryIds.length; i++) {
        const territoryIndex = lookup.territoryIds[i];

        if (territoryIndex === -1) {
            continue;
        }

        const territory = lookup.territories[territoryIndex];

        const terrain = mapData.Terrains[territory.terrain - 1];

        if (!terrain) {
            continue;
        }

        const pixel = i * 4;

        imageData.data[pixel] = terrain.Color[0];
        imageData.data[pixel + 1] = terrain.Color[1];
        imageData.data[pixel + 2] = terrain.Color[2];
        imageData.data[pixel + 3] = 255;
    }

    return imageData;
}