import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { generateDiscordLink, setUsername } from "../api";
import "./AccountPage.css";
import type { Player } from "../types/Player";

type AccountPageProps = {
    onBack: () => void;
    user: Player | null;
};

function AccountPage({ onBack, user }: AccountPageProps) {
    const [email, setEmail] = useState<string | null>(null);
    const [username, setUsernameValue] = useState(user?.username ?? "");
    const [editedUsername, setEditedUsername] = useState(user?.username ?? "");
    const [savingUsername, setSavingUsername] = useState(false);
    const [usernameError, setUsernameError] = useState("");

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
            } else {
                setEmail("Guest Account");
            }
        };

        loadUser();
    }, []);

    useEffect(() => {
        const currentUsername = user?.username ?? "";
        setUsernameValue(currentUsername);
        setEditedUsername(currentUsername);
    }, [user?.username]);

    const handleSaveUsername = async () => {
        const newUsername = editedUsername.trim();

        if (!newUsername || newUsername === username) return;

        setSavingUsername(true);
        setUsernameError("");

        try {
            await setUsername(newUsername);
            setUsernameValue(newUsername);
            setEditedUsername(newUsername);
        } catch (error) {
            setUsernameError(error instanceof Error ? error.message : "Failed to update username.");
        } finally {
            setSavingUsername(false);
        }
    };

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
                    <p>{email ?? "Loading..."}</p>
                </div>

                <div className="username-card">
                    <strong>Username</strong>

                    {user ? (
                        <>
                            <div className="username-edit">
                                <input
                                    type="text"
                                    value={editedUsername}
                                    onChange={(e) => {
                                        setEditedUsername(e.target.value);
                                        setUsernameError("");
                                    }}
                                    placeholder="Enter username"
                                />

                                {editedUsername.trim() !== username && (
                                    <button
                                        onClick={handleSaveUsername}
                                        disabled={savingUsername || !editedUsername.trim()}
                                    >
                                        {savingUsername ? "Saving..." : "Save"}
                                    </button>
                                )}
                            </div>

                            {usernameError && <p className="username-error">{usernameError}</p>}
                        </>
                    ) : (
                        <p>Guest Account</p>
                    )}
                </div>

                <div>
                    <strong>Discord</strong>

                    {!discordCode && !user?.discord_id ? (
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

                            {discordError && <p>{discordError}</p>}
                        </>
                    ) : user?.discord_id ? (
                        <>
                            <p>
                                Discord account connected. Account ID:
                                <br />
                                <strong>{user.discord_id}</strong>
                            </p>
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