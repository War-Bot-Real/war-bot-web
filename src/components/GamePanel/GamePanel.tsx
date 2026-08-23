import OutputPanel from "./OutputPanel";
import CommandPanel from "./CommandPanel";

import type { Selection } from "../../types/Selection";

interface GamePanelProps {
    selection: Selection;
}

function GamePanel({
    selection,
}: GamePanelProps) {
    return (
        <section className="game-panel">
            <OutputPanel
                selection={selection}
            />

            <CommandPanel
                selection={selection}
            />
        </section>
    );
}

export default GamePanel;