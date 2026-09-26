import { useEffect, useState } from "react";
import { give } from "../../api";
import type { Nation } from "../../types/Nation";

interface GiveFlowProps {
    nation: Nation | null;
}

function GiveFlow({ nation }: GiveFlowProps) {
    const [amount, setAmount] = useState(0);
    const [nationName, setNationName] = useState(nation?.Name ?? "");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setNationName(nation?.Name ?? "");
        setAmount(0);
        setMessage("");
        setSuccess("");
        setError("");
    }, [nation]);

    const handleGive = async () => {
        if (amount < 1) {
            setError("Cannot give less than one dollar!");
            return;
        }

        if (!nationName) {
            setError("Please select a nation!");
            return;
        }

        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const resp = await give(nationName, amount, message);

            if (resp.success) {
                setSuccess(`Successfully gave $${amount.toLocaleString()} to ${nationName}.`);
                setError("");
            } else {
                setError(resp["detail"] ?? "Failed to give money.");
                setSuccess("");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to give money.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="give-flow">
            <div className="command-form">
                <label>
                    Nation
                    <input
                        type="text"
                        value={nation ? nation.Name : nationName}
                        onChange={(event) => {
                            setNationName(event.target.value);
                            setError("");
                            setSuccess("");
                        }}
                        disabled={nation !== null || loading}
                        placeholder="Enter nation"
                    />
                </label>

                <label>
                    Amount
                    <input
                        type="number"
                        min="1"
                        value={amount || ""}
                        onChange={(event) => {
                            setAmount(parseInt(event.target.value) || 0);
                            setError("");
                            setSuccess("");
                        }}
                        disabled={loading}
                        placeholder="Amount"
                    />
                </label>

                <label>
                    Message
                    <input
                        type="text"
                        value={message}
                        onChange={(event) => {
                            setMessage(event.target.value);
                            setError("");
                            setSuccess("");
                        }}
                        disabled={loading}
                        placeholder="Optional message"
                    />
                </label>

                <button
                    className="action-button"
                    onClick={handleGive}
                    disabled={loading}
                >
                    {loading ? "Giving..." : "Give"}
                </button>
            </div>

            {success && (
                <p className="command-success">{success}</p>
            )}

            {error && (
                <p className="command-error">{error}</p>
            )}
        </div>
    );
}

export default GiveFlow;