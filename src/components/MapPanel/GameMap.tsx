import { useEffect, useRef } from "react";
import { Application, Assets, Sprite, Texture } from "pixi.js";

import { getMapUrl, getMapData } from "../../api";
import { buildTerritoryLookup } from "../../map/buildTerritoryLookup";
import { buildPoliticalMap } from "../../map/buildPoliticalMap";
import { buildTerrainMap } from "../../map/buildTerrainMap";
import type { TerritoryPixelLookup, Territory } from "../../types/Territory";
import type { Nation } from "../../types/Nation";
import type { Selection } from "../../types/Selection";
import type { MapMode } from "./MapModeBar";
import type { MapData } from "../../types/MapData";

interface GameMapProps {
    territories: Territory[];
    nations: Nation[];
    selection: Selection;
    territorySelected: (territory: Territory) => void;
    nationSelected: (nation: Nation) => void;
    onMapDimensions: (width: number, height: number) => void;
    shrink: boolean;
    mapMode: MapMode
}

function GameMap({
    territories,
    nations,
    selection,
    territorySelected,
    nationSelected,
    onMapDimensions,
    shrink,
    mapMode
}: GameMapProps) {
    if (territories.length === 0 || nations.length === 0) {
        return;
    }

    const containerRef = useRef<HTMLDivElement>(null);
    const lookupRef = useRef<TerritoryPixelLookup | null>(null);
    const mapModeRef = useRef<Sprite | null>(null);
    const mapDataRef = useRef<MapData | null>(null);
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
                const [mapUrl, mapData] = await Promise.all([getMapUrl(shrink), getMapData()]);
                mapDataRef.current = mapData;

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
                 * Build the map mode images.
                 */
                const politicalImage = buildPoliticalMap(
                    lookup,
                    nations,
                    selection,
                );

                const terrainImage = buildTerrainMap(
                    lookup,
                    mapData,
                );

                const mapModeImage = mapMode === "terrain" ? terrainImage : politicalImage;

                const mapModeCanvas = document.createElement("canvas");

                mapModeCanvas.width = lookup.width;
                mapModeCanvas.height = lookup.height;

                const mapModeContext = mapModeCanvas.getContext("2d");

                if (!mapModeContext) {
                    throw new Error("Could not create map mode canvas");
                }

                mapModeContext.putImageData(mapModeImage, 0, 0);

                const mapModeTexture = Texture.from(mapModeCanvas);

                mapModeTexture.source.scaleMode = "nearest";

                if (cancelled) return;

                const mapModeSprite = new Sprite(mapModeTexture);

                mapModeRef.current = mapModeSprite;

                pixiApp.stage.addChild(mapModeSprite);

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

                    mapModeSprite.scale.set(scale);
                    mapModeSprite.position.set(x, y);
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
    }, [shrink, territories, nations]);

    useEffect(() => {
        const lookup = lookupRef.current;
        const mapModeSprite = mapModeRef.current;
        const mapData = mapDataRef.current;

        if (!lookup || !mapModeSprite || !mapData || nations.length === 0) {
            return;
        }

        let image: ImageData;
        if (mapMode === "terrain") {
            image = buildTerrainMap(lookup, mapData);
        } else {
            image = buildPoliticalMap(lookup, nations, selection);
        }

        const canvas = document.createElement("canvas");
        canvas.width = lookup.width;
        canvas.height = lookup.height;

        const context = canvas.getContext("2d");
        if (!context) {
            return;
        }
        context.putImageData(image, 0, 0);

        const texture = Texture.from(canvas);
        texture.source.scaleMode = "nearest";

        const oldTexture = mapModeSprite.texture;

        mapModeSprite.texture = texture;

        oldTexture.destroy(true);
    }, [selection, mapMode]);

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