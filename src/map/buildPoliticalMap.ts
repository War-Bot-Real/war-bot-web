import type { Nation } from "../types/Nation";
import type { Selection } from "../types/Selection";
import type { TerritoryPixelLookup } from "../types/Territory";

export function buildPoliticalMap(lookup: TerritoryPixelLookup, nations: Nation[], selection: Selection, gameTime: number): ImageData {
    const { width, height, territoryIds, territories } = lookup;

    const pixels = new Uint8ClampedArray(width * height * 4,);

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
            selected = territory.name === selection.territory.name;
        } else if (selection?.type === "nation") {
            selected = territory.nation === selection.nation.name;
        }

        if (selected) {
            const [r, g, b] = nation.color;
            let factor = 0;

            if (territory.integrated > gameTime) {
                factor = 0.4;
            }

            pixels[i * 4]     = Math.round(r + (255 - r) * factor);
            pixels[i * 4 + 1] = Math.round(g + (255 - g) * factor);
            pixels[i * 4 + 2] = Math.round(b + (255 - b) * factor);
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