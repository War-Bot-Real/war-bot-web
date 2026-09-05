import { useEffect, useState } from "react";
import { getIncome } from "../../api";

function IncomeFlow() {
    const [income, setIncome] = useState<number | null>(null);

    useEffect(() => {
        const loadBalance = async () => {
            try {
                const data = await getIncome();
                setIncome(data["Income"]);
            } catch (error) {
                console.error("Failed to load income:", error);
            }
        };

        loadBalance();
    }, []);

    if (income === null) {
        return <p>Loading...</p>;
    }

    return (
      <>
        <h2>Income by Region</h2>

        {Object.entries(income).map(([region, amount]) => (
          <p key={region}>
            <strong>{region}:</strong> {amount}
          </p>
        ))}
      </>
    );
}

export default IncomeFlow;
