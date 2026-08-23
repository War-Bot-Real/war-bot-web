import { useEffect, useRef } from "react";
import { Application, Assets, Sprite } from "pixi.js";

import { getMapUrl, getTerritories } from "../../api";
import { buildTerritoryLookup } from "../../map/BuildTerritoryLookup";
import type { TerritoryPixelLookup } from "../../types/Territory";

function GameMap() {
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
                // Get both pieces of data.
                const [mapUrl, territories] = await Promise.all([
                    getMapUrl(),
                    getTerritories(),
                ]);

                if (cancelled) return;

                // Load the actual PNG.
                const texture = await Assets.load(mapUrl);

                if (cancelled) return;

                const map = new Sprite(texture);

                pixiApp.stage.addChild(map);

                /*
                 * Create a temporary canvas so we can inspect
                 * the original PNG's pixels.
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
                    throw new Error("Could not create 2D canvas context");
                }

                context.drawImage(image, 0, 0);

                const imageData = context.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                );

                lookupRef.current = buildTerritoryLookup(
                    imageData,
                    territories,
                );

                console.log(
                    `Territory lookup built: ${canvas.width} × ${canvas.height}`,
                );

                /*
                 * Handle clicks on the Pixi map.
                 */
                map.eventMode = "static";
                map.cursor = "pointer";

                map.on("pointerdown", (event) => {
                    const lookup = lookupRef.current;

                    if (!lookup) return;

                    /*
                     * Convert the mouse position into the map's
                     * original PNG coordinates.
                     */
                    const position = event.getLocalPosition(map);

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

                    const index = y * lookup.width + x;

                    const territoryIndex =
                        lookup.territoryIds[index];

                    if (territoryIndex === -1) {
                        console.log("Clicked water/border.");
                        return;
                    }

                    const territory =
                        lookup.territories[territoryIndex];

                    console.log("Clicked territory:", territory);
                });
            } catch (error) {
                console.error("Failed to load map:", error);
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