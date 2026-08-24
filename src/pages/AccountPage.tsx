import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import './AccountPage.css'

type AccountPageProps = {
    onBack: () => void;
};

function AccountPage({ onBack }: AccountPageProps) {
    const [email, setEmail] = useState("");

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
                    <p>Not connected</p>
                </div>
            </section>
        </main>
    );
}

export default AccountPage;