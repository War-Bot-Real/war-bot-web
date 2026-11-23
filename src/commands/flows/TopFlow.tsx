
import { useEffect, useState } from "react";
import { top } from "../../api";

const categories = [
  "area",
  "population",
  "coal",
  "iron",
  "power",
];

type Ranking = {
  nation: string;
  flag?: string;
  value: number | string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseRanking(value: unknown, fallbackNation?: string): Ranking | null {
  if (!isRecord(value)) {
    if (
      fallbackNation &&
      (typeof value === "number" || typeof value === "string")
    ) {
      return { nation: fallbackNation, value };
    }
    return null;
  }

  const nation =
    value.nation ??
    value.name ??
    value.Nation ??
    fallbackNation;

  const score =
    value.value ??
    value.score ??
    value.amount ??
    value.Value;

  if (
    typeof nation !== "string" ||
    (typeof score !== "number" && typeof score !== "string")
  ) {
    return null;
  }

  return {
    nation,
    flag: typeof value.flag === "string" ? value.flag : undefined,
    value: score,
  };
}

function getRankings(result: unknown): Ranking[] {
  let data = result;

  if (isRecord(data)) {
    data =
      data.result ??
      data.rankings ??
      data.top ??
      data.data ??
      data;
  }

  if (Array.isArray(data)) {
    return data
      .map(entry => parseRanking(entry))
      .filter((entry): entry is Ranking => entry !== null);
  }

  if (isRecord(data)) {
    return Object.entries(data)
      .map(([nation, value]) => parseRanking(value, nation))
      .filter((entry): entry is Ranking => entry !== null);
  }

  return [];
}

function flagEmoji(code?: string): string {
  if (!code || !/^[a-z]{2}$/i.test(code)) return "";

  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map(letter => 127397 + letter.charCodeAt(0))
  );
}

function displayValue(value: number | string): string {
  return typeof value === "number"
    ? value.toLocaleString()
    : value;
}

function TopFlow() {
  const [category, setCategory] = useState("coal");
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");
    setRankings([]);

    top(category)
      .then((result: unknown) => {
        if (!cancelled) {
          setRankings(getRankings(result));
        }
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Unable to load rankings."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  const categoryLabel =
    category[0].toUpperCase() + category.slice(1);

  return (
    <div className="command-flow top-flow">
      <div className="top-toolbar">
        <div>
          <h2 className="top-heading">Nation Rankings</h2>
          <p className="top-description">
            Compare nations by {categoryLabel.toLowerCase()}.
          </p>
        </div>

        <label
          className="top-category-label"
          htmlFor="top-category"
        >
          Ranking category

          <select
            id="top-category"
            value={category}
            onChange={event => setCategory(event.target.value)}
          >
            {categories.map(name => (
              <option key={name} value={name}>
                {name[0].toUpperCase() + name.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="command-empty">
          Loading rankings...
        </p>
      ) : error ? (
        <p className="command-error">
          {error}
        </p>
      ) : rankings.length === 0 ? (
        <p className="command-empty">
          No rankings found.
        </p>
      ) : (
        <div className="top-table-wrap">
          <table className="top-table">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Nation</th>
                <th scope="col">{categoryLabel}</th>
              </tr>
            </thead>

            <tbody>
              {rankings.map((entry, index) => (
                <tr key={`${entry.nation}-${index}`}>
                  <td className="top-rank">
                    #{index + 1}
                  </td>

                  <td className="top-nation">
                    {entry.nation}
                  </td>

                  <td className="top-value">
                    {displayValue(entry.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TopFlow;
