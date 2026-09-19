import OutputPanel from "./OutputPanel";
import CommandPanel from "./CommandPanel";

import type { Selection } from "../../types/Selection";
import type { Nation } from "../../types/Nation";
import NotificationBar from "./NotificationBar";
import type { Message } from "../../types/Messages";

interface GamePanelProps {
    selection: Selection;
    activeCommand: string | null;
    nation: Nation | null;
    messages: Message[];
    setActiveCommand: (command: string | null) => void;
}

function GamePanel({selection, activeCommand, nation, messages, setActiveCommand}: GamePanelProps) {
    return (
        <section className="game-panel">
            <NotificationBar messages={messages} />
            
            <OutputPanel
                selection={selection}
                activeCommand={activeCommand}
                nation={nation}
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