import { useEffect, useState } from "react";

import "./GamePage.css"
import { supabase } from "../lib/supabase";
import MapPanel from "../components/MapPanel/MapPanel";
import GamePanel from "../components/GamePanel/GamePanel";
import Navbar from "../components/NavBar/NavBar";
import type { Selection } from "../types/Selection";
import type { MapMode } from "../components/MapPanel/MapModeBar";
import { me, getNation, getMessages } from "../api";
import type { Nation } from "../types/Nation";
import type { Message } from "../types/Messages";

interface GamePageProps {
    onAccount: () => void;
}

function GamePage({ onAccount }: GamePageProps) {
    const [selection, setSelection] = useState<Selection>(null);
    const [activeCommand, setActiveCommand] = useState<string | null>(null);
    const [nation, setNation] = useState<Nation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    const [mapMode, setMapMode] = useState<MapMode>("political");

    useEffect(() => {
        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (event.key === "Escape") {
                if (selection === null) {
                  setActiveCommand(null);
                } else {
                  setSelection(null);
                }
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [selection]);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await me();
                if (user.nation) {
                  setNation(await getNation(user.nation));
                  setMessages((await getMessages())["result"]);
                }
            } catch (error) {
                console.error(
                    "Failed to load user:",
                    error,
                );
            }
        };

        loadUser();
    }, []);

    useEffect(() => {
        if (!nation) return;

        const channel = supabase.channel(`${nation.Name}:events`, {
            config: { private: true, }}
            ).on(
                "broadcast",
                { event: "ally" },
                (payload) => {
                    console.log("Received ally event:", payload.payload);
                }
            )
            .subscribe((status) => {
                console.log(`Realtime ${nation.Name}:events:`, status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [nation]);

    return (
      <div className="game-page">
        <Navbar onAccount={onAccount} />
        <main className="game">
            <MapPanel
                selection={selection}
                setSelection={setSelection}
                mapMode={mapMode}
                setMapMode={setMapMode}
            />

            <GamePanel
                selection={selection}
                activeCommand={activeCommand}
                nation={nation}
                messages={messages}
                setActiveCommand={setActiveCommand}
            />
        </main>
      </div>
    );
}

export default GamePage;