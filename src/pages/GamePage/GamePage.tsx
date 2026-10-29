
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import "./GamePage.css";
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
import selectLayout, { LayoutConstants, type Layout } from "./Layouts/selectLayout";
import MobilePortrait from "./Layouts/MobilePortrait";
import MobileLandscape from "./Layouts/MobileLandscape";
import { commands } from "../../commands/commands";

interface GamePageProps {
    onAccount: () => void;
    onAdmin: () => void;
}

function GamePage({ onAccount, onAdmin }: GamePageProps) {
    const layoutStyle = {
        "--navbar-height": `${LayoutConstants.navbarHeight}px`,
        "--entity-search-height": `${LayoutConstants.entitySearchHeight}px`,
        "--map-mode-bar-height": `${LayoutConstants.mapModeBarHeight}px`,
    } as CSSProperties;

    const [selection, setSelection] = useState<Selection>(null);
    const [activeCommand, setActiveCommand] = useState<string | null>(null);
    const [notifPopup, setNotifPopup] = useState<NotificationPopup>(null);
    const [nation, setNation] = useState<Nation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [events, setEvents] = useState<Message[]>([]);
    const [mapMode, setMapMode] = useState<MapMode>("political");
    const [layout, setLayout] = useState<Layout>();

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
        function updateLayout() {
            setLayout(selectLayout(window.innerWidth, window.innerHeight));
        }

        updateLayout();
        window.addEventListener("resize", updateLayout);
        return () => window.removeEventListener("resize", updateLayout);
    }, []);

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

    const layoutProps = {
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
    };

    return (
        <div className={`game-page ${layout}`} style={layoutStyle}>
            <Navbar onAccount={onAccount} onAdmin={onAdmin} />

            <EventPopup events={events} setEvents={setEvents} />

            <main className="game">
                {layout === "desktop" && <Desktop {...layoutProps} />}
                {layout === "mobile-portrait" && <MobilePortrait {...layoutProps} />}
                {layout === "mobile-landscape" && <MobileLandscape {...layoutProps} />}
            </main>
        </div>
    );
}

export default GamePage;