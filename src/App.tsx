import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Navigate, Route, Routes, useNavigate } from "react-router";

import { supabase } from "./lib/supabase";
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage/GamePage";
import AccountPage from "./pages/AccountPage";
import SignUpPage from "./pages/SignUpPage";
import AdminPage from "./pages/AdminPage";
import { me, getNation, getMessages } from "./api";
import type { Nation } from "./types/Nation";
import type { Message } from "./types/Messages";
import type { Player } from "./types/Player";

function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [nation, setNation] = useState<Nation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [user, setUser] = useState<Player | null>(null);
    const clickSound = useRef<HTMLAudioElement | null>(null);
    const navigate = useNavigate();
    const authUserId = session?.user.id ?? null;

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
            (_event, session) => {
                setNation(null);
                setMessages([]);
                setUser(null);
                setSession(session);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        setNation(null);
        setMessages([]);
        setUser(null);

        if (!authUserId) {
            return;
        }

        let cancelled = false;

        const loadUser = async () => {
            try {
                const nextUser = await me();

                if (cancelled) return;
                setUser(nextUser);

                if (nextUser.nation) {
                    const [nextNation, messageResponse] = await Promise.all([
                        getNation(nextUser.nation),
                        getMessages()
                    ]);

                    if (cancelled) return;
                    setNation(nextNation);
                    setMessages(messageResponse["result"]);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to load user:", error);
                }
            }
        };

        void loadUser();

        return () => {
            cancelled = true;
        };
    }, [authUserId]);

    const playClickSound = () => {
        if (clickSound.current) {
            clickSound.current.currentTime = 0;
            void clickSound.current.play();
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <Routes>
            <Route path="/" element={<Navigate to={authUserId ? "/home" : "/login"} replace />} />

            <Route
                path="/login"
                element={authUserId
                    ? <Navigate to="/home" replace />
                    : <LoginPage onSignup={() => navigate("/signup")} />}
            />

            <Route
                path="/signup"
                element={authUserId
                    ? <Navigate to="/home" replace />
                    : <SignUpPage onLogin={() => navigate("/login")} />}
            />

            <Route
                path="/home"
                element={authUserId ?
                  <GamePage
                    onAccount={() => {
                        playClickSound();
                        navigate("/account");
                    }} 
                    onAdmin={() => {
                        playClickSound();
                        navigate("/admin");
                    }}
                    nation={nation}
                    messages={messages}
                    user={user}
                  /> : <Navigate to="/login" replace />}
            />

            <Route
                path="/account"
                element={authUserId
                    ? <AccountPage user={user} onBack={() => {
                        playClickSound();
                        navigate("/home");
                    }} />
                    : <Navigate to="/login" replace />}
            />

            <Route
                path="/admin"
                element={user?.admin
                    ? <AdminPage onBack={() => {
                        playClickSound();
                        navigate("/home");
                    }} />
                    : <Navigate to="/home" replace />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;