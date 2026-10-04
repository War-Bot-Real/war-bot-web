import type { Territory } from "../../../types/Territory";

interface TerritoryFlowProps {
    territory: Territory;
}

function TerritoryFlow({
    territory,
}: TerritoryFlowProps) {
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
                {territory.terrain}
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
        </>
    );
}

export default TerritoryFlow;