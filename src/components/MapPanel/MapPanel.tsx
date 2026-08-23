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
    return (
        <section className="map-panel">
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