import type { Nation } from "../../../types/Nation";

interface NationFlowProps {
    nation: Nation;
}

function NationFlow({
    nation,
}: NationFlowProps) {
    return (
        <>
            <h2>
                {nation.Flag} {nation.Name}
            </h2>

            <p>
                <strong>Balance:</strong>{" "}
                {nation.Balance.toLocaleString()}
            </p>

            <p>
                <strong>Stability:</strong>{" "}
                {nation.Stability}
            </p>

            <p>
                <strong>Ideology:</strong>{" "}
                {nation.Ideology}
            </p>

            <p>
                <strong>Tax Rate:</strong>{" "}
                {nation["Tax Rate"]}%
            </p>

            <p>
                <strong>Political Power:</strong>{" "}
                {nation["Political Power"]}
            </p>

            <p>
                <strong>Capital:</strong>{" "}
                {nation.Capital}
            </p>
        </>
    );
}

export default NationFlow;