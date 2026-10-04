import type { Nation } from "../types/Nation";
import type { Selection } from "../types/Selection";
import type { TerritoryPixelLookup } from "../types/Territory";

export function buildPoliticalMap(
    lookup: TerritoryPixelLookup,
    nations: Nation[],
    selection: Selection,
): ImageData {
    const { width, height, territoryIds, territories } = lookup;

    const pixels = new Uint8ClampedArray(
        width * height * 4,
    );

    const nationsByName = new Map<string, Nation>();

    for (const nation of nations) {
        nationsByName.set(nation.name, nation);
    }

    for (let i = 0; i < territoryIds.length; i++) {
        const territoryIndex = territoryIds[i];

        if (territoryIndex === -1) {
            pixels[i * 4 + 3] = 0;
            continue;
        }

        const territory = territories[territoryIndex];

        const nation = nationsByName.get(territory.nation);

        if (!nation) {
            pixels[i * 4 + 3] = 0;
            continue;
        }

        /*
         * Decide whether this territory should be colored.
         */
        let selected = true;

        if (selection?.type === "territory") {
            selected =
                territory.name === selection.territory.name;
        } else if (selection?.type === "nation") {
            selected =
                territory.nation === selection.nation.name;
        }

        if (selected) {
            const [r, g, b] = nation.color;

            pixels[i * 4] = r;
            pixels[i * 4 + 1] = g;
            pixels[i * 4 + 2] = b;
            pixels[i * 4 + 3] = 255;
        } else {
            /*
             * White for unselected territories.
             */
            pixels[i * 4] = 255;
            pixels[i * 4 + 1] = 255;
            pixels[i * 4 + 2] = 255;
            pixels[i * 4 + 3] = 255;
        }
    }

    return new ImageData(pixels, width, height);
}