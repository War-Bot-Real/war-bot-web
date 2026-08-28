import { useEffect, useState } from "react";
import { getBorders, getNationBorders } from "../../api";
import type { Selection } from "../../types/Selection";
import type { Territory } from "../../types/Territory";

function BordersFlow( { selection }: { selection: Selection }) {
    if (selection === null) {
      return <p>Select a territory or nation on the map to see it's borders.</p> 
    }

    const [borders, setBorders] = useState<string[] | null>(null);
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        const loadBorders = async () => {
            try {
                if (selection.type == "territory") {
                  setName(selection.territory.Name)
                  setBorders((await getBorders(selection.territory.Name)).Bordering);
                } else {
                  setName(selection.nation.Name)
                  const nationBorders = await getNationBorders(selection.nation.Name);
                  const borders = nationBorders.map((terr: Territory) => {
                    return terr.Name + ", " + terr.Nation
                  })
                  setBorders(borders)
                }
            } catch (error) {
                console.error("Failed to get borders:", error);
            }
        };

        loadBorders();
    }, [selection]);

    if (borders === null || name === null) {
        return <p>Loading...</p>;
    }

    return (
      <div>
          <p>Borders of <b>{name}</b></p>
          {borders.map((bordering) => (
              <p key={bordering}>
                  {bordering}
              </p>
          ))}
      </div>
    );
}

export default BordersFlow;
