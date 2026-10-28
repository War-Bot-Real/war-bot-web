import { useEffect, useState } from "react";
import type { MapData } from "../../../types/MapData";
import type { Territory } from "../../../types/Territory";
import { getGameTime, getMapData } from "../../../api";
import { formatTime } from "../../../utils";

interface TerritoryFlowProps {
    territory: Territory;
}

function TerritoryFlow({territory}: TerritoryFlowProps) {
    const [gameTime, setGameTime] = useState(0);
    const [mapData, setMapData] = useState<MapData>();

    useEffect(() => {
      async function fetchProps() {
        const [time, mapData] = await Promise.all([getGameTime(), getMapData()]);
        setGameTime(time);
        setMapData(mapData);
      }

      fetchProps();
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
                {mapData ? mapData.Terrains[territory.terrain - 1].Name : "Loading Terrain..."}
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