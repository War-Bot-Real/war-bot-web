import { useEffect, useState } from "react";
import GameMap from "./GameMap";
import MapModeBar, { type MapMode } from "./MapModeBar";
import EntitySearch from "./EntitySearch";
import { supabase } from "../../lib/supabase";

import { getTerritories, getNations, getGameTime } from "../../api";

import type { Selection } from "../../types/Selection";
import type { Territory } from "../../types/Territory";
import type { Nation } from "../../types/Nation";
import MapUpdatePopup from "./MapUpdatePopup";
import type { MapData } from "../../types/MapData";

interface MapPanelProps {
    selection: Selection;
    setSelection: (selection: Selection) => void;
    mapMode: MapMode;
    setMapMode: (mode: MapMode) => void;
    mapData: MapData
}

function MapPanel({
    selection,
    setSelection,
    mapMode,
    setMapMode,
    mapData
}: MapPanelProps) {
    const [territories, setTerritories] = useState<Territory[]>([]);
    const [nations, setNations] = useState<Nation[]>([]);
    const [mapChanged, setMapChanged] = useState(false);
    const [gameTime, setGameTime] = useState(0);

    const [mapDimensions, setMapDimensions] = useState({ width: 847, height: 672 });
    const [mapPanelWidth, setMapPanelWidth] = useState(600);
    const [shrink, setShrink] = useState(false);
      
    const loadEntities = async () => {
        try {
            const [territories, nations, gameTime] = await Promise.all([getTerritories(), getNations(), getGameTime()]);

            setTerritories(territories);
            setNations(nations);
            setGameTime(gameTime);
        } catch (error) {
            console.error(
                "Failed to load entities:",
                error,
            );
        }
    };

    useEffect(() => {
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

    
    useEffect(() => {
        const channel = supabase
            .channel("map-changes", {
                config: { private: true },
            })
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "map_changes",
                },
                (payload) => {
                    setMapChanged(true);
                }
            )
            .subscribe((status, err) => {
                console.log("Map changes:", status);
                if (err) console.error("Realtime error:", err);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function updateMap() {
      await loadEntities();
      setMapChanged(false);
    }

    return (
        <section
            className="map-panel"
            style={{ width: `${mapPanelWidth}px` }}
        >
            <EntitySearch
                territories={territories}
                nations={nations}
                setSelection={setSelection}
            />

            <div className="map-container">
                {mapChanged ? <MapUpdatePopup onUpdate={updateMap}/> : <></>}

                <button className="map-reload" onClick={updateMap}>⟳</button>

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
                    mapMode={mapMode}
                    gameTime={gameTime}
                    mapData={mapData}
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