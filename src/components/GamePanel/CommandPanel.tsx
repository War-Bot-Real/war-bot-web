import type { Selection } from "../../types/Selection";
import { commands } from "../../commands/commands";

interface CommandPanelProps {
    selection: Selection;
    setActiveCommand: (command: string | null) => void;
}

function CommandPanel({
    selection,
    setActiveCommand,
}: CommandPanelProps) {
    const context = selection?.type ?? "general";

    const availableCommands = commands.filter(
        (command) => command.context === context,
    );

    return (
        <section className="command-panel">
            <input
                type="text"
                placeholder="Search commands..."
            />

            <div className="commands">
                {availableCommands.map((command) => (
                    <button
                        key={command.id}
                        onClick={() =>
                            setActiveCommand(command.id)
                        }
                    >
                        {command.name}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default CommandPanel;