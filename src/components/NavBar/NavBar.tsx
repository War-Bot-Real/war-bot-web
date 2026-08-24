import { supabase } from "../../lib/supabase";

interface NavbarProps {
    onAccount: () => void;
}

function Navbar({ onAccount }: NavbarProps) {
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="navbar">
            <h1>War Bot Web</h1>

            <div className="navbar-actions">
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