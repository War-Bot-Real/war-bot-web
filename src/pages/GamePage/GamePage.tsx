
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import "./GamePage.css";
import { LAYOUT } from "./Layouts/LayoutConstants";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/NavBar/NavBar";
import EventPopup from "../../components/EventPopup/EventPopup";
import Desktop from "./Layouts/Desktop";
import { me, getNation, getMessages } from "../../api";
import { useMapData } from "../../map/useMapData";

import type { Selection } from "../../types/Selection";
import type { MapMode } from "../../components/MapModeBar/MapModeBar";
import type { Nation } from "../../types/Nation";
import type { Message } from "../../types/Messages";
import type { NotificationPopup } from "../../types/NotificationPopup";

interface GamePageProps {
    onAccount: () => void;
    onAdmin: () => void;
}

function GamePage({ onAccount, onAdmin }: GamePageProps) {
    const layoutStyle = {
        "--navbar-height": `${LAYOUT.navbarHeight}px`,
        "--entity-search-height": `${LAYOUT.entitySearchHeight}px`,
        "--map-mode-bar-height": `${LAYOUT.mapModeBarHeight}px`,
    } as CSSProperties;

    const [selection, setSelection] = useState<Selection>(null);
    const [activeCommand, setActiveCommand] = useState<string | null>(null);
    const [notifPopup, setNotifPopup] = useState<NotificationPopup>(null);
    const [nation, setNation] = useState<Nation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [events, setEvents] = useState<Message[]>([]);
    const [mapMode, setMapMode] = useState<MapMode>("political");

    const { territories, nations, gameTime, mapChanged, updateMap } = useMapData();

    const eventSounds = useRef({
        default: new Audio("/event_default.mp3"),
        war: new Audio("/event_war.mp3")
    });

    function getEventMusic(type: string) {
        if (type === "war") return eventSounds.current.war;
        return eventSounds.current.default;
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                if (events.length > 0) {
                    setEvents(current => current.slice(1));
                } else if (notifPopup !== null) {
                    setNotifPopup(null);
                } else if (selection !== null) {
                    setSelection(null);
                } else if (activeCommand !== null) {
                    setActiveCommand(null);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selection, activeCommand, notifPopup, events]);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await me();
                if (user.nation) {
                    setNation(await getNation(user.nation));
                    setMessages((await getMessages())["result"]);
                }
            } catch (error) {
                console.error("Failed to load user:", error);
            }
        };

        loadUser();
    }, []);

    useEffect(() => {
        if (!nation) return;

        const channel = supabase
            .channel(`${nation.name}:events`, { config: { private: true } })
            .on("broadcast", { event: "notification" }, payload => {
                getEventMusic(payload.payload.type).play();
                setEvents(current => [payload.payload, ...current]);
            })
            .on("broadcast", { event: "message" }, payload => {
                getEventMusic(payload.payload.type).play();
                setEvents(current => [payload.payload, ...current]);
            })
            .subscribe((status, err) => {
                console.log(`Realtime ${nation.name}:events:`, status);
                if (err) console.error("Realtime error details:", err);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [nation]);

    return (
        <div className="game-page" style={layoutStyle}>
            <Navbar onAccount={onAccount} onAdmin={onAdmin} />

            <EventPopup events={events} setEvents={setEvents} />

            <main className="game">
                <Desktop
                    selection={selection}
                    setSelection={setSelection}
                    activeCommand={activeCommand}
                    setActiveCommand={setActiveCommand}
                    notifPopup={notifPopup}
                    setNotifPopup={setNotifPopup}
                    nation={nation}
                    messages={messages}
                    territories={territories}
                    nations={nations}
                    gameTime={gameTime}
                    mapChanged={mapChanged}
                    updateMap={updateMap}
                    mapMode={mapMode}
                    setMapMode={setMapMode}
                />
            </main>
        </div>
    );
}

export default GamePage;