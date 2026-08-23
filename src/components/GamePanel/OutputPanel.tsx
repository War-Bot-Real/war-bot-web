import type { Selection } from "../../types/Selection";

interface OutputPanelProps {
    selection: Selection;
}

function OutputPanel({
    selection,
}: OutputPanelProps) {
    return (
        <section className="output-panel">
            {selection?.type === "territory" ? (
                <>
                    <h2>
                        {selection.territory.Name}
                    </h2>

                    <p>
                        <strong>Nation:</strong>{" "}
                        {selection.territory.Nation}
                    </p>

                    <p>
                        <strong>Population:</strong>{" "}
                        {selection.territory.Population.toLocaleString()}
                    </p>

                    <p>
                        <strong>Area:</strong>{" "}
                        {selection.territory.Area.toLocaleString()}
                    </p>

                    <p>
                        <strong>Terrain:</strong>{" "}
                        {selection.territory.Terrain}
                    </p>

                    <p>
                        <strong>Coal:</strong>{" "}
                        {selection.territory.Coal}
                    </p>

                    <p>
                        <strong>Oil:</strong>{" "}
                        {selection.territory.Oil}
                    </p>

                    <p>
                        <strong>Devastation:</strong>{" "}
                        {selection.territory.Devastation}
                    </p>
                </>
            ) : selection?.type === "nation" ? (
                <>
                    <h2>
                        {selection.nation.Flag}{" "}
                        {selection.nation.Name}
                    </h2>

                    <p>
                        <strong>Balance:</strong>{" "}
                        {selection.nation.Balance.toLocaleString()}
                    </p>

                    <p>
                        <strong>Stability:</strong>{" "}
                        {selection.nation.Stability}
                    </p>

                    <p>
                        <strong>Ideology:</strong>{" "}
                        {selection.nation.Ideology}
                    </p>

                    <p>
                        <strong>Tax Rate:</strong>{" "}
                        {selection.nation["Tax Rate"]}%
                    </p>

                    <p>
                        <strong>Political Power:</strong>{" "}
                        {selection.nation["Political Power"]}
                    </p>

                    <p>
                        <strong>Capital:</strong>{" "}
                        {selection.nation.Capital}
                    </p>
                </>
            ) : (
                <>
                    <h2>Welcome</h2>
                    <p>
                        Select a territory or nation
                        on the map.
                    </p>
                </>
            )}
        </section>
    );
}

export default OutputPanel;