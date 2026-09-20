import { useEffect, useState } from "react";

import { ally } from "../../api";
import type { Nation } from "../../types/Nation";

interface AllyFlowProps {
    nation: Nation | null;
}

function AllyFlow({ nation }: AllyFlowProps) {
    const [nationName, setNationName] = useState(nation?.Name ?? "");
    const [accepted, setAccepted] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setNationName(nation?.Name ?? "");
        setAccepted(null);
        setError(null);
    }, [nation]);

    const handleAlly = async () => {
        if (!nationName) return;

        setLoading(true);
        setError(null);

        try {
            const response = await ally(nationName);
            setAccepted(response.result.accepted);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ally-flow">
            <h2>Ally Nation</h2>

            <div className="command-form">
                <label>
                    Nation
                    <input
                        type="text"
                        value={nation ? nation.Name : nationName}
                        onChange={(event) =>
                            setNationName(event.target.value)
                        }
                        placeholder="Enter nation"
                        disabled={nation !== null}
                    />
                </label>

                <button
                    className="command-button"
                    onClick={handleAlly}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Ally"}
                </button>
            </div>

            {accepted !== null && nation !== null && (
                <p className="command-success">
                    {accepted
                        ? `You have accepted ${nation.Name}'s offer of an alliance. Good luck to you both, and may this alliance last.`
                        : `Sent an ally request to ${nation.Name}`}
                </p>
            )}

            {error && (
                <p className="command-error">
                    {error}
                </p>
            )}
        </div>
    );
}

export default AllyFlow;