import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "./lib/supabase";
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";
import AccountPage from "./pages/AccountPage";

type Page = "game" | "account";

function App() {
    const [page, setPage] = useState<Page>("game");

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

    if (page === "account") {
        return <AccountPage onBack={() => setPage("game")} />;
    }

    return <GamePage onAccount={() => setPage("account")}/>;
}

export default App;