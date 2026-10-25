import { useEffect, useState } from "react";
import { getBorders, getNationBorders } from "../../api";
import type { Selection } from "../../types/Selection";
import type { TerritoryAsBorder } from "../../types/Territory";
import Flag from "../../components/Flag";

function BordersFlow({ selection }: { selection: Selection }) {
    const [borders, setBorders] = useState<TerritoryAsBorder[] | null>(null);
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        setBorders(null);
        setName(null);

        if (selection === null) {
            return;
        }

        const loadBorders = async () => {
            try {
                  let response: TerritoryAsBorder[];
                  if (selection.type === 'nation') {
                    setName(selection.nation.name);
                    response = await getNationBorders(selection.nation.name);
                  } else {
                    setName(selection.territory.name);
                    response = await getBorders(selection.territory.name);
                  }
                  setBorders(response);
            } catch (error) {
                console.error("Failed to get borders:", error);
            }
        };

        loadBorders();
    }, [selection]);

    if (selection === null) {
        return (
            <div className="borders-flow">
                <p className="command-empty">
                    Select a territory or nation on the map to see its borders.
                </p>
            </div>
        );
    }

    if (borders === null || name === null) {
        return <p>Loading...</p>;
    }

    return (
        <div className="borders-flow">
            <h2>Borders of {name}</h2>

            <div className="command-list">
                {borders.map((bordering) => (
                    <div className="command-row" key={bordering.Name}>
                        <span>
                            {bordering.NationFlag ? <Flag code={bordering.NationFlag}></Flag> : <></>}
                            <strong>{bordering.Name}</strong>, {bordering.Nation}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BordersFlow;