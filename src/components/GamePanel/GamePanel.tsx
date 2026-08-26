import OutputPanel from "./OutputPanel";
import CommandPanel from "./CommandPanel";

import type { Selection } from "../../types/Selection";

interface GamePanelProps {
    selection: Selection;
    activeCommand: string | null;
    setActiveCommand: (command: string | null) => void;
}

function GamePanel({selection, activeCommand, setActiveCommand}: GamePanelProps) {
    return (
        <section className="game-panel">
            <OutputPanel
                selection={selection}
                activeCommand={activeCommand}
            />

            <CommandPanel
                selection={selection}
                setActiveCommand={setActiveCommand}
            />
        </section>
    );
}

export default GamePanel;