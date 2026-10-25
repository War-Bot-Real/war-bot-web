import { useEffect, useState } from "react";
import type { MapData } from "../../../types/MapData";
import type { Territory } from "../../../types/Territory";
import { getGameTime } from "../../../api";
import { formatTime } from "../../../utils";

interface TerritoryFlowProps {
    territory: Territory;
    mapData: MapData
}

function TerritoryFlow({territory, mapData}: TerritoryFlowProps) {
    const [gameTime, setGameTime] = useState(0);
    useEffect(() => {
      async function fetchGameTime() {
        const time = await getGameTime();
        setGameTime(time);
      }

      fetchGameTime();
    }, [territory]);

    return (
        <>
            <h2>{territory.name}</h2>

            <p>
                <strong>Nation:</strong>{" "}
                {territory.nation}
            </p>

            <p>
                <strong>Population:</strong>{" "}
                {territory.population.toLocaleString()}
            </p>

            <p>
                <strong>Area:</strong>{" "}
                {territory.area.toLocaleString()}
            </p>

            <p>
                <strong>Terrain:</strong>{" "}
                {mapData.Terrains[territory.terrain - 1].Name}
            </p>

            <p>
                <strong>Coal:</strong>{" "}
                {territory.coal}
            </p>

            <p>
                <strong>Oil:</strong>{" "}
                {territory.oil}
            </p>

            <p>
                <strong>Devastation:</strong>{" "}
                {territory.devastation}
            </p>

            {gameTime === 0 ? <p><strong>Integration:</strong> Loading...</p> : territory.integrated <= gameTime ? <strong>Territory Fully Integrated!</strong> : <p>Territory Integrated in <strong>{formatTime(territory.integrated - gameTime)}</strong></p>}
        </>
    );
}

export default TerritoryFlow;