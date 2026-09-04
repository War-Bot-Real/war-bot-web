import { useEffect, useState } from "react";
import { collect } from "../../api";

function CollectFlow() {
    const [income, setIncome] = useState<number | null>(null);
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        const loadCollect = async () => {
            try {
                const data = await collect();
                setIncome(data["income"]);
                setBalance(data["balance"]);
            } catch (error) {
                console.error("Failed to load balance:", error);
            }
        };

        loadCollect();
    }, []);

    if (balance === null || income === null) {
        return <p>Loading...</p>;
    }

    return (
      <>
        <b>Successfully collected income!</b>
        <p>Income: {income >= 0 ? '+' : '-'}${Math.abs(income).toLocaleString()}</p>
        <p>Balance: {balance >= 0 ? '' : '-'}${Math.abs(balance).toLocaleString()}</p>
      </>
    );
}

export default CollectFlow;
