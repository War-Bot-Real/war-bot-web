import type { Province, ProvincePixelLookup } from "../types/Province";
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

export function buildProvinceLookup(
    imageData: ImageData,
    provinces: Province[],
): ProvincePixelLookup {
    const { width, height, data } = imageData;

    /*
     * provinceIds[index] stores which province owns a pixel.
     *
     * -1 = no province
     *  0 = provinces[0]
     *  1 = provinces[1]
     * etc.
     */
    const provinceIds = new Int32Array(width * height);
    provinceIds.fill(-1);

    const queueX = new Int32Array(width * height);
    const queueY = new Int32Array(width * height);

    provinces.forEach((province, provinceIndex) => {
        const seeds = parseLocation(province.Location);

        for (const [startX, startY] of seeds) {
            if (
                startX < 0 ||
                startX >= width ||
                startY < 0 ||
                startY >= height
            ) {
                console.warn(
                    `Invalid location for ${province.Name}:`,
                    startX,
                    startY,
                );
                continue;
            }

            const startIndex = startY * width + startX;

            // Don't process a region that has already been assigned.
            if (provinceIds[startIndex] !== -1) {
                continue;
            }

            // The seed should be inside a white region.
            if (!isWhite(data, startIndex * 4)) {
                console.warn(
                    `Location for ${province.Name} is not white:`,
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

            provinceIds[startIndex] = provinceIndex;

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

                    if (provinceIds[neighborIndex] !== -1) {
                        continue;
                    }

                    const pixelIndex = neighborIndex * 4;

                    if (!isWhite(data, pixelIndex)) {
                        continue;
                    }

                    provinceIds[neighborIndex] = provinceIndex;

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
        provinceIds,
        provinces,
    };
}