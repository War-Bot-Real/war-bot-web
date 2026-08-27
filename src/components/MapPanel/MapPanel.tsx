import { useEffect, useState } from "react";
import GameMap from "./GameMap";
import MapModeBar, { type MapMode } from "./MapModeBar";

import type { Selection } from "../../types/Selection";

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
    const [mapDimensions, setMapDimensions] =
      useState({
          width: 847,
          height: 672,
      });
    
    const [mapPanelWidth, setMapPanelWidth] = useState(600);

    useEffect(() => {
        const updateMapPanelWidth = () => {
            const mapHeight =
                window.innerHeight - 60 - 50 - 50;

            const aspectRatio =
                mapDimensions.width /
                mapDimensions.height;

            const mapWidth =
                mapHeight * aspectRatio;

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
        <section className="map-panel" style={{width: `${mapPanelWidth}px`}}>
            <div className="entity-search">
                <input
                    type="text"
                    placeholder="Search territories or nations..."
                />
            </div>

            <div className="map-container">
                <GameMap
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