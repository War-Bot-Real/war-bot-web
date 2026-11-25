import type { Territory } from "../../../types/Territory";

interface TerritoriesInfoProps {
    territories: Territory[];
}

function TerritoriesInfo({ territories }: TerritoriesInfoProps) {
    return (
        <>
            <h2>
                {territories.length}{" "}
                {territories.length === 1 ? "territory" : "territories"}{" "}
                selected
            </h2>
            {territories.map((territory) => (
                <p key={territory.name}>{territory.name}, {territory.nation}</p>
            ))}
        </>
    );
}

export default TerritoriesInfo;