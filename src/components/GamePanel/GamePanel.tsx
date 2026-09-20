import OutputPanel from "./OutputPanel";
import CommandPanel from "./CommandPanel";
import NotificationBar from "./NotificationBar";

import { commands } from "../../commands/commands";

import type { Selection } from "../../types/Selection";
import type { Nation } from "../../types/Nation";
import type { Message } from "../../types/Messages";
import type { NotificationPopup } from "../../types/NotificationPopup";

interface GamePanelProps {
    selection: Selection;
    activeCommand: string | null;
    nation: Nation | null;
    messages: Message[];
    notifPopup: NotificationPopup;
    setActiveCommand: (command: string | null) => void;
    setNotifPopup: (command: NotificationPopup) => void;
}

function GamePanel({
    selection,
    activeCommand,
    nation,
    messages,
    notifPopup,
    setActiveCommand,
    setNotifPopup
}: GamePanelProps) {
    const commandName = commands.find((command) => command.id === activeCommand)?.name ?? "";

    return (
        <section className="game-panel">
            <div className="output-header">
                <h2>{commandName}</h2>

                <NotificationBar
                    messages={messages}
                    popup={notifPopup}
                    setPopup={setNotifPopup}
                />
            </div>

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