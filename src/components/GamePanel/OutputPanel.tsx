import type { Selection } from "../../types/Selection";

import ShopFlow from "../../commands/flows/ShopFlow";
import TerritoryFlow from "./outputs/TerritoryInfo";
import NationFlow from "./outputs/NationInfo";
import "../../commands/styles.css"
import SetTaxFlow from "../../commands/flows/SetTaxFlow";
import BalanceFlow from "../../commands/flows/BalanceFlow";
import InventoryFlow from "../../commands/flows/InventoryFlow";
import BordersFlow from "../../commands/flows/BordersFlow";
import CollectFlow from "../../commands/flows/CollectFlow";

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
            ) : activeCommand === "settax" ? (
                <SetTaxFlow />
            ) : activeCommand === "bal" ? (
                <BalanceFlow />
            ) : activeCommand === "inv" ? (
                <InventoryFlow />
            ) : activeCommand === "borders" ? (
                <BordersFlow selection={selection}/>
            ) : activeCommand === "collect" ? (
                <CollectFlow/>
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
                    <br></br>
                    <p><b>Left Click:</b> Select Territory</p>
                    <p><b>Shift/Ctrl Click:</b> Select Nation</p>
                    <p><b>Escape:</b> Back to Full View</p>
                </>
            )}
        </section>
    );
}

export default OutputPanel;