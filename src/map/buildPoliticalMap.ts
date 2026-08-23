import type { Nation } from "../types/Nation";
import type { TerritoryPixelLookup } from "../types/Territory";

export function buildPoliticalMap(
    lookup: TerritoryPixelLookup,
    nations: Nation[],
): ImageData {
    const { width, height, territoryIds, territories } = lookup;

    const pixels = new Uint8ClampedArray(
        width * height * 4,
    );

    const nationsByName = new Map<string, Nation>();

    for (const nation of nations) {
        nationsByName.set(nation.Name, nation);
    }

    for (let i = 0; i < territoryIds.length; i++) {
        const territoryIndex = territoryIds[i];

        // Water / borders / anything that isn't a territory.
        if (territoryIndex === -1) {
            pixels[i * 4 + 3] = 0;
            continue;
        }

        const territory = territories[territoryIndex];
        const nation = nationsByName.get(territory.Nation);

        if (!nation) {
            console.warn(
                `No nation found for territory ${territory.Name}: ${territory.Nation}`,
            );

            pixels[i * 4 + 3] = 0;
            continue;
        }

        const [r, g, b] = nation.Color;

        pixels[i * 4] = r;
        pixels[i * 4 + 1] = g;
        pixels[i * 4 + 2] = b;
        pixels[i * 4 + 3] = 255;
    }

    return new ImageData(pixels, width, height);
}