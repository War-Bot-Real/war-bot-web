import "./App.css";
import GameMap from './components/GameMap/GameMap';

function App() {
    return (
        <main className="game">
            <section className="map">
                <GameMap></GameMap>
            </section>

            <aside className="panel">
                <h2>War Bot Web</h2>
                <p>Territory information will appear here.</p>
            </aside>
        </main>
    );
}

export default App;
