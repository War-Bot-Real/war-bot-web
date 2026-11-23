
import { playUiSound } from "../../sounds";
import { supabase } from "../../lib/supabase";
import "./NavBar.css";
import type { Player } from "../../types/Player";

interface NavbarProps {
    onAccount: () => void;
    onAdmin: () => void;
    user: Player | null;
}

function Navbar({ onAccount, onAdmin, user }: NavbarProps) {
    const handleLogout = async () => {
        playUiSound("/click_default.wav");

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="navbar">
            <h1>War Bot Web</h1>

            <div className="navbar-actions">
                {user?.admin && (
                    <button onClick={onAdmin}>
                        Admin
                    </button>
                )}

                <button onClick={onAccount}>
                    Account
                </button>

                <button onClick={handleLogout}>
                    Log Out
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
