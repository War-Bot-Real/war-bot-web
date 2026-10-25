import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Navigate, Route, Routes, useNavigate } from "react-router";

import { supabase } from "./lib/supabase";
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";
import AccountPage from "./pages/AccountPage";
import SignUpPage from "./pages/SignUpPage";
import AdminPage from "./pages/AdminPage";

function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const clickSound = useRef<HTMLAudioElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const audio = new Audio("/click_default.wav");
        audio.preload = "auto";
        clickSound.current = audio;
        audio.load();

        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => setSession(session)
        );

        return () => subscription.unsubscribe();
    }, []);

    const playClickSound = () => {
        if (clickSound.current) {
            clickSound.current.currentTime = 0;
            void clickSound.current.play();
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <Routes>
            <Route path="/" element={<Navigate to={session ? "/home" : "/login"} replace />} />

            <Route
                path="/login"
                element={session
                    ? <Navigate to="/home" replace />
                    : <LoginPage onSignup={() => navigate("/signup")} />}
            />

            <Route
                path="/signup"
                element={session
                    ? <Navigate to="/home" replace />
                    : <SignUpPage onLogin={() => navigate("/login")} />}
            />

            <Route
                path="/home"
                element={session ?
                  <GamePage
                    onAccount={() => {
                        playClickSound();
                        navigate("/account");
                    }} 
                    onAdmin={() => {
                        playClickSound();
                        navigate("/admin");
                    }}
                  /> : <Navigate to="/login" replace />}
            />

            <Route
                path="/account"
                element={session
                    ? <AccountPage onBack={() => {
                        playClickSound();
                        navigate("/home");
                    }} />
                    : <Navigate to="/login" replace />}
            />

            <Route
                path="/admin"
                element={session
                    ? <AdminPage onBack={() => {
                        playClickSound();
                        navigate("/home");
                    }} />
                    : <Navigate to="/login" replace />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;