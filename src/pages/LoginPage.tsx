import { useState } from "react";
import { supabase } from "../lib/supabase";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (
        event: React.FormEvent,
    ) => {
        event.preventDefault();

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

                {error && (
                    <p className="login-error">
                        {error}
                    </p>
                )}
            </form>
        </main>
    );
}

export default LoginPage;