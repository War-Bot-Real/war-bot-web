import type { Territory, TerritoryPixelLookup } from "../types/Territory";
import { parseLocation } from "./ParseLocation";

const WHITE = 255;

function isWhite(
    pixels: Uint8ClampedArray,
    index: number,
): boolean {
    return (
        pixels[index] === WHITE &&
        pixels[index + 1] === WHITE &&
        pixels[index + 2] === WHITE
    );
}

export function buildTerritoryLookup(
    imageData: ImageData,
    territories: Territory[],
): TerritoryPixelLookup {
    const { width, height, data } = imageData;

    /*
     * territoryIds[index] stores which territory owns a pixel.
     *
     * -1 = no territory
     *  0 = territories[0]
     *  1 = territories[1]
     * etc.
     */
    const territoryIds = new Int32Array(width * height);
    territoryIds.fill(-1);

    const queueX = new Int32Array(width * height);
    const queueY = new Int32Array(width * height);

    territories.forEach((territory, territoryIndex) => {
        const seeds = parseLocation(territory.Location);

        for (const [startX, startY] of seeds) {
            if (
                startX < 0 ||
                startX >= width ||
                startY < 0 ||
                startY >= height
            ) {
                console.warn(
                    `Invalid location for ${territory.Name}:`,
                    startX,
                    startY,
                );
                continue;
            }

            const startIndex = startY * width + startX;

            // Don't process a region that has already been assigned.
            if (territoryIds[startIndex] !== -1) {
                continue;
            }

            // The seed should be inside a white region.
            if (!isWhite(data, startIndex * 4)) {
                console.warn(
                    `Location for ${territory.Name} is not white:`,
                    startX,
                    startY,
                );
                continue;
            }

            let head = 0;
            let tail = 0;

            queueX[tail] = startX;
            queueY[tail] = startY;
            tail++;

            territoryIds[startIndex] = territoryIndex;

            while (head < tail) {
                const x = queueX[head];
                const y = queueY[head];
                head++;

                // Four-directional flood fill.
                const neighbors = [
                    [x + 1, y],
                    [x - 1, y],
                    [x, y + 1],
                    [x, y - 1],
                ];

                for (const [nx, ny] of neighbors) {
                    if (
                        nx < 0 ||
                        nx >= width ||
                        ny < 0 ||
                        ny >= height
                    ) {
                        continue;
                    }

                    const neighborIndex = ny * width + nx;

                    if (territoryIds[neighborIndex] !== -1) {
                        continue;
                    }

                    const pixelIndex = neighborIndex * 4;

                    if (!isWhite(data, pixelIndex)) {
                        continue;
                    }

                    territoryIds[neighborIndex] = territoryIndex;

                    queueX[tail] = nx;
                    queueY[tail] = ny;
                    tail++;
                }
            }
        }
    });

    return {
        width,
        height,
        territoryIds,
        territories,
    };
}