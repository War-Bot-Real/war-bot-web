
import { useEffect, useState } from "react";

import './MobilePortrait.css'
import GameMap from "../../../components/GameMap/GameMap";
import EntitySearch from "../../../components/EntitySearch/EntitySearch";
import MapModeBar from "../../../components/MapModeBar/MapModeBar";
import MapUpdatePopup from "../../../components/GameMap/MapUpdatePopup";

import OutputPanel from "../../../components/OutputPanel/OutputPanel";
import CommandPanel from "../../../components/CommandPanel/CommandPanel";
import NotificationBar from "../../../components/NotificationBar/NotificationBar";

import { commands } from "../../../commands/commands";
import { LayoutConstants, type LayoutProps } from "./selectLayout";

function MobilePortrait({
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
}: LayoutProps) {
    const [mapDimensions, setMapDimensions] = useState({ width: 847, height: 672 });
    const [mapPanelWidth, setMapPanelWidth] = useState(600);

    useEffect(() => {
        const updateMapPanelWidth = () => {
            const mapHeight = window.innerHeight - LayoutConstants.navbarHeight - LayoutConstants.entitySearchHeight - LayoutConstants.mapModeBarHeight;
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
                <section className="infobar">
                    <EntitySearch
                        territories={territories}
                        nations={nations}
                        setSelection={setSelection}
                    />
                    <NotificationBar
                        nation={nation}
                        messages={messages}
                        popup={notifPopup}
                        setPopup={setNotifPopup}
                    />
                </section>

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
                <div className="output-section">
                    <div className="output-header">
                        <h2>{commandName}</h2>
                    </div>

                    <OutputPanel
                        selection={selection}
                        activeCommand={activeCommand}
                        nation={nation}
                    />
                </div>

                <CommandPanel
                    selection={selection}
                    nation={nation}
                    setActiveCommand={setActiveCommand}
                />
            </section>
        </>
    );
}

export default MobilePortrait;
