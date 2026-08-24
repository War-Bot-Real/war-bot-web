import { useEffect, useState } from "react";
import "./GamePage.css"

import MapPanel from "../components/MapPanel/MapPanel";
import GamePanel from "../components/GamePanel/GamePanel";

import type { Selection } from "../types/Selection";
import type { MapMode } from "../components/MapPanel/MapModeBar";

function GamePage() {
    const [selection, setSelection] =
        useState<Selection>(null);

    const [mapMode, setMapMode] =
        useState<MapMode>("political");

    useEffect(() => {
        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (event.key === "Escape") {
                setSelection(null);
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
        <main className="game">
            <MapPanel
                selection={selection}
                setSelection={setSelection}
                mapMode={mapMode}
                setMapMode={setMapMode}
            />

            <GamePanel
                selection={selection}
            />
        </main>
    );
}

export default GamePage;