import { useState, useRef } from "react";
import type { Selection } from "../../types/Selection";
import { commands } from "../../commands/commands";
import type { Nation } from "../../types/Nation";

interface CommandPanelProps {
    selection: Selection;
    nation: Nation | null;
    setActiveCommand: (command: string | null) => void;
}

function CommandPanel({selection, nation, setActiveCommand}: CommandPanelProps) {
    const context = selection?.type ?? "general";
    const [search, setSearch] = useState("");
    const clickSound = useRef(new Audio("/click_default.wav"));
    const searchSound = useRef(new Audio("/click_search.wav"));

    const orderedCommands = [...commands].sort((a, b) => {
        if (nation === null) {
            if (
                !a.requiresNation &&
                b.requiresNation
            ) {
                return -1;
            }

            if (
                a.requiresNation &&
                !b.requiresNation
            ) {
                return 1;
            }
        }

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
                onClick={() => 
                  searchSound.current.play()
                }
            />

            <div className="commands">
                {visibleCommands.map((command) => (
                    <button
                        key={command.id}
                        onClick={() => {
                            clickSound.current.play();
                            setActiveCommand(command.id)
                        }}
                    >
                        {command.name}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default CommandPanel;