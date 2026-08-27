import { useEffect, useState } from "react";
import { getBalance } from "../../api";

function BalanceFlow() {
    const [balance, setBalance] = useState<number | null>(null);
    const [polPow, setPolPow] = useState<number | null>(null);
    const [stability, setStability] = useState<number | null>(null);

    useEffect(() => {
        const loadBalance = async () => {
            try {
                const data = await getBalance();
                setBalance(data["Balance"]);
                setPolPow(data["Political Power"]);
                setStability(data["Stability"]);
            } catch (error) {
                console.error("Failed to load balance:", error);
            }
        };

        loadBalance();
    }, []);

    if (balance === null || stability === null || polPow === null) {
        return <p>Loading...</p>;
    }

    return (
      <>
        <p>Balance: ${balance.toLocaleString()}</p>
        <p>Stability: {stability.toLocaleString()}%</p>
        <p>Political Power: {polPow.toLocaleString()}</p>
      </>
    );
}

export default BalanceFlow;
