import { useEffect, useState } from "react";
import { getIncome } from "../../api";

function IncomeFlow() {
    const [income, setIncome] = useState<Record<string, number> | null>(null);

    useEffect(() => {
        const loadIncome = async () => {
            try {
                const data = await getIncome();
                setIncome(data["Income"]);
            } catch (error) {
                console.error("Failed to load income:", error);
            }
        };

        loadIncome();
    }, []);

    if (income === null) {
        return <p>Loading...</p>;
    }

    return (
        <div className="income-flow">
            <h2>Income by Region</h2>

            <div className="command-list">
                {Object.entries(income).map(([region, amount]) => (
                    <div className="command-row" key={region}>
                        <span>{region}</span>
                        <span>{amount.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default IncomeFlow;