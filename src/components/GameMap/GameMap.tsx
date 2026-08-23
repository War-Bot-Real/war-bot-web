import { useEffect, useRef } from "react";
import { Application, Assets, Sprite, Texture } from "pixi.js";

import { getMapUrl, getTerritories, getNations } from "../../api";
import { buildTerritoryLookup } from "../../map/buildTerritoryLookup";
import { buildPoliticalMap } from "../../map/buildPoliticalMap";
import type { TerritoryPixelLookup, Territory } from "../../types/Territory";
import type { Nation } from "../../types/Nation";
import type { Selection } from "../../types/Selection";

interface GameMapProps {
    selection: Selection;
    territorySelected: (territory: Territory) => void;
    nationSelected: (nation: Nation) => void;
}

function GameMap({ selection, territorySelected, nationSelected }: GameMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lookupRef = useRef<TerritoryPixelLookup | null>(null);

    useEffect(() => {
        let app: Application | null = null;
        let cancelled = false;

        const initialize = async () => {
            const container = containerRef.current;

            if (!container) return;

            const pixiApp = new Application();

            await pixiApp.init({
                resizeTo: container,
                background: "white",
            });

            if (cancelled) {
                pixiApp.destroy(true);
                return;
            }

            app = pixiApp;
            container.appendChild(pixiApp.canvas);

            try {
                /*
                 * Get map, territories, and nations.
                 */
                const [
                    mapUrl,
                    territories,
                    nations,
                ] = await Promise.all([
                    getMapUrl(),
                    getTerritories(),
                    getNations(),
                ]);

                if (cancelled) return;

                /*
                 * Load the original PNG.
                 */
                const texture = await Assets.load(mapUrl);

                if (cancelled) return;

                const map = new Sprite(texture);

                pixiApp.stage.addChild(map);

                /*
                 * Create a temporary canvas so we can
                 * inspect the original PNG's pixels.
                 */
                const image = new Image();

                image.crossOrigin = "anonymous";
                image.src = mapUrl;

                await image.decode();

                if (cancelled) return;

                const canvas = document.createElement("canvas");

                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;

                const context = canvas.getContext("2d");

                if (!context) {
                    throw new Error(
                        "Could not create 2D canvas context",
                    );
                }

                context.drawImage(image, 0, 0);

                const imageData = context.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                );

                /*
                 * Build the pixel → territory lookup.
                 */
                const lookup = buildTerritoryLookup(
                    imageData,
                    territories,
                );

                lookupRef.current = lookup;

                console.log(
                    `Territory lookup built: ${canvas.width} × ${canvas.height}`,
                );

                /*
                 * Build the political color image.
                 */
                const politicalImage = buildPoliticalMap(
                    lookup,
                    nations,
                );

                /*
                 * Put the political ImageData into
                 * another canvas.
                 */
                const politicalCanvas =
                    document.createElement("canvas");

                politicalCanvas.width = lookup.width;
                politicalCanvas.height = lookup.height;

                const politicalContext =
                    politicalCanvas.getContext("2d");

                if (!politicalContext) {
                    throw new Error(
                        "Could not create political map canvas",
                    );
                }

                politicalContext.putImageData(
                    politicalImage,
                    0,
                    0,
                );

                /*
                 * Turn the canvas into a Pixi texture.
                 */
                const politicalTexture = Texture.from(politicalCanvas);

                if (cancelled) return;

                const politicalMap =
                    new Sprite(politicalTexture);

                /*
                 * Put the political layer above the
                 * original map.
                 */
                pixiApp.stage.addChild(politicalMap);

                /*
                 * Handle clicks on the original map.
                 */
                map.eventMode = "static";
                map.cursor = "pointer";

                map.on("pointerdown", (event) => {
                    const lookup = lookupRef.current;

                    if (!lookup) return;

                    const position =
                        event.getLocalPosition(map);

                    const x = Math.floor(position.x);
                    const y = Math.floor(position.y);

                    if (
                        x < 0 ||
                        x >= lookup.width ||
                        y < 0 ||
                        y >= lookup.height
                    ) {
                        return;
                    }

                    const index =
                        y * lookup.width + x;

                    const territoryIndex =
                        lookup.territoryIds[index];

                    if (territoryIndex === -1) {
                        return;
                    }

                    const territory =
                        lookup.territories[
                            territoryIndex
                        ];

                    if (event.shiftKey || event.ctrlKey) {
                        const nation = nations.find((nation: Nation) => nation.Name === territory.Nation);

                        if (nation) {
                            nationSelected(nation);
                        }
                    } else {
                        territorySelected(territory);
                    }
                });
            } catch (error) {
                console.error(
                    "Failed to load map:",
                    error,
                );
            }
        };

        initialize();

        return () => {
            cancelled = true;

            if (app) {
                app.destroy(true);
                app = null;
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
            }}
        />
    );
}

export default GameMap;