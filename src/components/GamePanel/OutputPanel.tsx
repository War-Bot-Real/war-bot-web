import type { Selection } from "../../types/Selection";

import ShopFlow from "../../commands/flows/ShopFlow";
import TerritoryFlow from "./outputs/TerritoryInfo";
import NationFlow from "./outputs/NationInfo";

interface OutputPanelProps {
    selection: Selection;
    activeCommand: string | null;
}

function OutputPanel({
    selection,
    activeCommand,
}: OutputPanelProps) {
    return (
        <section className="output-panel">
            {activeCommand === "shop" ? (
                <ShopFlow />
            ) : selection?.type === "territory" ? (
                <TerritoryFlow
                    territory={selection.territory}
                />
            ) : selection?.type === "nation" ? (
                <NationFlow
                    nation={selection.nation}
                />
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