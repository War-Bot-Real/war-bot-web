import { useState } from "react";
import { getNations, getTerritories } from "./api";
import "./App.css";

function App() {
    const [results, setResults] = useState<unknown[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleGetNations() {
        setLoading(true);
        setError(null);

        try {
            const data = await getNations();
            setResults(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    async function handleGetTerritories() {
        setLoading(true);
        setError(null);

        try {
            const data = await getTerritories();
            setResults(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main>
            <h1>War Bot</h1>

            <div className="buttons">
                <button onClick={handleGetNations}>
                    Get Nations
                </button>

                <button onClick={handleGetTerritories}>
                    Get Territories
                </button>
            </div>

            {loading && <p>Loading...</p>}

            {error && (
                <p className="error">
                    Error: {error}
                </p>
            )}

            <pre>
                {JSON.stringify(results, null, 2)}
            </pre>
        </main>
    );
}

export default App;
