import { useState } from "react";
import { setTax } from "../../api";

function SetTaxFlow() {
    const [rate, setRate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSetTax = async () => {
        setError("");
        setSuccess("");

        const taxRate = Number(rate);

        if (!Number.isInteger(taxRate)) {
            setError("Tax rate must be a whole number.");
            return;
        }

        if (taxRate < 0 || taxRate > 100) {
            setError("Tax rate must be between 0 and 100.");
            return;
        }

        try {
            setLoading(true);

            await setTax(taxRate);

            setSuccess(`Tax rate set to ${taxRate}%.`);
        } catch (error) {
            console.error("Failed to set tax rate:", error);

            setError("Failed to set tax rate.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="set-tax-flow">
            <h2>Set Tax Rate</h2>

            <div>
                <label htmlFor="tax-rate">
                    Tax Rate (%)
                </label>

                <input
                    id="tax-rate"
                    type="number"
                    min="0"
                    max="100"
                    value={rate}
                    onChange={(event) =>
                        setRate(event.target.value)
                    }
                    disabled={loading}
                />

                <button
                    onClick={handleSetTax}
                    disabled={loading || rate === ""}
                >
                    {loading ? "Setting..." : "Set Tax Rate"}
                </button>
            </div>

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            {success && (
                <p className="success">
                    {success}
                </p>
            )}
        </div>
    );
}

export default SetTaxFlow;