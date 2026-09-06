import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { generateDiscordLink } from "../api";
import "./AccountPage.css";

type AccountPageProps = {
    onBack: () => void;
};

function AccountPage({ onBack }: AccountPageProps) {
    const [email, setEmail] = useState("");
    const [linkingDiscord, setLinkingDiscord] = useState(false);
    const [discordCode, setDiscordCode] = useState<string | null>(null);
    const [discordExpiresAt, setDiscordExpiresAt] = useState<string | null>(null);
    const [discordError, setDiscordError] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user?.email) {
                setEmail(user.email);
            }
        };

        loadUser();
    }, []);

    const handleLinkDiscord = async () => {
        setLinkingDiscord(true);
        setDiscordError("");

        try {
            const response = await generateDiscordLink();

            setDiscordCode(response.code);
            setDiscordExpiresAt(response.expires_at);
        } catch (error) {
            console.error("Failed to generate Discord link:", error);

            setDiscordError(
                error instanceof Error
                    ? error.message
                    : "Failed to generate Discord link."
            );
        } finally {
            setLinkingDiscord(false);
        }
    };

    return (
        <main className="account-page">
            <header>
                <button onClick={onBack}>Back to game</button>
                <h1>Account</h1>
            </header>

            <section className="account-info">
                <div>
                    <strong>Email</strong>
                    <p>{email}</p>
                </div>

                <div>
                    <strong>Username</strong>
                    <p>Not set yet</p>
                </div>

                <div>
                    <strong>Discord</strong>

                    {!discordCode ? (
                        <>
                            <p>Not connected</p>

                            <button
                                onClick={handleLinkDiscord}
                                disabled={linkingDiscord}
                            >
                                {linkingDiscord
                                    ? "Generating code..."
                                    : "Link Discord"}
                            </button>

                            {discordError && (
                                <p>{discordError}</p>
                            )}
                        </>
                    ) : (
                        <>
                            <p>
                                Run this command in the War Bot Discord server:
                            </p>

                            <p>
                                <strong>-link {discordCode}</strong>
                            </p>

                            <p>
                                This code expires at{" "}
                                {new Date(discordExpiresAt!).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    }
                                )}
                                .
                            </p>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}

export default AccountPage;