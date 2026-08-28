import { useEffect, useState } from "react";
import { getBorders } from "../../api";

function BordersFlow({ territory }: { territory: string | null }) {
    if (territory === null) {
      return 
    }

    const [borders, setBorders] = useState<string[] | null>(null);
    useEffect(() => {
        const loadBorders = async () => {
            try {
                setBorders((await getBorders(territory)).Bordering);
            } catch (error) {
                console.error("Failed to get borders:", error);
            }
        };

        loadBorders();
    }, []);

    if (borders === null) {
        return <p>Loading...</p>;
    }

    return (
      <div>
          <p>Borders of <b>{territory}</b></p>
          {borders.map((bordering) => (
              <p>
                  {bordering}
              </p>
          ))}
      </div>
    );
}

export default BordersFlow;
