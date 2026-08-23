import { useEffect, useRef } from "react";
import { Application, Assets, Sprite } from "pixi.js";
import { getMapUrl } from "../../api";

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
                background: "white",
            });

            if (cancelled) {
                pixiApp.destroy(true);
                return;
            }

            app = pixiApp;
            container.appendChild(pixiApp.canvas);

            try {
                const mapUrl = await getMapUrl();

                if (cancelled) return;

                const texture = await Assets.load(mapUrl);

                if (cancelled) return;

                const map = new Sprite(texture);

                pixiApp.stage.addChild(map);
            } catch (error) {
                console.error("Failed to load map:", error);
            }
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