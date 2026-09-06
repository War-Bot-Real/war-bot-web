import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "./lib/supabase";
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";
import AccountPage from "./pages/AccountPage";
import SignUpPage from "./pages/SignUpPage";

type Page = "login" | "signup" | "game" | "account";

function App() {
    const [page, setPage] = useState<Page>("game");
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const clickSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio("/click_default.wav");
        audio.preload = "auto";
        clickSound.current = audio;

        audio.load();
    }, []);

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

    if (page === "signup") {
        return (
            <SignUpPage
                onLogin={() => setPage("login")}
            />
        );
    }

    if (page === "login" || !session) {
        return (
            <LoginPage
                onSignup={() => setPage("signup")}
            />
        );
    }

    if (page === "account") {
        return <AccountPage onBack={() => {
          if (clickSound.current) {
              clickSound.current.currentTime = 0;
              clickSound.current.play();
          }
          setPage("game")
        }}/>;
    }

    return <GamePage onAccount={() => {
      if (clickSound.current) {
          clickSound.current.currentTime = 0;
          clickSound.current.play();
      }
      setPage("account")
    }}/>;
}

export default App;