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
                setBalance(data.balance);
                setPolPow(data.political_power);
                setStability(data.stability);
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
        <div className="balance-flow">
            <div className="command-list">
                <div className="command-row">
                    <span>Balance</span>
                    <span>${balance.toLocaleString()}</span>
                </div>

                <div className="command-row">
                    <span>Stability</span>
                    <span>{stability.toLocaleString()}%</span>
                </div>

                <div className="command-row">
                    <span>Political Power</span>
                    <span>{polPow.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

export default BalanceFlow;