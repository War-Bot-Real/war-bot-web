import { useEffect, useState } from "react";
import "./GamePage.css"

import MapPanel from "../components/MapPanel/MapPanel";
import GamePanel from "../components/GamePanel/GamePanel";
import Navbar from "../components/NavBar/NavBar";

import type { Selection } from "../types/Selection";
import type { MapMode } from "../components/MapPanel/MapModeBar";

interface GamePageProps {
    onAccount: () => void;
}

function GamePage({ onAccount }: GamePageProps) {
    const [selection, setSelection] = useState<Selection>(null);
    const [activeCommand, setActiveCommand] = useState<string | null>(null);

    const [mapMode, setMapMode] = useState<MapMode>("political");

    useEffect(() => {
        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (event.key === "Escape") {
                setSelection(null);
                setActiveCommand(null);
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
    }, []);

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
                setActiveCommand={setActiveCommand}
            />
        </main>
      </div>
    );
}

export default GamePage;