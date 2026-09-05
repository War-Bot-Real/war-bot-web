import { useEffect, useState } from "react";
import GameMap from "./GameMap";
import MapModeBar, { type MapMode } from "./MapModeBar";

import { getTerritories, getNations } from "../../api";

import type { Selection } from "../../types/Selection";
import type { Territory } from "../../types/Territory";
import type { Nation } from "../../types/Nation";

interface MapPanelProps {
    selection: Selection;
    setSelection: (selection: Selection) => void;
    mapMode: MapMode;
    setMapMode: (mode: MapMode) => void;
}

function MapPanel({
    selection,
    setSelection,
    mapMode,
    setMapMode,
}: MapPanelProps) {
    const [territories, setTerritories] =
        useState<Territory[]>([]);

    const [nations, setNations] =
        useState<Nation[]>([]);

    const [mapDimensions, setMapDimensions] =
        useState({
            width: 847,
            height: 672,
        });

    const [mapPanelWidth, setMapPanelWidth] =
        useState(600);

    const [shrink, setShrink] =
        useState(false);

    useEffect(() => {
        const loadEntities = async () => {
            try {
                const [
                    territories,
                    nations,
                ] = await Promise.all([
                    getTerritories(),
                    getNations(),
                ]);

                setTerritories(territories);
                setNations(nations);
            } catch (error) {
                console.error(
                    "Failed to load entities:",
                    error,
                );
            }
        };

        loadEntities();
    }, []);

    useEffect(() => {
        const updateMapPanelWidth = () => {
            const mapHeight =
                window.innerHeight - 60 - 50 - 50;

            const aspectRatio =
                mapDimensions.width /
                mapDimensions.height;

            const mapWidth =
                mapHeight * aspectRatio;

            setShrink(
                (mapHeight / mapDimensions.height) < 0.9,
            );

            setMapPanelWidth(mapWidth);
        };

        updateMapPanelWidth();

        window.addEventListener(
            "resize",
            updateMapPanelWidth,
        );

        return () => {
            window.removeEventListener(
                "resize",
                updateMapPanelWidth,
            );
        };
    }, [mapDimensions]);

    return (
        <section
            className="map-panel"
            style={{ width: `${mapPanelWidth}px` }}
        >
            <div className="entity-search">
                <input
                    type="text"
                    placeholder="Search territories or nations..."
                />
            </div>

            <div className="map-container">
                <GameMap
                    territories={territories}
                    nations={nations}
                    selection={selection}
                    territorySelected={(territory) =>
                        setSelection({
                            type: "territory",
                            territory,
                        })
                    }
                    nationSelected={(nation) =>
                        setSelection({
                            type: "nation",
                            nation,
                        })
                    }
                    onMapDimensions={(width, height) =>
                        setMapDimensions({
                            width,
                            height,
                        })
                    }
                    shrink={shrink}
                />
            </div>

            <MapModeBar
                mapMode={mapMode}
                setMapMode={setMapMode}
            />
        </section>
    );
}

export default MapPanel;