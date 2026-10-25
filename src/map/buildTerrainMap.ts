
import type { TerritoryPixelLookup } from "../types/Territory";
import type { MapData } from "../types/MapData";
import type { Selection } from "../types/Selection";

export function buildTerrainMap(
    lookup: TerritoryPixelLookup,
    mapData: MapData,
    selection: Selection
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
        
        let r, g, b: number;

        if (selection?.type === "territory" && selection.territory.name !== territory.name || selection?.type === "nation" && selection.nation.name !== territory.nation) {
          [r, g, b] = [255, 255, 255]
        } else {
          [r, g, b] = terrain.Color;
        }
        
        imageData.data[pixel] = r;
        imageData.data[pixel + 1] = g;
        imageData.data[pixel + 2] = b;
        imageData.data[pixel + 3] = 255;
    }

    return imageData;
}