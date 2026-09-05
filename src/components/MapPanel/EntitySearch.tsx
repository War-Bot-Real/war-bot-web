import { useState } from "react";

import "./EntitySearch.css"
import type { Selection } from "../../types/Selection";
import type { Territory } from "../../types/Territory";
import type { Nation } from "../../types/Nation";

interface EntitySearchProps {
    territories: Territory[];
    nations: Nation[];
    setSelection: (selection: Selection) => void;
}

type SearchResult =
    | {
          type: "territory";
          name: string;
          subtitle: string;
          territory: Territory;
      }
    | {
          type: "nation";
          name: string;
          subtitle: "NATION";
          nation: Nation;
      };

function searchEntities(
    query: string,
    territories: Territory[],
    nations: Nation[],
): SearchResult[] {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
        return [];
    }

    const results: SearchResult[] = [
        ...territories.map((territory) => ({
            type: "territory" as const,
            name: territory.Name,
            subtitle: territory.Nation,
            territory,
        })),

        ...nations.map((nation) => ({
            type: "nation" as const,
            name: nation.Name,
            subtitle: "NATION" as const,
            nation,
        })),
    ];

    return results
        .filter((result) =>
            result.name
                .toLowerCase()
                .includes(normalizedQuery),
        )
        .sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();

            const aStarts =
                aName.startsWith(normalizedQuery);
            const bStarts =
                bName.startsWith(normalizedQuery);

            if (aStarts !== bStarts) {
                return aStarts ? -1 : 1;
            }

            return aName.localeCompare(bName);
        })
        .slice(0, 10);
}

function EntitySearch({
    territories,
    nations,
    setSelection,
}: EntitySearchProps) {
    const [query, setQuery] = useState("");

    const results = searchEntities(
        query,
        territories,
        nations,
    );

    const handleSelect = (result: SearchResult) => {
        if (result.type === "territory") {
            setSelection({
                type: "territory",
                territory: result.territory,
            });
        } else {
            setSelection({
                type: "nation",
                nation: result.nation,
            });
        }

        setQuery("");
    };

    return (
        <div className="entity-search">
            <input
                type="text"
                placeholder="Search territories or nations..."
                value={query}
                onChange={(event) =>
                    setQuery(event.target.value)
                }
            />

            {results.length > 0 && (
                <div className="entity-search-results">
                    {results.map((result) => (
                        <button
                            key={`${result.type}-${result.name}`}
                            type="button"
                            className="entity-search-result"
                            onClick={() =>
                                handleSelect(result)
                            }
                        >
                            <span className="entity-search-name">
                                {result.name}
                            </span>

                            <span className="entity-search-subtitle">
                                {result.subtitle}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EntitySearch;