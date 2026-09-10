import { useEffect, useRef, useState } from "react";

import { declareWar } from "../../api";
import type { Nation } from "../../types/Nation";

interface DeclareWarFlowProps {
    nation: Nation | null;
}

function DeclareWarFlow({ nation }: DeclareWarFlowProps) {
    const [nationName, setNationName] = useState(nation?.Name ?? "");
    const [result, setResult] = useState<{
        target: string;
        cost: number;
        napBroken: boolean;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const sound = useRef(new Audio("declare_war.mp3"));

    useEffect(() => {
        setNationName(nation?.Name ?? "");
        setResult(null);
        setError(null);
    }, [nation]);

    const handleDeclareWar = async () => {
        if (!nationName) return;

        setLoading(true);
        setError(null);

        try {
            const response = await declareWar(nationName);

            setResult({
                target: response.result.target,
                cost: response.result.cost,
                napBroken: response.result.nap_broken,
            });

            sound.current.play();
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flow">
            <input
                type="text"
                value={nation ? nation.Name : nationName}
                onChange={(event) => setNationName(event.target.value)}
                placeholder="Enter nation"
                disabled={nation !== null}
            />

            <button
                className="command-button"
                onClick={handleDeclareWar}
                disabled={loading}
            >
                {loading ? "Declaring War..." : "Declare War"}
            </button>

            {result !== null && (
                <p>
                    You have declared war on {result.target}. It cost {result.cost} political power.
                </p>
            )}

            {error && (
                <p>
                    {error}
                </p>
            )}
        </div>
    );
}

export default DeclareWarFlow;