import { useEffect, useState } from "react";
import { getNationTerritories } from "../../api";
import type { Territory } from "../../types/Territory";

interface TerritoriesFlowProps { nation: string | null; }

function TerritoriesFlow({ nation }: TerritoriesFlowProps) {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!nation) { setTerritories([]); return; }
    let cancelled = false;
    setLoading(true);
    setError("");
    getNationTerritories(nation).then(data => {
      if (!cancelled) setTerritories(data);
    }).catch((cause: unknown) => {
      if (!cancelled) setError(cause instanceof Error ? cause.message : "Failed to load territories.");
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [nation]);

  if (!nation) return <p>Select a nation to view its territories.</p>;
  if (loading) return <p>Loading territories...</p>;
  if (error) return <p className="command-error">{error}</p>;

  const visible = territories.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  return <div className="command-flow territories-flow">
    <div className="territories-toolbar">
      <strong>{nation} — {territories.length} territories</strong>
      <input aria-label="Search territories" placeholder="Search territories..." value={search} onChange={e => setSearch(e.target.value)} />
    </div>
    {visible.length === 0 ? <p className="command-empty">No matching territories.</p> :
      <div className="territories-grid">
        {visible.map(territory => <article className="territory-card" key={territory.name}>
          <h3>{territory.name}</h3>
          <div><span>Population</span><strong>{territory.population.toLocaleString()}</strong></div>
          <div><span>Coastal</span><strong>{territory.coast.length ? "Yes" : "No"}</strong></div>
          <div><span>Buildings</span><strong>{territory.buildings.length ? territory.buildings.map(String).join(", ") : "None"}</strong></div>
        </article>)}
      </div>}
  </div>;
}
export default TerritoriesFlow;
