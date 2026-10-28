
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getTerritories, getNations, getGameTime } from "../api";
import type { Territory } from "../types/Territory";
import type { Nation } from "../types/Nation";

export function useMapData() {
    const [territories, setTerritories] = useState<Territory[]>([]);
    const [nations, setNations] = useState<Nation[]>([]);
    const [gameTime, setGameTime] = useState(0);
    const [mapChanged, setMapChanged] = useState(false);

    const loadEntities = useCallback(async () => {
        try {
            const [territories, nations, gameTime] = await Promise.all([
                getTerritories(),
                getNations(),
                getGameTime()
            ]);
            setTerritories(territories);
            setNations(nations);
            setGameTime(gameTime);
        } catch (error) {
            console.error("Failed to load entities:", error);
        }
    }, []);

    useEffect(() => {
        loadEntities();
    }, [loadEntities]);

    useEffect(() => {
        const channel = supabase
            .channel("map-changes", { config: { private: true } })
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "map_changes"
            }, () => {
                setMapChanged(true);
            })
            .subscribe((status, err) => {
                console.log("Map changes:", status);
                if (err) console.error("Realtime error:", err);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function updateMap() {
        await loadEntities();
        setMapChanged(false);
    }

    return { territories, nations, gameTime, mapChanged, updateMap };
}
