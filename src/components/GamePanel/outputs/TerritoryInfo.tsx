import type { Territory } from "../../../types/Territory";

interface TerritoryFlowProps {
    territory: Territory;
}

function TerritoryFlow({
    territory,
}: TerritoryFlowProps) {
    return (
        <>
            <h2>{territory.Name}</h2>

            <p>
                <strong>Nation:</strong>{" "}
                {territory.Nation}
            </p>

            <p>
                <strong>Population:</strong>{" "}
                {territory.Population.toLocaleString()}
            </p>

            <p>
                <strong>Area:</strong>{" "}
                {territory.Area.toLocaleString()}
            </p>

            <p>
                <strong>Terrain:</strong>{" "}
                {territory.Terrain}
            </p>

            <p>
                <strong>Coal:</strong>{" "}
                {territory.Coal}
            </p>

            <p>
                <strong>Oil:</strong>{" "}
                {territory.Oil}
            </p>

            <p>
                <strong>Devastation:</strong>{" "}
                {territory.Devastation}
            </p>
        </>
    );
}

export default TerritoryFlow;