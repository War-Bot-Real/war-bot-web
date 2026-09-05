import { useState } from "react";
import { deploy } from "../../api";

function DeployFlow() {
    const [quan, setQuan] = useState(0);
    const [terr, setTerr] = useState("");
    const [unit, setUnit] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDeploy = async () => {
        if (quan < 1) {
          setError("Quantity must be at least 1!")
        }

        setLoading(true)
        try {
            const data = await deploy(terr, unit, quan);
            if (data["success"]) {
              setSuccess(`Successfully deployed ${quan} ${unit} in ${terr}`)
            }
        } catch (error) {
            console.error("Failed to load balance:", error);
        }
        setLoading(false)
    };
    

    return (
        <div>
            <h2>Deploy</h2>
            <h4>Deploy a unit in a territory you own.</h4>

            <div>
                <input
                    type="text"
                    onChange={(event) =>
                        setUnit(event.target.value)
                    }
                    disabled={loading}
                    placeholder="Unit Type"
                />
                <br/>
                <input
                    type="text"
                    onChange={(event) =>
                        setTerr(event.target.value)
                    }
                    disabled={loading}
                    placeholder="Territory"
                />
                <br/>
                <input
                    type="number"
                    min="1"
                    onChange={(event) =>
                        {
                          setQuan(parseInt(event.target.value))
                          setError("")
                        }
                    }
                    disabled={loading}
                    placeholder="Quantity"
                />
                <br/>
                <button onClick={handleDeploy} disabled={loading}>Deploy</button>
            </div>
            <p>{success}</p>
            <p>{error}</p>
        </div>
    );
}

export default DeployFlow;
