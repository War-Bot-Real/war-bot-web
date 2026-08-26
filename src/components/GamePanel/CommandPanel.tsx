import type { Selection } from "../../types/Selection";

interface CommandPanelProps {
    selection: Selection;
    setActiveCommand: (command: string | null) => void;
}

function CommandPanel({selection, setActiveCommand}: CommandPanelProps) {
    return (
        <section className="command-panel">
            <input
                type="text"
                placeholder="Search commands..."
            />

            <div className="commands">
                {selection?.type === "territory" && (
                    <>
                        <button>Build</button>
                        <button>Attack</button>
                        <button>Move</button>
                    </>
                )}

                {selection?.type === "nation" && (
                    <>
                        <button>Declare War</button>
                        <button>Ally</button>
                    </>
                )}

                {!selection && (
                    <>
                        <button onClick={() => setActiveCommand("shop")}>Shop</button>
                        <button>Balance</button>
                        <button>Inventory</button>
                    </>
                )}
            </div>
        </section>
    );
}

export default CommandPanel;