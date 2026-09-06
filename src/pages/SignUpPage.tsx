import { useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import "./LoginPage.css";

interface SignUpPageProps {
    onLogin: () => void;
}

function SignUpPage({ onLogin }: SignUpPageProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const clickSound = useRef(
        new Audio("/click_default.wav")
    );

    const handleSignUp = async (
        event: React.FormEvent,
    ) => {
        event.preventDefault();
        clickSound.current.play();

        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const { error } =
            await supabase.auth.signUp({
                email,
                password,
            });

        if (error) {
            setError(error.message);
        }
    };

    return (
        <main className="login-page">
            <form
                className="login-form"
                onSubmit={handleSignUp}
            >
                <h1>War Bot Web</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(event) =>
                        setConfirmPassword(event.target.value)
                    }
                    required
                />

                <button type="submit">
                    Sign Up
                </button>

                {error && (
                    <p className="login-error">
                        {error}
                    </p>
                )}

                <p className="login-switch">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="login-link"
                        onClick={onLogin}
                    >
                        Log In
                    </button>
                </p>
            </form>
        </main>
    );
}

export default SignUpPage;