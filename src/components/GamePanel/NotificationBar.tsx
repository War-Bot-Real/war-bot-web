import { useState } from "react";

import "./NotificationBar.css";

type Popup = "news" | "messages" | "notifications" | null;

function NotificationBar() {
    const [popup, setPopup] = useState<Popup>(null);

    const togglePopup = (name: Exclude<Popup, null>) => {
        setPopup(current => current === name ? null : name);
    };

    return (
        <div className="notification-bar">
            <div className="notification-buttons">
                <button
                    className={`notification-button ${popup === "news" ? "active" : ""}`}
                    onClick={() => togglePopup("news")}
                >
                    <img src="/news.png" alt="World News" />
                </button>

                <button
                    className={`notification-button ${popup === "messages" ? "active" : ""}`}
                    onClick={() => togglePopup("messages")}
                >
                    <img src="/messages.png" alt="Messages" />
                </button>

                <button
                    className={`notification-button ${popup === "notifications" ? "active" : ""}`}
                    onClick={() => togglePopup("notifications")}
                >
                    <img src="/notifications.png" alt="Notifications" />
                </button>
            </div>

            {popup === "news" && (
                <div className="notification-popup">
                    <h3>World News</h3>
                    <p>Britain has declared war on France.</p>
                    <p>Germany has signed a treaty with Italy.</p>
                </div>
            )}

            {popup === "messages" && (
                <div className="notification-popup">
                    <h3>Messages</h3>
                    <p><strong>Britain:</strong> Would you like to form an alliance?</p>
                    <p><strong>France:</strong> We have a proposal for you.</p>
                </div>
            )}

            {popup === "notifications" && (
                <div className="notification-popup">
                    <h3>Notifications</h3>
                    <p>Britain has requested an alliance with you.</p>
                    <p>Your tax income is ready to collect.</p>
                </div>
            )}
        </div>
    );
}

export default NotificationBar;