type MapMode =
    | "political"
    | "terrain"
    | "resources"
    | "buildings"
    | "army"
    | "growth"
    | "sea";

interface MapModeBarProps {
    mapMode: MapMode;
    setMapMode: (mode: MapMode) => void;
}

function MapModeBar({
    mapMode,
    setMapMode,
}: MapModeBarProps) {
    const modes: {
        id: MapMode;
        label: string;
    }[] = [
        { id: "political", label: "Political" },
        { id: "terrain", label: "Terrain" },
        { id: "resources", label: "Resources" },
        { id: "buildings", label: "Buildings" },
        { id: "army", label: "Army" },
        { id: "growth", label: "Growth" },
        { id: "sea", label: "Sea" },
    ];

    return (
        <div className="map-mode-bar">
            {modes.map((mode) => (
                <button
                    key={mode.id}
                    className={
                        mapMode === mode.id
                            ? "active"
                            : ""
                    }
                    onClick={() => setMapMode(mode.id)}
                >
                    {mode.label}
                </button>
            ))}
        </div>
    );
}

export type { MapMode };

export default MapModeBar;