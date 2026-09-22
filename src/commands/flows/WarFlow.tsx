import { useEffect, useState } from "react";
import { getWars } from "../../api";
import type { War } from "../../types/War";

function WarsFlow() {
    const [wars, setWars] = useState<War[] | null>(null);

    useEffect(() => {
        const loadWars = async () => {
            try {
                const data = await getWars();
                setWars(data);
            } catch (error) {
                console.error("Failed to load wars:", error);
            }
        };

        loadWars();
    }, []);

    if (wars === null) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {Object.entries(wars).length === 0 ? (
                <p className="command-empty">
                    There are no ongoing wars right now!
                </p>
            ) : (
                wars.map((war) => (
                    <div className="war" key={war.name}>
                        <h3>{war.name}</h3>

                        <div className="war-sides">
                            <div className="war-side">
                                <h4>Aggressors</h4>

                                {war.aggressors.map((country) => (
                                    <div key={country}>{country}</div>
                                ))}
                            </div>

                            <div className="war-side">
                                <h4>Defenders</h4>

                                {war.defenders.map((country) => (
                                    <div key={country}>{country}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default WarsFlow;