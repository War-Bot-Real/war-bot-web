import type { Selection } from "../../types/Selection";
import type { Nation } from "../../types/Nation";

import ShopFlow from "../../commands/flows/ShopFlow";
import TerritoryFlow from "./outputs/TerritoryInfo";
import NationFlow from "./outputs/NationInfo";
import "../../commands/styles.css";
import SetTaxFlow from "../../commands/flows/SetTaxFlow";
import BalanceFlow from "../../commands/flows/BalanceFlow";
import InventoryFlow from "../../commands/flows/InventoryFlow";
import BordersFlow from "../../commands/flows/BordersFlow";
import CollectFlow from "../../commands/flows/CollectFlow";
import BuyFlow from "../../commands/flows/BuyFlow";
import DeployFlow from "../../commands/flows/DeployFlow";
import IncomeFlow from "../../commands/flows/IncomeFlow";
import AllyFlow from "../../commands/flows/AllyFlow";
import DeclareWarFlow from "../../commands/flows/DeclareWarFlow";

interface OutputPanelProps {
    selection: Selection;
    activeCommand: string | null;
    nation: Nation | null;
}

function OutputPanel({
    selection,
    activeCommand,
    nation,
}: OutputPanelProps) {
    return (
        <section className="output-panel">
            {activeCommand === "shop" ? (
                <ShopFlow nation={nation} />
            ) : activeCommand === "settax" ? (
                <SetTaxFlow />
            ) : activeCommand === "bal" ? (
                <BalanceFlow />
            ) : activeCommand === "inv" ? (
                <InventoryFlow />
            ) : activeCommand === "borders" ? (
                <BordersFlow selection={selection} />
            ) : activeCommand === "collect" ? (
                <CollectFlow />
            ) : activeCommand === "income" ? (
                <IncomeFlow />
            ) : activeCommand === "buy" ? (
                <BuyFlow />
            ) : activeCommand === "deploy" ? (
                <DeployFlow
                    territory={
                        selection?.type === "territory"
                            ? selection.territory
                            : null
                    }
                />
            ) : activeCommand === "ally" ? (
                <AllyFlow
                    nation={
                        selection?.type === "nation"
                            ? selection.nation
                            : null
                    }
                />
            ) : activeCommand === "declarewar" ? (
                <DeclareWarFlow
                    nation={
                        selection?.type === "nation"
                            ? selection.nation
                            : null
                    }
                />
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

                    <br />

                    <p>
                        <b>Left Click:</b> Select Territory
                    </p>

                    <p>
                        <b>Shift/Ctrl Click:</b> Select Nation
                    </p>

                    <p>
                        <b>Escape:</b> Back to Full View
                    </p>
                </>
            )}
        </section>
    );
}

export default OutputPanel;