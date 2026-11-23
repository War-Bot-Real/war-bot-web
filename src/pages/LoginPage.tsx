import { playUiSound } from "../sounds";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./LoginPage.css";

interface LoginPageProps {
    onSignup: () => void;
}

function LoginPage({ onSignup }: LoginPageProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const handleLogin = async (
        event: React.FormEvent,
    ) => {
        event.preventDefault();
        playUiSound("/click_default.wav");

        setError("");

        const { error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (error) {
            setError(error.message);
        }
    };

    const handleGuestLogin = async () => {
        playUiSound("/click_default.wav");

        setError("");

        const { error } =
            await supabase.auth.signInAnonymously();

        if (error) {
            setError(error.message);
        }
    };

    return (
        <main className="login-page">
            <form
                className="login-form"
                onSubmit={handleLogin}
            >
                <h1>War Bot Web</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                />

                <button type="submit">
                    Login
                </button>

                <button type="button" onClick={handleGuestLogin}>
                    Browse as Guest
                </button>

                {error && (
                    <p className="login-error">
                        {error}
                    </p>
                )}

                <p className="login-switch">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        className="login-link"
                        onClick={onSignup}
                    >
                        Sign Up
                    </button>
                </p>
            </form>
        </main>
    );
}

export default LoginPage;
