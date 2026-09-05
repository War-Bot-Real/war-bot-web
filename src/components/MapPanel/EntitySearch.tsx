import type { Selection } from "../../types/Selection";
import type { Territory } from "../../types/Territory";
import type { Nation } from "../../types/Nation";

interface EntitySearchProps {
    territories: Territory[];
    nations: Nation[];
    setSelection: (selection: Selection) => void;
}

function EntitySearch({
    territories,
    nations,
    setSelection,
}: EntitySearchProps) {
    return (
        <div className="entity-search">
            <input
                type="text"
                placeholder="Search territories or nations..."
            />
        </div>
    );
}

export default EntitySearch;