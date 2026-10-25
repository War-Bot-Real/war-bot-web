import "./AccountPage.css"; // To be replaced with Admin CSS Page

type AdminPageProps = {
    onBack: () => void;
};

function AdminPage({ onBack }: AdminPageProps) {
    return (
        <main className="account-page">
            <header>
                <button onClick={onBack}>Back to game</button>
                <h1>Admin Page</h1>
            </header>
        </main>
    );
}

export default AdminPage;