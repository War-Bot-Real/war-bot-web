import "./SelectionModeToggle.css";

interface SelectionModeToggleProps {
    nationMode: boolean;
    setNationMode: (nationMode: boolean) => void;
}

function SelectionModeToggle({
    nationMode,
    setNationMode
}: SelectionModeToggleProps) {
    return (
        <div className="selection-mode-toggle">
            <span className="selection-mode-label">
                Selection: <strong>{nationMode ? "Nation" : "Province"}</strong>
            </span>

            <button
                type="button"
                className={`selection-mode-switch ${nationMode ? "nation" : "province"}`}
                onClick={() => setNationMode(!nationMode)}
                aria-label={`Switch to ${nationMode ? "province" : "nation"} selection`}
                title={`Switch to ${nationMode ? "Province" : "Nation"} selection`}
            >
                <span className="selection-mode-knob" />
            </button>
        </div>
    );
}

export default SelectionModeToggle;