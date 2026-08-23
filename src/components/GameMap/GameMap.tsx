import { useEffect, useRef } from "react";
import { Application } from "pixi.js";

function GameMap() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let app: Application | null = null;
        let cancelled = false;

        const initialize = async () => {
            const container = containerRef.current;

            if (!container) return;

            const pixiApp = new Application();

            await pixiApp.init({
                resizeTo: container,
                background: "#295891",
            });

            if (cancelled) {
                pixiApp.destroy(true);
                return;
            }

            app = pixiApp;
            container.appendChild(pixiApp.canvas);
        };

        initialize();

        return () => {
            cancelled = true;

            if (app) {
                app.destroy(true);
                app = null;
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
            }}
        />
    );
}

export default GameMap;