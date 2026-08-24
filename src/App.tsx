import { useEffect, useState } from "react";

import {
    supabase,
} from "./lib/supabase";

import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";

import type { Session } from "@supabase/supabase-js";

function App() {
    const [session, setSession] =
        useState<Session | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(
            ({ data }) => {
                setSession(data.session);
                setLoading(false);
            },
        );

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            },
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!session) {
        return <LoginPage />;
    }

    return <GamePage />;
}

export default App;