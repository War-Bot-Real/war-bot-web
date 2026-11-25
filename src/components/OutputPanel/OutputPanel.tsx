import type { Selection } from "../../types/Selection";
import type { Nation } from "../../types/Nation";

import ShopFlow from "../../commands/flows/ShopFlow";
import TerritoryFlow from "./outputs/TerritoryInfo";
import NationFlow from "./outputs/NationInfo";
import TerritoriesInfo from "./outputs/TerritoriesInfo";
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
import WarsFlow from "../../commands/flows/WarFlow";
import GiveFlow from "../../commands/flows/GiveFlow";
import MergeFlow from "../../commands/flows/MergeFlow";
import DisbandFlow from "../../commands/flows/DisbandFlow";
import SplitFlow from "../../commands/flows/SplitFlow";
import AttackFlow from "../../commands/flows/AttackFlow";
import MoveFlow from "../../commands/flows/MoveFlow";
import ForcesFlow from "../../commands/flows/ForcesFlow";
import TerritoriesFlow from "../../commands/flows/TerritoriesFlow";
import ResflowFlow from "../../commands/flows/ResflowFlow";
import BuildFlow from "../../commands/flows/BuildFlow";
import LoadCarrierFlow from "../../commands/flows/LoadCarrierFlow";
import TopFlow from "../../commands/flows/TopFlow";

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
    const singleTerritoryCommands = new Set([
        "deploy",
        "merge",
        "split",
        "disband",
        "attack",
        "move",
        "forces",
        "army",
        "navy",
        "airforce",
        "build",
        "borders",
    ]);

    if (
        selection?.type === "territories" &&
        activeCommand !== null &&
        singleTerritoryCommands.has(activeCommand)
    ) {
        return (
            <section className="output-panel">
                <p className="command-empty">
                    This command does not support multi-territory selection.
                    Select one territory normally to continue.
                </p>
            </section>
        );
    }

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
            ) : activeCommand === "wars" ? (
                <WarsFlow />
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
            ) : activeCommand === "give" ? (
                <GiveFlow
                    nation={
                        selection?.type === "nation"
                            ? selection.nation
                            : null
                    }
                />
            ) : activeCommand === "merge" ? (
                <MergeFlow
                    territory={
                        selection?.type === "territory"
                            ? selection.territory.name
                            : null
                    }
                />
            ) : activeCommand === "split" ? (
                <SplitFlow
                    territory={
                        selection?.type === "territory"
                            ? selection.territory.name
                            : null
                    }
                />
            ) : activeCommand === "disband" ? (
                <DisbandFlow
                    territory={
                        selection?.type === "territory"
                            ? selection.territory.name
                            : null
                    }
                />
            ) : activeCommand === "attack" ? (
                <AttackFlow
                    terrInput={
                        selection?.type === "territory"
                            ? selection.territory
                            : null
                    }
                />
            ) : activeCommand === "move" ? (
                <MoveFlow
                    territory={
                        selection?.type === "territory"
                            ? selection.territory
                            : null
                    }
                />
            ) : activeCommand === "forces" ? (
                <ForcesFlow selectedTerritory={selection?.type === "territory" ? selection.territory.name : null} />
            ) : activeCommand === "resflow" ? (
                <ResflowFlow />
            ) : activeCommand === "loadcarrier" ? (
                <LoadCarrierFlow />
            ) : activeCommand === "build" ? (
                <BuildFlow
                    territory={
                        selection?.type === "territory"
                            ? selection.territory
                            : null
                    }
                />
            ) : activeCommand === "army" ? (
                <ForcesFlow domain="ground" selectedTerritory={selection?.type === "territory" ? selection.territory.name : null} />
            ) : activeCommand === "navy" ? (
                <ForcesFlow domain="naval" selectedTerritory={selection?.type === "territory" ? selection.territory.name : null} />
            ) : activeCommand === "airforce" ? (
                <ForcesFlow domain="air" selectedTerritory={selection?.type === "territory" ? selection.territory.name : null} />
            ) : activeCommand === "top" ? (
                <TopFlow />
            ) : activeCommand === "territories" ? (
                <TerritoriesFlow nation={selection?.type === "nation" ? selection.nation.name : null}/>
            ) : selection?.type === "territory" ? (
                <TerritoryFlow territory={selection.territory}/>
            ) : selection?.type === "nation" ? (
                <NationFlow nation={selection.nation}/>
            ) : selection?.type === "territories" ? (
                <TerritoriesInfo territories={selection.territories} />
            ) : (
                <>
                    <h2>Welcome</h2>

                    <p>
                        Select a territory or nation on the map.
                    </p>

                    <br />

                    <p>
                        <b>Left Click:</b> Select Territory
                    </p>

                    <p>
                        <b>Ctrl + Click:</b> Add or remove a territory
                    </p>

                    <p>
                        <b>Shift + Click:</b> Select Nation
                    </p>

                    <p>
                        <b>Ctrl + Shift + Click:</b> Add Nation Territories
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