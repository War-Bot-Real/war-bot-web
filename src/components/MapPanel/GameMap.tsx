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
    onMapDimensions: (width: number, height: number) => void;
}

function GameMap({
    selection,
    territorySelected,
    nationSelected,
    onMapDimensions
}: GameMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lookupRef = useRef<TerritoryPixelLookup | null>(null);
    const nationsRef = useRef<Nation[]>([]);
    const politicalMapRef = useRef<Sprite | null>(null);
    const clickSound = useRef(new Audio("/click_territory.wav"));

    useEffect(() => {
        let app: Application | null = null;
        let resizeObserver: ResizeObserver | null = null;
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
            app.renderer.background.color = '#F5F5F5'
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
                    getMapUrl(true),
                    getTerritories(),
                    getNations(),
                ]);

                nationsRef.current = nations;

                if (cancelled) return;

                /*
                 * Load the original PNG.
                 */
                const texture = await Assets.load(mapUrl);
                texture.source.scaleMode = "nearest";

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
                onMapDimensions(
                    lookup.width,
                    lookup.height,
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
                    selection,
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
                politicalTexture.source.scaleMode = "nearest";

                if (cancelled) return;

                const politicalMap = new Sprite(politicalTexture);

                politicalMapRef.current = politicalMap;

                /*
                 * Put the political layer above the
                 * original map.
                 */
                pixiApp.stage.addChild(politicalMap);

                /*
                 * Resize both map layers so that the
                 * entire map fits inside the container
                 * while preserving its aspect ratio.
                 */
                const resizeMap = () => {
                    const containerWidth =
                        container.clientWidth;

                    const containerHeight =
                        container.clientHeight;

                    if (
                        containerWidth <= 0 ||
                        containerHeight <= 0
                    ) {
                        return;
                    }

                    const scaleX =
                        containerWidth / lookup.width;

                    const scaleY =
                        containerHeight / lookup.height;

                    const scale = Math.min(
                        scaleX,
                        scaleY,
                    );

                    const mapWidth =
                        lookup.width * scale;

                    const mapHeight =
                        lookup.height * scale;

                    const x =
                        (containerWidth - mapWidth) / 2;

                    const y =
                        (containerHeight - mapHeight) / 2;

                    map.scale.set(scale);
                    map.position.set(x, y);

                    politicalMap.scale.set(scale);
                    politicalMap.position.set(x, y);
                };

                /*
                 * Resize immediately.
                 */
                resizeMap();

                /*
                 * Resize whenever the map container
                 * changes size.
                 */
                resizeObserver = new ResizeObserver(
                    resizeMap,
                );

                resizeObserver.observe(container);

                /*
                 * Handle clicks on the original map.
                 */
                map.eventMode = "static";
                map.cursor = "pointer";

                map.on("pointerdown", (event) => {
                    const lookup =
                        lookupRef.current;

                    if (!lookup) return;

                    /*
                     * getLocalPosition(map) converts the
                     * displayed/scaled coordinates back
                     * into the original map's coordinate
                     * system.
                     */
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

                    if (
                        event.shiftKey ||
                        event.ctrlKey
                    ) {
                        const nation =
                            nations.find(
                                (nation: Nation) =>
                                    nation.Name ===
                                    territory.Nation,
                            );

                        if (nation) {
                            nationSelected(nation);
                            clickSound.current.play();
                        }
                    } else {
                        territorySelected(territory);
                        clickSound.current.play();
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

            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }

            if (app) {
                app.destroy(true);
                app = null;
            }
        };
    }, []);

    useEffect(() => {
        const lookup = lookupRef.current;
        const politicalMap =
            politicalMapRef.current;
        const nations = nationsRef.current;

        if (
            !lookup ||
            !politicalMap ||
            nations.length === 0
        ) {
            return;
        }

        const politicalImage =
            buildPoliticalMap(
                lookup,
                nations,
                selection,
            );

        const canvas =
            document.createElement("canvas");

        canvas.width = lookup.width;
        canvas.height = lookup.height;

        const context =
            canvas.getContext("2d");

        if (!context) {
            return;
        }

        context.putImageData(
            politicalImage,
            0,
            0,
        );

        const texture = Texture.from(canvas);
        texture.source.scaleMode = "nearest";

        const oldTexture = politicalMap.texture;

        politicalMap.texture = texture;

        oldTexture.destroy(true);
    }, [selection]);

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