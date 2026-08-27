import { useState } from "react";
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
    const [search, setSearch] = useState("");

    const orderedCommands = [...commands].sort((a, b) => {
        const aRelevant = a.context === context;
        const bRelevant = b.context === context;

        if (aRelevant && !bRelevant) return -1;
        if (!aRelevant && bRelevant) return 1;

        return 0;
    });

    const visibleCommands = orderedCommands.filter((command) =>
        command.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="command-panel">
            <input
                type="text"
                placeholder="Search commands..."
                value={search}
                onChange={(event) =>
                    setSearch(event.target.value)
                }
            />

            <div className="commands">
                {visibleCommands.map((command) => (
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