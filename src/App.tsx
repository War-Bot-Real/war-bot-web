import { useState } from "react";
import "./App.css";

import GameMap from "./components/GameMap/GameMap";
import type { Territory } from "./types/Territory";

function App() {
    const [selectedTerritory, setSelectedTerritory] =
        useState<Territory | null>(null);

    return (
        <main className="game">
            <section className="map">
                <GameMap
                    territorySelected={setSelectedTerritory}
                />
            </section>

            <aside className="panel">
                {selectedTerritory ? (
                    <>
                        <h2>{selectedTerritory.Name}</h2>

                        <p>
                            <strong>Nation:</strong>{" "}
                            {selectedTerritory.Nation}
                        </p>

                        <p>
                            <strong>Population:</strong>{" "}
                            {selectedTerritory.Population.toLocaleString()}
                        </p>

                        <p>
                            <strong>Area:</strong>{" "}
                            {selectedTerritory.Area.toLocaleString()}
                        </p>

                        <p>
                            <strong>Terrain:</strong>{" "}
                            {selectedTerritory.Terrain}
                        </p>

                        <p>
                            <strong>Coal:</strong>{" "}
                            {selectedTerritory.Coal}
                        </p>

                        <p>
                            <strong>Oil:</strong>{" "}
                            {selectedTerritory.Oil}
                        </p>

                        <p>
                            <strong>Devastation:</strong>{" "}
                            {selectedTerritory.Devastation}
                        </p>
                    </>
                ) : (
                    <>
                        <h2>No Territory Selected</h2>
                        <p>Click a territory on the map.</p>
                    </>
                )}
            </aside>
        </main>
    );
}

export default App;