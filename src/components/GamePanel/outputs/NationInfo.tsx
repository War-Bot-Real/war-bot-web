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
                <strong>Ideology:</strong>{" "}
                {nation.Ideology}
            </p>

            <p>
                <strong>Capital:</strong>{" "}
                {nation.Capital}
            </p>
        </>
    );
}

export default NationFlow;