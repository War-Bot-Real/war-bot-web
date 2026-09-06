import OutputPanel from "./OutputPanel";
import CommandPanel from "./CommandPanel";

import type { Selection } from "../../types/Selection";
import type { Nation } from "../../types/Nation";

interface GamePanelProps {
    selection: Selection;
    activeCommand: string | null;
    nation: Nation | null;
    setActiveCommand: (command: string | null) => void;
}

function GamePanel({selection, activeCommand, nation, setActiveCommand}: GamePanelProps) {
    return (
        <section className="game-panel">
            <OutputPanel
                selection={selection}
                activeCommand={activeCommand}
            />

            <CommandPanel
                selection={selection}
                nation={nation}
                setActiveCommand={setActiveCommand}
            />
        </section>
    );
}

export default GamePanel;