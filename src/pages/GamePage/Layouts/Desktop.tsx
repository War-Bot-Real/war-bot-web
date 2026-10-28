
import { useEffect, useState } from "react";

import GameMap from "../../../components/GameMap/GameMap";
import EntitySearch from "../../../components/EntitySearch/EntitySearch";
import MapModeBar, { type MapMode } from "../../../components/MapModeBar/MapModeBar";
import MapUpdatePopup from "../../../components/GameMap/MapUpdatePopup";

import OutputPanel from "../../../components/OutputPanel/OutputPanel";
import CommandPanel from "../../../components/CommandPanel/CommandPanel";
import NotificationBar from "../../../components/NotificationBar/NotificationBar";

import { commands } from "../../../commands/commands";
import { LAYOUT } from "./LayoutConstants";

import type { Selection } from "../../../types/Selection";
import type { Territory } from "../../../types/Territory";
import type { Nation } from "../../../types/Nation";
import type { Message } from "../../../types/Messages";
import type { NotificationPopup } from "../../../types/NotificationPopup";

interface DesktopProps {
    selection: Selection;
    setSelection: (selection: Selection) => void;
    activeCommand: string | null;
    setActiveCommand: (command: string | null) => void;
    notifPopup: NotificationPopup;
    setNotifPopup: (popup: NotificationPopup) => void;
    nation: Nation | null;
    messages: Message[];
    territories: Territory[];
    nations: Nation[];
    gameTime: number;
    mapChanged: boolean;
    updateMap: () => Promise<void>;
    mapMode: MapMode;
    setMapMode: (mode: MapMode) => void;
}

function Desktop({
    selection,
    setSelection,
    activeCommand,
    setActiveCommand,
    notifPopup,
    setNotifPopup,
    nation,
    messages,
    territories,
    nations,
    gameTime,
    mapChanged,
    updateMap,
    mapMode,
    setMapMode
}: DesktopProps) {
    const [mapDimensions, setMapDimensions] = useState({ width: 847, height: 672 });
    const [mapPanelWidth, setMapPanelWidth] = useState(600);

    useEffect(() => {
        const updateMapPanelWidth = () => {
            const mapHeight = window.innerHeight
                - LAYOUT.navbarHeight
                - LAYOUT.entitySearchHeight
                - LAYOUT.mapModeBarHeight;
            const aspectRatio = mapDimensions.width / mapDimensions.height;
            setMapPanelWidth(mapHeight * aspectRatio);
        };

        updateMapPanelWidth();
        window.addEventListener("resize", updateMapPanelWidth);
        return () => window.removeEventListener("resize", updateMapPanelWidth);
    }, [mapDimensions]);

    const commandName = commands.find(
        command => command.id === activeCommand
    )?.name ?? "";

    return (
        <>
            <section className="map-section" style={{ width: `${mapPanelWidth}px` }}>
                <EntitySearch
                    territories={territories}
                    nations={nations}
                    setSelection={setSelection}
                />

                <div className="map-container">
                    {mapChanged && <MapUpdatePopup onUpdate={updateMap} />}

                    <button className="map-reload" onClick={updateMap}>⟳</button>

                    <GameMap
                        territories={territories}
                        nations={nations}
                        selection={selection}
                        territorySelected={territory =>
                            setSelection({ type: "territory", territory })
                        }
                        nationSelected={nation =>
                            setSelection({ type: "nation", nation })
                        }
                        onMapDimensions={(width, height) =>
                            setMapDimensions({ width, height })
                        }
                        mapMode={mapMode}
                        gameTime={gameTime}
                    />
                </div>

                <MapModeBar mapMode={mapMode} setMapMode={setMapMode} />
            </section>

            <section className="game-section">
                <div className="output-header">
                    <h2>{commandName}</h2>
                    <NotificationBar
                        nation={nation}
                        messages={messages}
                        popup={notifPopup}
                        setPopup={setNotifPopup}
                    />
                </div>

                <OutputPanel
                    selection={selection}
                    activeCommand={activeCommand}
                    nation={nation}
                />

                <CommandPanel
                    selection={selection}
                    nation={nation}
                    setActiveCommand={setActiveCommand}
                />
            </section>
        </>
    );
}

export default Desktop;
